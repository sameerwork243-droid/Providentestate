import { NextResponse } from "next/server";
import { getAuthUser } from "@/server/session";
import { hashPassword, deleteAllSessions } from "@/server/auth-core";
import { run, now } from "@/server/db";

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const new_password = String(body.new_password || "");
  const confirm_password = String(body.confirm_password || "");

  if (new_password.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }
  if (!/[A-Za-z]/.test(new_password) || !/\d/.test(new_password)) {
    return NextResponse.json({ error: "New password must contain letters and numbers" }, { status: 400 });
  }
  if (new_password !== confirm_password) {
    return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
  }

  // Update password
  await run(
    "UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?",
    hashPassword(new_password),
    now(),
    user.id
  );

  // Log password update
  await run(
    "INSERT INTO password_updates (user_id, created_at) VALUES (?, ?)",
    user.id,
    now()
  );

  // Invalidate all sessions (including current) �?" user will be logged out
  await deleteAllSessions(user.id);

  return NextResponse.json({ ok: true });
}