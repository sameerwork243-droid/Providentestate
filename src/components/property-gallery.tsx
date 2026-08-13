"use client";

import { useCallback, useEffect, useState } from "react";
import { cft } from "@/lib/image";

export function PropertyGallery({
  imgs,
  type,
  location,
  title,
}: {
  imgs: string[];
  type: string;
  location?: string;
  title?: string;
}) {
  const srcs = (imgs || []).filter(Boolean) as string[];
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [shareMsg, setShareMsg] = useState("");
  const n = srcs.length;
  const main = srcs[0];
  const side = srcs.slice(1, 3);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) => (cur == null ? cur : (cur + dir + n) % n));
    },
    [n]
  );

  useEffect(() => {
    if (lightbox == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  useEffect(() => {
    if (!shareMsg) return;
    const t = setTimeout(() => setShareMsg(""), 2500);
    return () => clearTimeout(t);
  }, [shareMsg]);

  async function share() {
    const data = {
      title: title || `${type} - Zoya Ventures Real Estate`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(data.url);
      setShareMsg("Link copied to clipboard");
    } catch {
      /* user cancelled */
    }
  }

  const mapsUrl = location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : null;
  const photosLabel = n > 1 ? `Photos (${n})` : "Photo";

  return (
    <>
      <div className="pe-gallery">
        <div className="pe-gallery-main img-zoom">
          {main && (
            <img
              loading="eager"
              src={cft(main, 1200, 675)}
              alt={`${type} - main image`}
              onClick={() => n > 1 && setLightbox(0)}
            />
          )}
          {n > 1 && (
            <button
              type="button"
              className="pe-gallery-actions pe-gallery-photos"
              onClick={() => setLightbox(0)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              {photosLabel}
            </button>
          )}
          <div className="pe-gallery-actions">
            {mapsUrl && (
              <a className="pe-gallery-btn" href={mapsUrl} target="_blank" rel="noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Location
              </a>
            )}
            <button type="button" className="pe-gallery-btn" onClick={share}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
              </svg>
              Share
            </button>
          </div>
          {shareMsg && <span className="pe-gallery-share-msg">{shareMsg}</span>}
        </div>
        {side.length > 0 && (
          <div className="pe-gallery-side">
            {side.map((s, i) => (
              <div className="pe-gallery-side-item img-zoom" key={i} onClick={() => setLightbox(i + 1)}>
                <img loading="lazy" src={cft(s, 696, 520)} alt={`${type} - image ${i + 2}`} />
              </div>
            ))}
          </div>
        )}
        <div className="pe-gallery-mobile-count" onClick={() => n > 1 && setLightbox(0)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          {photosLabel}
        </div>
      </div>

      {lightbox != null && n > 1 && (
        <div className="pe-lightbox" role="dialog" aria-modal="true" onClick={close}>
          <div className="pe-lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="pe-lightbox-close" aria-label="Close" onClick={close}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <button type="button" className="pe-lightbox-nav prev" aria-label="Previous" onClick={() => step(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <div className="pe-lightbox-img">
              <img src={cft(srcs[lightbox], 1200, 675)} alt={`${type} - image ${lightbox + 1}`} />
            </div>
            <button type="button" className="pe-lightbox-nav next" aria-label="Next" onClick={() => step(1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            <div className="pe-lightbox-count">
              {lightbox + 1} / {n}
            </div>
            <div className="pe-lightbox-thumbs">
              {srcs.slice(0, 8).map((s, i) => (
                <div
                  className={"pe-lightbox-thumb" + (i === lightbox ? " active" : "")}
                  key={i}
                  onClick={() => setLightbox(i)}
                >
                  <img src={cft(s, 150, 100)} alt={`${type} - thumbnail ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}