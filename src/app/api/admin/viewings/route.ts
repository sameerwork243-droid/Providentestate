import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows, row, run } from "@/server/db";

export async function GET() {
  await requireAdmin();
  const items = rows(
    `SELECT v.*, u.name AS user_name, u.email AS user_email
     FROM viewings v LEFT JOIN users u ON u.id = v.user_id
     ORDER BY v.created_at DESC LIMIT 300`
  );
  return NextResponse.json({ items });
}

export async function PATCH(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  const id = Number(body?.id || 0);
  const status = String(body?.status || "");
  if (!id || !["requested", "confirmed", "completed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
  }
  const item = row("SELECT user_id FROM viewings WHERE id = ?", id);
  if (item) {
    run("UPDATE viewings SET status = ? WHERE id = ?", status, id);
    const userId = Number(item.user_id);
    if (userId) {
      run(
        "INSERT INTO notifications (user_id, title, body, type, created_at) VALUES (?, ?, ?, 'viewing', ?)",
        userId,
        "Viewing update",
        `Your viewing request is now "${status}".`,
        new Date().toISOString()
      );
    }
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  if (body?.id) run("DELETE FROM viewings WHERE id = ?", Number(body.id));
  return NextResponse.json({ ok: true });
}