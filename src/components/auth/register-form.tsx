"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Unable to create your account. Please try again.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <h1>Create your account</h1>
      <p className="auth-subtitle">
        Join Provident Estate to save properties, book viewings and track your inquiries in one place.
      </p>
      {error && <div className="auth-error">{error}</div>}
      <div className="auth-field">
        <label htmlFor="reg-name">Full name</label>
        <input id="reg-name" type="text" autoComplete="name" placeholder="John Smith" value={form.name} onChange={(e) => set("name", e.target.value)} required />
      </div>
      <div className="auth-field">
        <label htmlFor="reg-email">Email address</label>
        <input id="reg-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} required />
      </div>
      <div className="auth-field">
        <label htmlFor="reg-phone">Phone (optional)</label>
        <input id="reg-phone" type="tel" autoComplete="tel" placeholder="+971 50 000 0000" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>
      <div className="auth-field">
        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters with letters and numbers"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          required
        />
      </div>
      <div className="auth-field">
        <label htmlFor="reg-confirm">Confirm password</label>
        <input id="reg-confirm" type="password" autoComplete="new-password" placeholder="Repeat your password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} required />
      </div>
      <button className="portal-btn block" type="submit" disabled={busy}>
        {busy ? "Creating account…" : "Create Account"}
      </button>
      <p className="auth-terms">
        By creating an account you agree to Provident Estate&apos;s terms of use and privacy policy.
      </p>
      <p className="auth-alt">
        Already have an account? <Link href="/login/">Sign in</Link>
      </p>
    </form>
  );
}
