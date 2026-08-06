import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function fmtPrice(value: number, currency: string, rate: number, digits = 0) {
  const v = value * rate;
  const n = new Intl.NumberFormat("en-AE", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(v);
  const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "INR" ? "₹" : "AED ";
  return sym + n;
}

export function formatArea(sqm: number, unit: string) {
  const v = unit === "Sqft" ? sqm * 10.764 : sqm;
  return `${Math.round(v).toLocaleString()} ${unit}`;
}

export function waLink(phone: string, text: string) {
  const clean = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

export function mailto(email: string, subject: string, body?: string) {
  const q = new URLSearchParams({ subject });
  if (body) q.set("body", body);
  return `mailto:${email}?${q.toString()}`;
}

export function parseIdFromSlug(slug: string) {
  const m = slug.match(/(\d+)-?$/);
  return m ? parseInt(m[1], 10) : 0;
}

export function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&${{"&": "amp", "<": "lt", ">": "gt", '"': "quot", "'": "#39"}[c]};`);
}

export const faqSchema = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: { "@type": "Answer", text: i.a },
  })),
});