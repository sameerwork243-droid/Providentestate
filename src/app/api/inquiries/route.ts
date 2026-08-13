import { NextResponse } from "next/server";
import { getAuthUser } from "@/server/session";
import { run, now } from "@/server/db";

const KINDS = new Set(["property", "contact", "viewing", "quiz", "careers", "general", "listing"]);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide your name and a valid email address" }, { status: 400 });
  }
  const kind = KINDS.has(String(body.kind || "")) ? String(body.kind) : "general";
  const user = await getAuthUser().catch(() => null);
  const res = await run(
    `INSERT INTO inquiries (user_id, name, email, phone, kind, property_ref, property_slug, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
    user?.id ?? null,
    name,
    email,
    String(body.phone || "").slice(0, 60),
    kind,
    String(body.property_ref || ""),
    String(body.property_slug || ""),
    String(body.message || "").slice(0, 8000),
    now()
  );
  return NextResponse.json({ ok: true, id: res.lastId }, { status: 201 });
}