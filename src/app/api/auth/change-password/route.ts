import { NextResponse } from "next/server";
import { getAuthUser } from "@/server/session";
import { findUserByEmail, verifyPassword, hashPassword, deleteAllSessions } from "@/server/auth-core";
import { run, now } from "@/server/db";

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const current = String(body.current_password || "");
  const next = String(body.new_password || "");

  if (next.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }
  if (!/[A-Za-z]/.test(next) || !/\d/.test(next)) {
    return NextResponse.json({ error: "New password must contain letters and numbers" }, { status: 400 });
  }

  const record = await findUserByEmail(user.email);
  if (!record || !verifyPassword(current, String(record.password_hash))) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  await run("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?", hashPassword(next), now(), user.id);
  await deleteAllSessions(user.id);

  return NextResponse.json({ ok: true });
}
