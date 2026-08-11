"use client";

import { useState } from "react";
import { COUNTRIES } from "./phone-flag";

export function RegisterInterestForm({ projectTitle }: { projectTitle: string }) {
  const [name, setName] = useState("");
  const [dial, setDial] = useState("+971");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "project",
          name: name.trim(),
          email: email.trim(),
          phone: `${dial} ${number.trim()}`.trim(),
          message: `Register interest: ${projectTitle}`,
          property_ref: projectTitle,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setStatus("err");
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("ok");
      setName("");
      setEmail("");
      setNumber("");
    } catch {
      setStatus("err");
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="input-section">
        <input type="text" name="name" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <select name="dial" value={dial} onChange={(e) => setDial(e.target.value)} aria-label="Country code">
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.dial}>
              {c.flag} {c.dial}
            </option>
          ))}
        </select>
        <input type="tel" name="phone" placeholder="Phone Number" value={number} onChange={(e) => setNumber(e.target.value)} />
        <input type="email" name="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      {status === "ok" && (
        <p className="success-msg">Thank you — one of our consultants will get back to you shortly.</p>
      )}
      {status === "err" && <p className="error-msg">{error}</p>}
      <button className="button button-orange" type="submit" disabled={busy}>
        <span>{busy ? "Submitting…" : "Submit"}</span>
      </button>
    </form>
  );
}