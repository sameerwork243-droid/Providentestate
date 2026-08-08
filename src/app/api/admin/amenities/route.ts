import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows, row, run, now } from "@/server/db";

export async function GET() {
  await requireAdmin();
  const items = await rows("SELECT * FROM amenities ORDER BY name");
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  const name = String(body?.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const existing = await row("SELECT id FROM amenities WHERE name = ?", name);
  if (existing) return NextResponse.json({ id: Number(existing.id) });
  const res = await run("INSERT INTO amenities (name) VALUES (?)", name);
  return NextResponse.json({ id: res.lastId }, { status: 201 });
}
