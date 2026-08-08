import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows, row, run } from "@/server/db";

export async function GET(req: Request) {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const where = status ? " WHERE i.status = ?" : "";
  const items = await rows(
    `SELECT i.*, u.name AS user_name, u.email AS user_email
     FROM inquiries i LEFT JOIN users u ON u.id = i.user_id${where}
     ORDER BY i.created_at DESC LIMIT 300`,
    ...(status ? [status] : [])
  );
  return NextResponse.json({ items });
}

export async function PATCH(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  const id = Number(body?.id || 0);
  const status = String(body?.status || "");
  if (!id || !["new", "contacted", "closed"].includes(status)) {
    return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
  }
  const item = await row("SELECT user_id FROM inquiries WHERE id = ?", id);
  if (item) {
    await run("UPDATE inquiries SET status = ? WHERE id = ?", status, id);
    const userId = Number(item.user_id);
    if (userId) {
      await run(
        "INSERT INTO notifications (user_id, title, body, type, created_at) VALUES (?, ?, ?, 'inquiry', ?)",
        userId,
        "Inquiry status updated",
        `Your inquiry is now marked as "${status}".`,
        new Date().toISOString()
      );
    }
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  if (body?.id) await run("DELETE FROM inquiries WHERE id = ?", Number(body.id));
  return NextResponse.json({ ok: true });
}
