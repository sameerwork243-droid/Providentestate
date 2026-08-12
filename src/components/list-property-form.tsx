"use client";

import { useId, useState } from "react";
import { COUNTRIES } from "./phone-flag";

const PROPERTY_TYPES = ["Apartment", "Villa", "Townhouse", "Penthouse", "Office", "Shop", "Studio", "Plot / Land", "Warehouse", "Other"];
const BEDROOMS = ["Studio", "1", "2", "3", "4", "5", "6", "7+"];
const BATHROOMS = ["1", "2", "3", "4", "5", "6+"];
const OWNERSHIP = ["Title Deed Available", "Off-Plan / Under Construction", "Other"];
const LANGUAGES = ["English", "Arabic", "Hindi", "Urdu", "Russian", "Chinese", "French", "German", "Portuguese", "Other"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ListPropertyForm() {
  const uid = useId().replace(/[:]/g, "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState("+971");
  const [number, setNumber] = useState("");
  const [transaction, setTransaction] = useState("Sale");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [area, setArea] = useState("");
  const [language, setLanguage] = useState("English");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [ownership, setOwnership] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setError("");
    if (!name.trim()) {
      setError("Please enter your full name.");
      setStatus("err");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      setStatus("err");
      return;
    }
    if (!/^[0-9\s\-+()]{7,16}$/.test(number.trim())) {
      setError("Please enter a valid phone number.");
      setStatus("err");
      return;
    }
    if (!transaction.trim()) {
      setError("Please select what you would like to do.");
      setStatus("err");
      return;
    }
    if (!propertyType.trim()) {
      setError("Please select a property type.");
      setStatus("err");
      return;
    }
    if (!area.trim()) {
      setError("Please enter the community or area.");
      setStatus("err");
      return;
    }
    if (!language.trim()) {
      setError("Please select your preferred language.");
      setStatus("err");
      return;
    }
    if (!bedrooms.trim()) {
      setError("Please select the number of bedrooms.");
      setStatus("err");
      return;
    }
    if (!bathrooms.trim()) {
      setError("Please select the number of bathrooms.");
      setStatus("err");
      return;
    }
    if (!size.trim() || Number.isNaN(Number(size))) {
      setError("Please enter the property size in sq ft.");
      setStatus("err");
      return;
    }
    if (!price.trim() || Number.isNaN(Number(price))) {
      setError("Please enter the expected price.");
      setStatus("err");
      return;
    }
    if (!ownership.trim()) {
      setError("Please select the ownership status.");
      setStatus("err");
      return;
    }
    if (!address.trim()) {
      setError("Please enter the property address.");
      setStatus("err");
      return;
    }
    if (!consent) {
      setError("Please tick the consent box to continue.");
      setStatus("err");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        kind: "listing",
        name: name.trim(),
        email: email.trim(),
        phone: `${dial} ${number.trim()}`.trim(),
        property_slug: "List Your Property",
        message: JSON.stringify({
          transaction: transaction.trim(),
          property_type: propertyType,
          community: area.trim(),
          preferred_language: language,
          bedrooms,
          bathrooms,
          size_sqft: size.trim(),
          expected_price: price.trim(),
          ownership,
          property_address: address.trim(),
          message: message.trim(),
        }),
      };
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      setArea("");
      setSize("");
      setPrice("");
      setOwnership("");
      setAddress("");
      setMessage("");
      setConsent(false);
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
            <label className="input-label" htmlFor={`lp-name-${uid}`}>
              Full Name
            </label>
            <input
              className="input-field"
              type="text"
              name="name"
              id={`lp-name-${uid}`}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-box input-box-telephone">
            <label className="input-label" htmlFor={`lp-phone-${uid}`}>
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
                id={`lp-phone-${uid}`}
                placeholder="Phone Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-box input-box-email">
            <label className="input-label" htmlFor={`lp-email-${uid}`}>
              Email Address
            </label>
            <input
              className="input-field"
              type="email"
              name="email"
              id={`lp-email-${uid}`}
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-section">
          <div className="input-box">
            <label className="input-label" htmlFor={`lp-tx-${uid}`}>
              I want to
            </label>
            <select
              className="input-field"
              id={`lp-tx-${uid}`}
              value={transaction}
              onChange={(e) => setTransaction(e.target.value)}
            >
              <option value="Sale">Sell my property</option>
              <option value="Rent">Rent out my property</option>
            </select>
          </div>
          <div className="input-box">
            <label className="input-label" htmlFor={`lp-type-${uid}`}>
              Property Type
            </label>
            <select
              className="input-field"
              id={`lp-type-${uid}`}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box">
            <label className="input-label" htmlFor={`lp-area-${uid}`}>
              Community / Area
            </label>
            <input
              className="input-field"
              type="text"
              id={`lp-area-${uid}`}
              placeholder="e.g. Dubai Marina"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <div className="input-box">
            <label className="input-label" htmlFor={`lp-lang-${uid}`}>
              Preferred Language
            </label>
            <select
              className="input-field"
              id={`lp-lang-${uid}`}
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
          <div className="input-box">
            <label className="input-label" htmlFor={`lp-beds-${uid}`}>
              Bedrooms
            </label>
            <select
              className="input-field"
              id={`lp-beds-${uid}`}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              {BEDROOMS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box">
            <label className="input-label" htmlFor={`lp-baths-${uid}`}>
              Bathrooms
            </label>
            <select
              className="input-field"
              id={`lp-baths-${uid}`}
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
            >
              {BATHROOMS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box">
            <label className="input-label" htmlFor={`lp-size-${uid}`}>
              Size (sq ft)
            </label>
            <input
              className="input-field"
              type="number"
              min="0"
              id={`lp-size-${uid}`}
              placeholder="e.g. 1,500"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
          <div className="input-box">
            <label className="input-label" htmlFor={`lp-price-${uid}`}>
              Expected Price (AED)
            </label>
            <input
              className="input-field"
              type="number"
              min="0"
              id={`lp-price-${uid}`}
              placeholder="e.g. 2,500,000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="input-box">
            <label className="input-label" htmlFor={`lp-own-${uid}`}>
              Ownership Status
            </label>
            <select
              className="input-field"
              id={`lp-own-${uid}`}
              value={ownership}
              onChange={(e) => setOwnership(e.target.value)}
            >
              <option value="">Select ownership status</option>
              {OWNERSHIP.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box">
            <label className="input-label" htmlFor={`lp-addr-${uid}`}>
              Property Address
            </label>
            <input
              className="input-field"
              type="text"
              id={`lp-addr-${uid}`}
              placeholder="e.g. Marina Gate 1, Dubai Marina"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="input-box input-box-message">
            <label className="input-label" htmlFor={`lp-msg-${uid}`}>
              Additional Details
            </label>
            <textarea
              className="input-field input-textarea"
              id={`lp-msg-${uid}`}
              placeholder="Tell us more about your property"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="form-bottom">
        {status === "ok" && (
          <p className="success-msg">
            Thank you — your property details have been received. One of our consultants will contact you shortly.
          </p>
        )}
        {status === "err" && <p className="error-msg">{error}</p>}
        <label className="bv-check">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>I consent to being contacted about my property and agree to the{" "}<a href="/terms-and-conditions/">Terms &amp; Conditions</a> and <a href="/privacy-policy/">Privacy Policy</a>.</span>
        </label>
        <button className="reg-btn button button-orange" type="submit" disabled={busy}>
          <span>{busy ? "Submitting…" : "Submit Details"}</span>
        </button>
      </div>
    </form>
  );
}