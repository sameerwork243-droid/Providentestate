import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "./db";
import { ensureSeeded } from "./seed";
import { AuthUser, createSessionToken, deleteSession, getUserByToken, touchLastLogin } from "./auth-core";

export const SESSION_COOKIE = "provident_session";

function ensure() {
  ensureSeeded();
  return getDb();
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  ensure();
  return getUserByToken(token);
}

export async function loginUser(
  userId: number,
  remember: boolean
): Promise<void> {
  ensure();
  const { token, expiresAt } = createSessionToken(userId, remember);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor((expiresAt - Date.now()) / 1000),
  });
  touchLastLogin(userId);
}

export async function logoutUser(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    ensure();
    deleteSession(token);
  }
  jar.delete(SESSION_COOKIE);
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

export async function requireGuest(): Promise<AuthUser | null> {
  const user = await getAuthUser();
  if (user) redirect(user.role === "admin" || user.role === "agent" ? "/admin" : "/dashboard");
  return null;
}
