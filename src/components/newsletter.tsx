"use client";

import { useState } from "react";

export function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [fail, setFail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFail("");
    setDone(false);
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setFail("Please enter your name and a valid email address.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "general",
          name: name.trim(),
          email: email.trim(),
          message: "Newsletter subscription",
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFail(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
      setName("");
      setEmail("");
    } catch {
      setFail("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="footer-newsletter-wrap">
      <div className="container">
        <div className="foot-news d-flex">
          <div className="item">
            <h2 className="title">Stay in the loop</h2>
            <p className="description">Get to know about the latest real estate insights.</p>
          </div>
          <div className="newsletter-form-section">
            <form className="newsletter-form" onSubmit={submit} noValidate>
              <div className="input-box-name">
                <input
                  className="input-field newsletter-input-pad"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-box">
                <input
                  className="input-field newsletter-input-pad"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                className="button"
                style={{ background: "#EE7133", borderColor: "#EE7133", color: "#fff" }}
                type="submit"
                disabled={busy}
              >
                {busy ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
            {done && <p className="terms-section" style={{ color: "#155724" }}>Thanks for subscribing — we&apos;ll be in touch.</p>}
            {fail && <p className="terms-section" style={{ color: "#a00" }}>{fail}</p>}
            {!done && (
              <p className="terms-section">
                By subscribing you agree to our <a href="/terms-and-conditions/">Terms &amp; Conditions</a> and{" "}
                <a href="/privacy-policy/">Privacy Policy</a>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}