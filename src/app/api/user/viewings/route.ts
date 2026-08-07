import { NextResponse } from "next/server";
import { getAuthUser } from "@/server/session";
import { rows, run, now } from "@/server/db";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const items = rows("SELECT * FROM viewings WHERE user_id = ? ORDER BY created_at DESC", user.id);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const preferredDate = String(body.preferred_date || "").trim();
  if (!preferredDate) {
    return NextResponse.json({ error: "Please choose a preferred date" }, { status: 400 });
  }
  const res = run(
    "INSERT INTO viewings (user_id, property_ref, property_slug, preferred_date, time_slot, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'requested', ?)",
    user.id,
    String(body.property_ref || ""),
    String(body.property_slug || ""),
    preferredDate,
    String(body.time_slot || ""),
    String(body.notes || ""),
    now()
  );
  return NextResponse.json({ id: res.lastId });
}
