"use client";

import { useState } from "react";
import { COUNTRIES } from "./phone-flag";

export function PropertyEnquiryForm({
  propertyRef,
  propertySlug,
  route,
}: {
  propertyRef: string;
  propertySlug: string;
  route: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState("+971");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setError("");
    if (message.trim().length < 10) {
      setStatus("err");
      setError("Message must be at least 10 characters");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/user/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "property",
          name: name.trim(),
          email: email.trim(),
          phone: `${dial} ${number.trim()}`.trim(),
          message: message.trim(),
          property_ref: propertyRef,
          property_slug: propertySlug,
        }),
      });
      if (res.status === 401) {
        setStatus("err");
        setError(
          "Please <a href=\"/login\">sign in</a> to send your enquiry."
        );
        return;
      }
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
      setAgree(false);
    } catch {
      setStatus("err");
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="book-a-viewing-form">
      <form className="custom-form" onSubmit={submit} noValidate>
        <div className="form-grid">
          <div className="input-box input-box-name">
            <label className="input-label" htmlFor="bav-name">
              Full Name
            </label>
            <input
              className="input-field"
              type="text"
              id="bav-name"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-box input-box-email">
            <label className="input-label" htmlFor="bav-email">
              Email Address
            </label>
            <input
              className="input-field"
              type="email"
              id="bav-email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box input-box-telephone">
            <label className="input-label" htmlFor="bav-phone">
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
                id="bav-phone"
                name="phone"
                placeholder="Phone Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-box input-box-message">
            <label className="input-label" htmlFor="bav-message">
              Message
            </label>
            <textarea
              className="input-field input-textarea"
              id="bav-message"
              name="message"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div className="input-box input-box-checkbox">
            <label className="input-label">
              <input
                type="checkbox"
                className="checkbox-root"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <span>
                I agree to the{" "}
                <a href="/terms-and-conditions/">Terms &amp; Conditions</a>{" "}
                and{" "}
                <a href="/privacy-policy/">Privacy Policy</a>
              </span>
            </label>
          </div>
        </div>
        <div className="form-bottom">
          {status === "ok" && (
            <p className="success-msg">
              Thank you for your enquiry — one of our consultants will get back
              to you shortly.
            </p>
          )}
          {status === "err" && (
            <p
              className="error-msg"
              dangerouslySetInnerHTML={{ __html: error }}
            ></p>
          )}
          <button
            className="reg-btn button button-orange"
            type="submit"
            disabled={busy}
          >
            <span>{busy ? "Sending…" : "Request Information"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
