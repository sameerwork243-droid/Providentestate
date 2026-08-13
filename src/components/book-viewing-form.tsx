"use client";

import { useMemo, useState } from "react";
import { COUNTRIES } from "./phone-flag";

const LANGUAGES = ["English", "Arabic", "Russian", "Hindi", "Urdu", "Chinese", "French", "German"];

function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 10);
}

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export function BookViewingForm({
  propertyRef,
  propertySlug,
  propertyTitle,
}: {
  propertyRef?: string;
  propertySlug?: string;
  propertyTitle?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState("+92");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("");
  const [language, setLanguage] = useState("English");
  const [mortgage, setMortgage] = useState(false);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [fail, setFail] = useState("");
  const minDate = useMemo(todayISO, []);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your full name";
    else if (name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!email.trim()) e.email = "Please enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = "Please enter a valid email address";
    if (!number.trim()) e.phone = "Please enter your phone number";
    else if (number.replace(/\D/g, "").length < 7) e.phone = "Please enter a valid phone number";
    if (!date) e.date = "Please select a viewing date";
    else if (date < minDate) e.date = "Please select today or a future date";
    if (!time) e.time = "Please select a viewing time";
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setFail("");
    setDone(false);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const message =
        `Viewing request for "${propertyTitle || propertyRef || ""}"\n` +
        `Preferred date: ${fmtDate(date)}\n` +
        `Preferred time: ${time}\n` +
        `Preferred language: ${language}\n` +
        `Interested in mortgage advice: ${mortgage ? "Yes" : "No"}` +
        (notes.trim() ? `\nMessage: ${notes.trim()}` : "");
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "viewing",
          name: name.trim(),
          email: email.trim(),
          phone: `${dial} ${number.trim()}`.trim(),
          message,
          property_ref: propertyRef || "",
          property_slug: propertySlug || "",
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFail(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setFail("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="bv-success">
        <div className="bv-success-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="bv-success-title">Viewing Request Submitted</h3>
        <p className="bv-success-text">
          Your viewing request has been received. Our team will contact you shortly.
        </p>
        {propertyTitle && <p className="bv-success-prop">{propertyTitle}</p>}
      </div>
    );
  }

  return (
    <form className="bv-form" onSubmit={submit} noValidate>
      <div className="bv-form-grid">
        <div className="bv-field">
          <label className="bv-label" htmlFor="bv-name">
            Name <span className="bv-req">*</span>
          </label>
          <input
            className="bv-input"
            id="bv-name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <span className="bv-error">{errors.name}</span>}
        </div>

        <div className="bv-field">
          <label className="bv-label" htmlFor="bv-email">
            Email <span className="bv-req">*</span>
          </label>
          <input
            className="bv-input"
            id="bv-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="bv-error">{errors.email}</span>}
        </div>

        <div className="bv-field">
          <label className="bv-label" htmlFor="bv-phone">
            Phone <span className="bv-req">*</span>
          </label>
          <div className="bv-phone-row">
            <select
              className="bv-input bv-country"
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
              className="bv-input"
              id="bv-phone"
              type="tel"
              placeholder="Phone Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              aria-invalid={!!errors.phone}
            />
          </div>
          {errors.phone && <span className="bv-error">{errors.phone}</span>}
        </div>

        <div className="bv-field">
          <label className="bv-label" htmlFor="bv-date">
            Date <span className="bv-req">*</span>
          </label>
          <input
            className="bv-input"
            id="bv-date"
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={!!errors.date}
          />
          {errors.date && <span className="bv-error">{errors.date}</span>}
        </div>

        <div className="bv-field">
          <label className="bv-label" htmlFor="bv-time">
            Time <span className="bv-req">*</span>
          </label>
          <input
            className="bv-input"
            id="bv-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            aria-invalid={!!errors.time}
          />
          {errors.time && <span className="bv-error">{errors.time}</span>}
        </div>

        <div className="bv-field">
          <label className="bv-label" htmlFor="bv-language">
            Preferred Language <span className="bv-req">*</span>
          </label>
          <select
            className="bv-input"
            id="bv-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="bv-field bv-field-full">
          <label className="bv-label" htmlFor="bv-message">
            Message
          </label>
          <textarea
            className="bv-input bv-textarea"
            id="bv-message"
            placeholder="Any questions or special requests?"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <label className="bv-check">
          <input type="checkbox" checked={mortgage} onChange={(e) => setMortgage(e.target.checked)} />
          <span>Interested in mortgage advice?</span>
        </label>

        <div className="bv-submit-row">
          {fail && <p className="bv-fail">{fail}</p>}
          <button className="bv-submit" type="submit" disabled={busy}>
            <span>{busy ? "Submitting…" : "Submit Details"}</span>
          </button>
          <p className="bv-footnote">
            By clicking Submit, you agree to our{" "}
            <a href="/terms-and-conditions/">Terms &amp; Conditions</a> and{" "}
            <a href="/privacy-policy/">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </form>
  );
}