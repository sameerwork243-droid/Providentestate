import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows, run } from "@/server/db";

export async function GET() {
  await requireAdmin();
  return NextResponse.json({ items: rows("SELECT * FROM categories ORDER BY sort, name") });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const slug = String(body?.slug || "").trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const res = run("INSERT INTO categories (name, slug, type, sort) VALUES (?, ?, ?, ?)", name, slug, String(body?.type || ""), Number(body?.sort || 0));
  return NextResponse.json({ id: res.lastId }, { status: 201 });
}

export async function PUT(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id") || 0);
  const body = await req.json().catch(() => null);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  run(
    "UPDATE categories SET name = ?, slug = ?, type = ?, sort = ? WHERE id = ?",
    String(body?.name ?? ""),
    String(body?.slug ?? ""),
    String(body?.type ?? ""),
    Number(body?.sort ?? 0),
    id
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id") || 0);
  if (id) run("DELETE FROM categories WHERE id = ?", id);
  return NextResponse.json({ ok: true });
}