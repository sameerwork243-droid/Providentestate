"use client";

import { useCallback, useEffect, useState } from "react";

export function SaveButton({
  propertyRef,
  slug,
  title,
  price,
  thumb,
  variant = "circle",
}: {
  propertyRef: string;
  slug: string;
  title: string;
  price: number;
  thumb?: string;
  variant?: "circle" | "button";
}) {
  const [saved, setSaved] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/user/saved?ref=${encodeURIComponent(propertyRef)}`)
      .then((r) => r.json().catch(() => null))
      .then((d) => {
        if (alive) setSaved(Boolean(d?.saved));
      })
      .catch(() => {
        if (alive) setSaved(false);
      });
    return () => {
      alive = false;
    };
  }, [propertyRef]);

  const toggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (busy) return;
      setBusy(true);
      try {
        const res = await fetch("/api/user/saved", {
          method: saved ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            property_ref: propertyRef,
            property_slug: slug,
            title,
            price,
            thumb: thumb || "",
          }),
        });
        const d = await res.json().catch(() => ({}));
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (res.ok) setSaved(Boolean(d.saved ?? !saved));
      } catch {
        // ignore
      } finally {
        setBusy(false);
      }
    },
    [saved, busy, propertyRef, slug, title, price, thumb]
  );

  if (variant === "button") {
    return (
      <button type="button" className={"detail-save-btn" + (saved ? " saved" : "")} onClick={toggle} disabled={busy}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 17.5S3 13.2 3 8.1C3 5.6 4.9 3.8 7.1 3.8c1.3 0 2.3.6 2.9 1.6.6-1 1.6-1.6 2.9-1.6 2.2 0 4.1 1.8 4.1 4.3 0 5.1-7 9.4-7 9.4Z"
            stroke={saved ? "#EE7133" : "currentColor"}
            fill={saved ? "#EE7133" : "none"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        {saved ? "Saved" : "Save property"}
      </button>
    );
  }

  return (
    <div className={"sb-myacc icon wishlist-icn" + (saved ? " saved" : "")}>
      <a
        href="#"
        title={saved ? "Remove from saved" : "Save this property"}
        onClick={toggle}
        aria-label={saved ? "Remove from saved" : "Save this property"}
      >
        <span className="property-save icon-save"></span>
        <span className="property-save icon-saved"></span>
      </a>
    </div>
  );
}
