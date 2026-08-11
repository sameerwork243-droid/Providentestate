"use client";

import { useEffect, useState } from "react";
import { COUNTRIES, CountryFlag } from "./phone-flag";

const big = (u: string) => u.replace(/\/340x252\//, "/696x520/");

const TYPE_IMAGES: Record<string, string> = {
  apartments: big("https://d3h330vgpwpjr8.cloudfront.net/x/property/PS-20012631/images/iblock/655/6554193dedbb2fed4c9309c4a2a23020/340x252/download-_1_.webp"),
  villas: big("https://d3h330vgpwpjr8.cloudfront.net/x/property/PS-2804264/images/iblock/c8c/c8c6468b86c4718f6901fa53bb3b9a4d/340x252/2.webp"),
  townhouses: big("https://d3h330vgpwpjr8.cloudfront.net/x/property/PS-1912251/images/iblock/394/394122d0270bff6ffc30e6b976640d0e/340x252/download-_1_.webp"),
  penthouses: big("https://d3h330vgpwpjr8.cloudfront.net/x/property/PS-1307263/images/iblock/896/89694d014dc245b0f3f228b81f02fceb/340x252/img129.webp"),
};

const AREA_IMAGES: Record<string, string> = {
  "downtown-dubai": big("https://d3h330vgpwpjr8.cloudfront.net/x/property/PR-22102512/images/iblock/684/8ees868xdreat1jwfitb9vq4l2z2xcjx/340x252/ADU00171.webp"),
  "dubai-hills-estate": big("https://d3h330vgpwpjr8.cloudfront.net/x/property/PS-11022626/images/iblock/fe8/00ih8rzvvjuz0lhzfitqasdpthw9rveo/340x252/img187.webp"),
  "dubai-marina": big("https://d3h330vgpwpjr8.cloudfront.net/x/property/PS-3103262/images/iblock/fb4/fb4a80fb9ee723cdbf358a57665c2d83/340x252/download-_1_.webp"),
  "palm-jumeirah": big("https://d3h330vgpwpjr8.cloudfront.net/x/property/PS-2007262/images/iblock/247/247f4cf40fec49aee0580a536cbec3ff/340x252/Pl_1.webp"),
};

type AnswerKey = "propertyType" | "area" | "budget" | "bedrooms" | "buyerType" | "purchaseTimeline" | "communicationMethod" | "preferredContactTime";

type QuizState = Record<AnswerKey, string> & {
  name: string;
  email: string;
  phone: string;
  preferredLanguage: string;
};

const INITIAL_QUIZ: QuizState = {
  propertyType: "", area: "", budget: "", bedrooms: "", buyerType: "",
  purchaseTimeline: "", communicationMethod: "", preferredContactTime: "",
  name: "", email: "", phone: "", preferredLanguage: "",
};

const QUESTIONS: { key: AnswerKey; heading: string; rows: number; options: { id: string; label: string; img?: string; icon?: string }[] }[] = [
  {
    key: "propertyType",
    heading: "What is the ideal property type for you?",
    rows: 2,
    options: [
      { id: "apartments", label: "Apartments", img: TYPE_IMAGES.apartments },
      { id: "villas", label: "Villas", img: TYPE_IMAGES.villas },
      { id: "townhouses", label: "Townhouses", img: TYPE_IMAGES.townhouses },
      { id: "penthouses", label: "Penthouses", img: TYPE_IMAGES.penthouses },
    ],
  },
  {
    key: "area",
    heading: "What is your area of preference in Dubai?",
    rows: 2,
    options: [
      { id: "downtown-dubai", label: "Downtown Dubai", img: AREA_IMAGES["downtown-dubai"] },
      { id: "business-bay", label: "Business Bay" },
      { id: "arabian-ranches", label: "Arabian Ranches" },
      { id: "dubai-hills-estate", label: "Dubai Hills Estate", img: AREA_IMAGES["dubai-hills-estate"] },
      { id: "dubai-marina", label: "Dubai Marina", img: AREA_IMAGES["dubai-marina"] },
      { id: "damac-islands", label: "Damac Islands" },
      { id: "palm-jumeirah", label: "Palm Jumeirah", img: AREA_IMAGES["palm-jumeirah"] },
      { id: "dubai-creek-harbour", label: "Dubai Creek Harbour" },
      { id: "palm-jebel-ali", label: "Palm Jebel Ali" },
      { id: "expo-city", label: "Expo City" },
    ],
  },
  {
    key: "budget",
    heading: "What is your ideal budget?",
    rows: 1,
    options: [
      { id: "not-decided", label: "Not yet Decided" },
      { id: "under-250k", label: "Less than $250,000" },
      { id: "250k-500k", label: "$250,000 - $500,000" },
      { id: "500k-1m", label: "$500,000 - $1,000,000" },
      { id: "1m-3m", label: "$1,000,000 - $3,000,000" },
      { id: "above-3m", label: "Above $3,000,000" },
      { id: "open-budget", label: "Open Budget" },
    ],
  },
  {
    key: "bedrooms",
    heading: "How many bedrooms would you like in your property?",
    rows: 1,
    options: [
      { id: "studio", label: "Studio" },
      { id: "1", label: "1 Bedroom" },
      { id: "2", label: "2 Bedrooms" },
      { id: "3", label: "3 Bedrooms" },
      { id: "4", label: "4 Bedrooms" },
      { id: "5-plus", label: "5 Bedrooms and above" },
    ],
  },
  {
    key: "buyerType",
    heading: "Are you an end-user or an investor?",
    rows: 1,
    options: [
      { id: "end-user", label: "I'm an End-user" },
      { id: "investor", label: "I'm an Investor" },
    ],
  },
  {
    key: "purchaseTimeline",
    heading: "When are you looking to buy a property in Dubai?",
    rows: 1,
    options: [
      { id: "immediately", label: "Immediately" },
      { id: "within-1-month", label: "Within 1 month" },
      { id: "within-3-months", label: "Within 3 months" },
      { id: "within-6-months", label: "Within 6 months" },
      { id: "exploring", label: "I am just exploring options at this stage" },
    ],
  },
  {
    key: "communicationMethod",
    heading: "Preferred way of communication?",
    rows: 1,
    options: [
      { id: "call", label: "Call", icon: "phone" },
      { id: "email", label: "Email", icon: "email" },
      { id: "whatsapp", label: "WhatsApp", icon: "whatsapp" },
    ],
  },
  {
    key: "preferredContactTime",
    heading: "Preferred time to contact?",
    rows: 1,
    options: [
      { id: "morning", label: "Morning" },
      { id: "afternoon", label: "Afternoon" },
      { id: "night", label: "Night" },
    ],
  },
];

const LANGUAGES = ["English", "Arabic", "Russian", "French", "German", "Hindi", "Urdu", "Chinese", "Spanish"];

function Icon({ name }: { name: string }) {
  switch (name) {
    case "phone":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "email":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.353.097 11.933c0 2.096.548 4.142 1.588 5.946L0 24l6.305-1.651a11.91 11.91 0 0 0 5.696 1.449h.005c6.582 0 11.94-5.353 11.948-11.934.002-3.188-1.244-6.185-3.434-8.415" />
        </svg>
      );
    default:
      return null;
  }
}

export function DreamHomeQuiz() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [quiz, setQuiz] = useState<QuizState>({ ...INITIAL_QUIZ });
  const [country, setCountry] = useState("AE");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fail, setFail] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const q = QUESTIONS[step];
  const isDetails = step === QUESTIONS.length;
  const answered = isDetails || !q || !!quiz[q.key];

  function pick(id: string) {
    setQuiz((s) => ({ ...s, [q.key]: s[q.key] === id ? "" : id }));
  }
  function next() {
    if (!answered || !q) return;
    setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (quiz.name.trim().length < 2) errs.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quiz.email.trim())) errs.email = "Please enter a valid email";
    if (quiz.phone.replace(/\D/g, "").length < 6) errs.phone = "Please enter a valid phone number";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setFail("");
    const message = [
      `Property type: ${quiz.propertyType || "-"}`,
      `Area: ${quiz.area || "-"}`,
      `Budget: ${quiz.budget || "-"}`,
      `Bedrooms: ${quiz.bedrooms || "-"}`,
      `Buyer type: ${quiz.buyerType || "-"}`,
      `Timeline: ${quiz.purchaseTimeline || "-"}`,
      `Communication: ${quiz.communicationMethod || "-"}`,
      `Preferred time: ${quiz.preferredContactTime || "-"}`,
      `Preferred language: ${quiz.preferredLanguage || "-"}`,
    ].join("\n");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "quiz",
          name: quiz.name.trim(),
          email: quiz.email.trim(),
          phone: `${COUNTRIES.find((c) => c.code === country)?.dial || ""} ${quiz.phone.trim()}`.trim(),
          message,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Submission failed");
      setSubmitted(true);
    } catch (err: any) {
      setFail(err?.message || "Submission failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const selected = (id: string) => !!q && quiz[q.key] === id;

  return (
    <>
      <button type="button" className="button button-orange cursur" onClick={() => setOpen(true)}>
        Find My Dream Home!
      </button>

      {open && (
        <div className="dhq-overlay" onClick={() => setOpen(false)}>
          <div className="dhq-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="dhq-head">
              {isDetails ? (
                <>
                  <div className="dhq-title">Personal Details</div>
                  <div className="dhq-subtitle">Tell us how we can reach you</div>
                </>
              ) : (
                <>
                  <div className="dhq-title">Question {step + 1} of {QUESTIONS.length}</div>
                  <div className="dhq-subtitle">{q.heading}</div>
                </>
              )}
              <button type="button" className="dhq-close" aria-label="Close quiz" onClick={() => setOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="dhq-progress">
                <div
                  className="dhq-progress-fill"
                  style={{ width: `${((step + (isDetails ? 1 : 0)) / (QUESTIONS.length + 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="dhq-body">
              {!isDetails ? (
                <div className={"dhq-options" + (q.rows === 2 ? " dhq-rows-2" : "")}>
                  {q.options.map((o) => (
                    <button
                      type="button"
                      key={o.id}
                      className={"dhq-option" + (selected(o.id) ? " dhq-selected" : "")}
                      onClick={() => pick(o.id)}
                    >
                      {o.img && (
                        <span className="dhq-option-img">
                          <img src={o.img} alt={o.label} loading="lazy" />
                        </span>
                      )}
                      <span className="dhq-option-main">
                        {o.icon && (
                          <span className="dhq-option-icon">
                            <Icon name={o.icon} />
                          </span>
                        )}
                        <span className="dhq-option-label">{o.label}</span>
                        <span className="dhq-radio">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <form className="dhq-details" noValidate onSubmit={submit}>
                  <div className="dhq-field">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={quiz.name}
                      onChange={(e) => setQuiz((s) => ({ ...s, name: e.target.value }))}
                    />
                    {errors.name && <span className="dhq-error">{errors.name}</span>}
                  </div>
                  <div className="dhq-field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={quiz.email}
                      onChange={(e) => setQuiz((s) => ({ ...s, email: e.target.value }))}
                    />
                    {errors.email && <span className="dhq-error">{errors.email}</span>}
                  </div>
                  <div className="dhq-field">
                    <label>Phone</label>
                    <div className="dhq-phone-row">
                      <select value={country} onChange={(e) => setCountry(e.target.value)}>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} ({c.dial})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={quiz.phone}
                        onChange={(e) => setQuiz((s) => ({ ...s, phone: e.target.value }))}
                      />
                    </div>
                    <span className="dhq-code-hint">
                      <CountryFlag code={country} /> +{COUNTRIES.find((c) => c.code === country)?.dial || ""}
                    </span>
                    {errors.phone && <span className="dhq-error">{errors.phone}</span>}
                  </div>
                  <div className="dhq-field">
                    <label>Preferred Language</label>
                    <select
                      value={quiz.preferredLanguage}
                      onChange={(e) => setQuiz((s) => ({ ...s, preferredLanguage: e.target.value }))}
                    >
                      <option value="">Select language…</option>
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  {fail && <div className="dhq-fail">{fail}</div>}
                  <button type="submit" className="dhq-submit" disabled={busy}>
                    {busy ? "Submitting…" : "Submit Details"}
                  </button>
                  <p className="dhq-terms">
                    By submitting you agree to our <a href="/privacy-policy">Privacy Policy</a> and consent to being
                    contacted about your property preferences.
                  </p>
                </form>
              )}
            </div>

            {submitted ? (
              <div className="dhq-success">
                <div className="dhq-success-icon">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3>Thank you, {quiz.name.split(" ")[0]}!</h3>
                <p>Your details have been received. A member of our team will contact you shortly.</p>
                <button type="button" className="dhq-submit" onClick={() => setOpen(false)}>Close</button>
              </div>
            ) : !isDetails ? (
              <div className="dhq-foot">
                {step > 0 && (
                  <button type="button" className="dhq-back" onClick={back}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back
                  </button>
                )}
                <button type="button" className={"dhq-next" + (answered ? "" : " dhq-disabled")} onClick={next}>
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}