import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { row, run, now } from "@/server/db";
import { hashPassword } from "@/server/auth-core";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await ctx.params;
  const uid = Number(id);
  const exists = row("SELECT 1 FROM users WHERE id = ?", uid);
  if (!exists) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const sets: string[] = [];
  const params: unknown[] = [];
  if ("name" in body) {
    const name = String(body.name || "").trim();
    if (name.length < 2) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    sets.push("name = ?");
    params.push(name);
  }
  if ("email" in body) {
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    const clash = row("SELECT 1 FROM users WHERE email = ? AND id != ?", email, uid);
    if (clash) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    sets.push("email = ?");
    params.push(email);
  }
  if ("phone" in body) {
    sets.push("phone = ?");
    params.push(String(body.phone || ""));
  }
  if ("role" in body) {
    const roleRow = row("SELECT id FROM roles WHERE name = ?", String(body.role || "user"));
    if (roleRow) {
      sets.push("role_id = ?");
      params.push(Number(roleRow.id));
    }
  }
  if ("is_active" in body) {
    sets.push("is_active = ?");
    params.push(Number(body.is_active ? 1 : 0));
  }
  if ("password" in body) {
    const password = String(body.password || "");
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return NextResponse.json({ error: "Password must be 8+ chars with letters and numbers" }, { status: 400 });
    }
    sets.push("password_hash = ?");
    params.push(hashPassword(password));
  }
  if (sets.length) {
    sets.push("updated_at = ?");
    params.push(now(), uid);
    run(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, ...params);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await ctx.params;
  run("DELETE FROM users WHERE id = ?", Number(id));
  return NextResponse.json({ ok: true });
}