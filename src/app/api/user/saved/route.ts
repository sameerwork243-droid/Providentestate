import { NextResponse } from "next/server";
import { getAuthUser } from "@/server/session";
import { rows, row, run, now } from "@/server/db";

export async function GET(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  if (ref) {
    const s = row("SELECT id FROM saved_properties WHERE user_id = ? AND property_ref = ?", user.id, ref);
    return NextResponse.json({ saved: Boolean(s) });
  }
  const items = rows(
    "SELECT id, property_ref, property_slug, title, price, thumb, created_at FROM saved_properties WHERE user_id = ? ORDER BY created_at DESC",
    user.id
  );
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const ref = String(body?.property_ref || "").trim();
  if (!ref) return NextResponse.json({ error: "Missing property reference" }, { status: 400 });

  const existing = row("SELECT id FROM saved_properties WHERE user_id = ? AND property_ref = ?", user.id, ref);
  if (existing) {
    run("DELETE FROM saved_properties WHERE id = ?", Number(existing.id));
    return NextResponse.json({ saved: false });
  }

  run(
    "INSERT INTO saved_properties (user_id, property_ref, property_slug, title, price, thumb, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    user.id,
    ref,
    String(body?.property_slug || ""),
    String(body?.title || ""),
    Number(body?.price || 0),
    String(body?.thumb || ""),
    now()
  );
  return NextResponse.json({ saved: true });
}

export async function DELETE(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const ref = String(body?.property_ref || "");
  if (ref) run("DELETE FROM saved_properties WHERE user_id = ? AND property_ref = ?", user.id, ref);
  return NextResponse.json({ saved: false });
}
