"use client";

import { useState } from "react";

/** Mini gallery inside a property card (swiper hooks from the reference). */
export function CardGallery({ imgs, link, alt, count }: { imgs: any[]; link: string; alt: string; count?: number }) {
  const [i, setI] = useState(0);
  const n = Math.max(1, imgs.length);
  const cur = i % n;

  const pick = (idx: number) => {
    const img = imgs[idx];
    if (!img) return null;
    return img["340x252"] || img["464x312"] || img["696x520"] || img.big || null;
  };

  return (
    <div className="swiper">
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <a className="img-section" href={link}>
            <div className="img-zoom listview-img">
              {imgs[0] && <img loading="lazy" draggable="false" src={pick(0)} alt={alt} />}
            </div>
          </a>
        </div>
        {imgs.slice(1, 4).map((_, j) => (
          <div className="swiper-slide" key={j} style={{ display: cur === j + 1 ? undefined : "none" }}>
            <a className="img-section" href={link}>
              <div className="img-zoom listview-img">
                {pick(j + 1) && <img loading="lazy" draggable="false" src={pick(j + 1)} alt={alt} />}
              </div>
            </a>
          </div>
        ))}
      </div>
      <div className="swiper-pagination"></div>
      <div className="custom-prev" onClick={() => setI((i - 1 + n) % n)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </div>
      <div className="custom-next" onClick={() => setI((i + 1) % n)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </div>
      <span className="count">
        <svg width="16" height="16" className="photo-icon" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="2.5" width="13" height="11" rx="1" stroke="#07234B" />
          <circle cx="5.5" cy="6" r="1.5" stroke="#07234B" />
          <path d="m2.5 12.5 4-4 3 3 2.5-2.5 2 2" stroke="#07234B" strokeLinecap="round" />
        </svg>
        {count ?? n}
      </span>
    </div>
  );
}
