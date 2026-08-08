import { NextResponse } from "next/server";
import { row, run, now } from "@/server/db";
import { ensureSeeded } from "@/server/seed";
import { hashPassword, findUserByEmail } from "@/server/auth-core";
import { loginUser, getAuthUser } from "@/server/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  await ensureSeeded();
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ error: "Please enter your full name" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return NextResponse.json({ error: "Password must contain letters and numbers" }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const userRole = await row("SELECT id FROM roles WHERE name = 'user'") as { id: number } | undefined;
  const res = await run(
    "INSERT INTO users (email, password_hash, name, phone, role_id, is_active, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)",
    email,
    hashPassword(password),
    name,
    phone,
    userRole?.id ?? 2,
    now()
  );

  await loginUser(res.lastId, true);

  const user = await getAuthUser();
  return NextResponse.json({ user });
}
