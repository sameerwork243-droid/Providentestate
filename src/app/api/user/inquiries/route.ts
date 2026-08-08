import { NextResponse } from "next/server";
import { getAuthUser } from "@/server/session";
import { rows, run, now } from "@/server/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const items = await rows(
    "SELECT * FROM inquiries WHERE user_id = ? ORDER BY created_at DESC",
    user.id
  );
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const kind = ["property", "viewing", "contact", "general"].includes(String(body.kind)) ? String(body.kind) : "property";
  const message = String(body.message || "").trim();
  if (message.length < 10) {
    return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 });
  }
  const res = await run(
    "INSERT INTO inquiries (user_id, name, email, phone, kind, property_ref, property_slug, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)",
    user.id,
    String(body.name || user.name || ""),
    String(body.email || user.email || ""),
    String(body.phone || ""),
    kind,
    String(body.property_ref || ""),
    String(body.property_slug || ""),
    message,
    now()
  );
  return NextResponse.json({ id: res.lastId });
}
