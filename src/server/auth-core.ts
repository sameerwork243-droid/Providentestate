import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { row, run } from "./db";

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  role: string;
  last_login_at: string | null;
  created_at: string;
}

export function createSessionToken(userId: number, remember: boolean): { token: string; expiresAt: number } {
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + (remember ? REMEMBER_TTL_MS : SESSION_TTL_MS);
  run(
    "INSERT INTO sessions (user_id, token_hash, expires_at, user_agent, ip, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    userId,
    hashToken(token),
    expiresAt,
    "",
    "",
    new Date().toISOString()
  );
  return { token, expiresAt };
}

export function getUserByToken(token: string | undefined | null): AuthUser | null {
  if (!token) return null;
  const s = row<{ user_id: number; expires_at: number }>(
    "SELECT user_id, expires_at FROM sessions WHERE token_hash = ?",
    hashToken(token)
  );
  if (!s) return null;
  if (s.expires_at < Date.now()) {
    run("DELETE FROM sessions WHERE token_hash = ?", hashToken(token));
    return null;
  }
  const u = row<Record<string, unknown>>(
    `SELECT u.id, u.email, u.name, u.phone, u.avatar, r.name AS role, u.last_login_at, u.created_at
     FROM users u JOIN roles r ON r.id = u.role_id
     WHERE u.id = ? AND u.is_active = 1`,
    s.user_id
  );
  if (!u) return null;
  return {
    id: Number(u.id),
    email: String(u.email),
    name: String(u.name),
    phone: String(u.phone || ""),
    avatar: String(u.avatar || ""),
    role: String(u.role),
    last_login_at: u.last_login_at ? String(u.last_login_at) : null,
    created_at: String(u.created_at),
  };
}

export function deleteSession(token: string): void {
  run("DELETE FROM sessions WHERE token_hash = ?", hashToken(token));
}

export function deleteAllSessions(userId: number): void {
  run("DELETE FROM sessions WHERE user_id = ?", userId);
}

export function touchLastLogin(userId: number): void {
  run("UPDATE users SET last_login_at = ? WHERE id = ?", new Date().toISOString(), userId);
}

export function findUserByEmail(email: string): Record<string, unknown> | undefined {
  return row(
    `SELECT u.id, u.email, u.password_hash, u.name, u.phone, u.avatar, u.role_id, u.is_active, r.name AS role
     FROM users u JOIN roles r ON r.id = u.role_id WHERE u.email = ?`,
    email.trim().toLowerCase()
  );
}