"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export function LoginForm({ initialEmail = "" }: { initialEmail?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Unable to sign in. Please try again.");
        return;
      }
      router.push(data.user?.role === "admin" || data.user?.role === "agent" ? "/admin" : "/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <img className="portal-auth-logo" draggable="false" src="/lloo.png" alt="Zoya Ventures Real Estate" />
      <h1>Login to your account</h1>
      <p className="auth-subtitle">Welcome back. Enter your details to access your account.</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={onSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="auth-email">Email Address *</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="auth-password">Password *</label>
          <input
            id="auth-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="auth-row">
          <span />
          <Link href="/forgot-password/">Forgot your password?</Link>
        </div>

        <p className="auth-terms">
          By clicking "Continue" you agree to our <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <button className="portal-btn block" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Continue"}
        </button>
      </form>

      <p className="auth-alt">
        Don&apos;t have an account yet? <Link href="/register/">Sign Up</Link>
      </p>
    </>
  );
}
