"use client";

import { useEffect, useRef, useState } from "react";

/** Sticky nav bar with scroll-spy: Details, Gallery, Floor Plans, Amenities, Location, Brochure. */
export function ProjectNav({ ids }: { ids: { label: string; id: string }[] }) {
  const [active, setActive] = useState(ids[0]?.id || "");
  const [stuck, setStuck] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const sentinel = document.createElement("div");
    bar.parentElement?.insertBefore(sentinel, bar);
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    const sections = ids.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids]);

  return (
    <div ref={barRef} className={`offplan-nav-bar-wrap offplan-nav-bar-wrap--top${stuck ? " is-stuck" : ""}`}>
      <div className="offplan-nav-bar-container container">
        <div className="nav-bar-list">
          {ids.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`nav-bar-item${active === s.id ? " active" : ""}`}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Amenity cards in a horizontally scrollable slider with prev/next arrows. */
export function AmenitySlider({ items }: { items: { text?: string; name?: string; image?: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 10);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    update();
    const el = trackRef.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.9), behavior: "smooth" });
  };

  return (
    <div className="slider-module-wrap amenities-slider-wrap section-p">
      <div className="slider-module-container container" id="offplan-amenities-slider">
        <div className="top-section">
          <h2 className="title">Amenities</h2>
          <div className="slider-arrow-btn-section">
            <button type="button" className={`arrow-btn button button-white prev${canPrev ? "" : " disabled"}`} onClick={() => scroll(-1)} aria-label="Previous">
              <svg className="arrow-left-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" className={`arrow-btn button button-white next${canNext ? "" : " disabled"}`} onClick={() => scroll(1)} aria-label="Next">
              <svg className="arrow-right-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
        <div className="slider-section">
          <div className="amenity-track" ref={trackRef}>
            {items.map((a, i) => (
              <div className="amenity-card" key={i}>
                <div className="img-section">
                  {a.image && <img loading="lazy" src={a.image} alt={a.text || a.name || ""} />}
                </div>
                <p className="name">{a.text || a.name || ""}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Floor plan selector: clickable list on the left, active image on the right. */
export function FloorPlanPicker({ plans }: { plans: { title?: string; media?: string; size?: string }[] }) {
  const [sel, setSel] = useState(0);
  const active = plans[Math.min(sel, Math.max(plans.length - 1, 0))];
  return (
    <div className="floorplans-container container" id="floor-plans">
      <h2 className="title">Floorplans</h2>
      <div className="floorplan-grid">
        <div className="left-section">
          <div className="floorplan-section">
            {plans.map((p, i) => (
              <button key={i} type="button" className={`floorplan-item-wrap${i === sel ? " selected" : ""}`} onClick={() => setSel(i)}>
                <div className="floorplan-item">
                  <div className="content">
                    <p className="title">{p.title || "Floor Plan"}</p>
                    {p.size && <p className="size">{p.size}</p>}
                  </div>
                  <svg className="arrow-right-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </button>
            ))}
          </div>
          {active?.media && (
            <a className="button button-gray" href={active.media} target="_blank" rel="noopener noreferrer">
              Download Floorplans
            </a>
          )}
        </div>
        <div className="img-section img-zoom">
          {active?.media && <img loading="lazy" src={active.media} alt={active.title || "Floor plan"} />}
        </div>
      </div>
    </div>
  );
}

/** FAQ accordion from the project's more_info entries. */
export function FaqAccordion({ items, title }: { items: { question?: string; answer?: string }[]; title?: string }) {
  const [open, setOpen] = useState(0);
  if (!items.length) return null;
  return (
    <div className="areaguide-moreinfo-wrap section-p offplan">
      <div className="faq-section areaguide-accordian-section container">
        <h2 className="title">Useful Information about {title || "the project"}</h2>
        <div className="accordion">
          {items.map((f, i) => (
            <div className="accordion-item" key={i}>
              <div className="accordion-header">
                <button
                  type="button"
                  className={`accordion-button${open === i ? "" : " collapsed"}`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  {f.question}
                </button>
              </div>
              {open === i && (
                <div className="accordion-collapse collapse show">
                  <div className="accordion-body" dangerouslySetInnerHTML={{ __html: f.answer || "" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Gallery grid + lightbox + Download 4K / All Images buttons. */
export function ProjectGallery({ images, title }: { images: string[]; title?: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const list = images.slice(0, 6);
  if (!list.length) return null;
  const next = () => setLightbox((v) => (v === null ? v : (v + 1) % list.length));
  const prev = () => setLightbox((v) => (v === null ? v : (v - 1 + list.length) % list.length));
  return (
    <div className="offplan-images-wrap section-l-m" id="offplan-gallery">
      <div className="offplan-images-container container">
        <div className="images-grid-wrap">
          <div className="images-grid">
            {list.map((im, i) => (
              <div className="image-item img-zoom" key={i} onClick={() => setLightbox(i)} role="button" tabIndex={0}>
                <img loading="lazy" src={im} alt={`${title || ""} - image ${i + 1}`} />
              </div>
            ))}
          </div>
          <div className="gallery-actions">
            <a className="button button-gray brochure-button" href={list[0]} target="_blank" rel="noopener noreferrer">
              Download 4K Images
            </a>
            <button type="button" className="button button-white all-image-button" onClick={() => setLightbox(0)}>
              All Images
            </button>
          </div>
        </div>
      </div>
      {lightbox !== null && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <button type="button" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
            ×
          </button>
          <button type="button" className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>
          <img src={list[lightbox]} alt={`${title || ""} - image ${lightbox + 1}`} />
          <button type="button" className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">›</button>
        </div>
      )}
    </div>
  );
}
