import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows, run } from "@/server/db";

export async function GET() {
  await requireAdmin();
  return NextResponse.json({ items: rows("SELECT * FROM contact_info ORDER BY key") });
}

export async function PUT(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  const updates = Array.isArray(body?.items) ? body.items : body ? [body] : [];
  for (const it of updates) {
    const key = String(it?.key || "").trim();
    if (!key) continue;
    run("INSERT INTO contact_info (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", key, String(it?.value ?? ""));
  }
  return NextResponse.json({ ok: true });
}