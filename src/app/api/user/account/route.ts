import { NextResponse } from "next/server";
import { getAuthUser } from "@/server/session";
import { run, now } from "@/server/db";

export async function DELETE(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const reason = String(body.reason || "").trim();

  // Log account deletion
  run(
    "INSERT INTO account_deletion_logs (user_id, reason, created_at) VALUES (?, ?, ?)",
    user.id,
    reason,
    now()
  );

  // Delete user (cascades to sessions, saved_properties, viewings, notifications, user_addresses, notification_preferences, password_updates)
  run("DELETE FROM users WHERE id = ?", user.id);

  // Inquiries have ON DELETE SET NULL, so they remain but user_id is cleared

  return NextResponse.json({ ok: true });
}