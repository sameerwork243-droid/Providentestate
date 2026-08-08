import { NextResponse } from "next/server";
import { ensureSeeded } from "@/server/seed";
import { findUserByEmail, verifyPassword } from "@/server/auth-core";
import { loginUser } from "@/server/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  await ensureSeeded();
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const remember = Boolean(body.remember);

  if (!EMAIL_RE.test(email) || !password) {
    return NextResponse.json({ error: "Please enter your email and password" }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, String(user.password_hash))) {
    return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
  }
  if (!Number(user.is_active)) {
    return NextResponse.json({ error: "This account has been deactivated" }, { status: 403 });
  }

  await loginUser(Number(user.id), remember);

  return NextResponse.json({
    user: {
      id: Number(user.id),
      email: String(user.email),
      name: String(user.name),
      phone: String(user.phone || ""),
      avatar: String(user.avatar || ""),
      role: String(user.role),
    },
  });
}
