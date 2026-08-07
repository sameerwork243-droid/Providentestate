import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows, row, run, now } from "@/server/db";
import { hashPassword } from "@/server/auth-core";

export async function GET(req: Request) {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const where = q ? " WHERE (u.email LIKE ? OR u.name LIKE ?)" : "";
  const params: unknown[] = q ? [`%${q}%`, `%${q}%`] : [];
  const items = rows(
    `SELECT u.id, u.email, u.name, u.phone, u.avatar, u.is_active, u.last_login_at, u.created_at,
       COALESCE(r.name, 'user') AS role
     FROM users u LEFT JOIN roles r ON r.id = u.role_id${where} ORDER BY u.id DESC LIMIT 200`,
    ...params
  );
  return NextResponse.json({ items, total: items.length });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim();
  const password = String(body.password || "");
  if (name.length < 2) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return NextResponse.json({ error: "Password must be 8+ chars with letters and numbers" }, { status: 400 });
  }
  const clash = row("SELECT 1 FROM users WHERE email = ?", email);
  if (clash) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  const role = String(body.role || "user");
  const roleRow = row("SELECT id FROM roles WHERE name = ?", role);
  const res = run(
    "INSERT INTO users (email, password_hash, name, phone, role_id, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    email,
    hashPassword(password),
    name,
    String(body.phone || ""),
    Number(roleRow?.id || 2),
    Number(body.is_active ?? 1),
    now()
  );
  return NextResponse.json({ id: res.lastId }, { status: 201 });
}
