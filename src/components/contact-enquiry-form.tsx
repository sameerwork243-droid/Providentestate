"use client";

import { useId, useState } from "react";
import { COUNTRIES } from "./phone-flag";

export function ContactEnquiryForm() {
  const uid = useId().replace(/[:]/g, "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState("+971");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
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
          kind: "contact",
          name: name.trim(),
          email: email.trim(),
          phone: `${dial} ${number.trim()}`.trim(),
          message: message.trim(),
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
      setMessage("");
    } catch {
      setStatus("err");
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="custom-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <div className="form-section">
          <div className="input-box input-box-name">
            <label className="input-label" htmlFor={`cef-name-${uid}`}>
              Full Name
            </label>
            <input
              className="input-field"
              type="text"
              name="name"
              id={`cef-name-${uid}`}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-box input-box-telephone">
            <label className="input-label" htmlFor={`cef-phone-${uid}`}>
              Phone Number
            </label>
            <div className="phone-field-row">
              <select
                className="input-field country-select"
                aria-label="Country code"
                value={dial}
                onChange={(e) => setDial(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.dial}>
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>
              <input
                className="input-field"
                type="tel"
                name="phone"
                id={`cef-phone-${uid}`}
                placeholder="Phone Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="input-box input-box-email">
            <label className="input-label" htmlFor={`cef-email-${uid}`}>
              Email Address
            </label>
            <input
              className="input-field"
              type="email"
              name="email"
              id={`cef-email-${uid}`}
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box input-box-message">
            <label className="input-label" htmlFor={`cef-message-${uid}`}>
              Message
            </label>
            <textarea
              className="input-field input-textarea"
              name="message"
              id={`cef-message-${uid}`}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="form-bottom">
        {status === "ok" && (
          <p className="success-msg">
            Thank you for your enquiry — one of our consultants will get back to you shortly.
          </p>
        )}
        {status === "err" && <p className="error-msg">{error}</p>}
        <button className="reg-btn button button-orange" type="submit" disabled={busy}>
          <span>{busy ? "Submitting…" : "Submit"}</span>
        </button>
      </div>
    </form>
  );
}