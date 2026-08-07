"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BLUE_LOGO } from "@/components/logo-data";

const LOGO_PREFIX = "data:image/svg+xml;base64,";

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
    <div className="login-container">
      <div className="login-banner">
        <div className="login-banner-overlay" />
      </div>

      <div className="login-panel">
        <Link href="/" className="back-link">
          ← Back to website
        </Link>

        <div className="login-card">
          <img className="login-card-logo" draggable="false" src={LOGO_PREFIX + BLUE_LOGO} alt="Provident Estate" />
          <h1 className="brand-title">Provident.</h1>
          
          <h2 className="login-heading">Login to your account</h2>
          
          <p className="signup-prompt">
            Don't have an account yet? <Link href="/register/">Sign Up</Link>
          </p>

          <div className="divider">
            <span>or login with email</span>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="form-group">
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

            <div className="form-group">
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

            <div className="forgot-password">
              <Link href="/forgot-password/">Forgot your password?</Link>
            </div>

            <p className="terms-text">
              By clicking "Continue" you agree to our <Link href="/privacy">Privacy Policy</Link>.
            </p>

            <button className="continue-btn" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}