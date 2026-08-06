"use client";

import { useState } from "react";

/** Mini gallery inside a property card (swiper hooks from the reference). */
export function CardGallery({ imgs, link, alt, count }: { imgs: any[]; link: string; alt: string; count?: number }) {
  const [i, setI] = useState(0);
  const n = Math.max(1, imgs.length);
  const cur = i % n;

  const mobile = (idx: number) => {
    const img = imgs[idx];
    if (!img) return null;
    return img["340x252"] || img["464x312"] || img["696x520"] || img.big || null;
  };

  const desktop = (idx: number) => {
    const img = imgs[idx];
    if (!img) return null;
    return img["464x312"] || img["340x252"] || img["696x520"] || img.big || null;
  };

  return (
    <div className="swiper">
      <div className="swiper-wrapper">
        {imgs.slice(0, 4).map((_, j) => (
          <div className="swiper-slide" key={j} style={{ display: j === cur ? undefined : "none" }}>
            <a className="img-section" href={link}>
              {mobile(j) && <img className="d-block d-lg-none" loading={j < 3 ? "eager" : "lazy"} src={mobile(j)} alt={alt} />}
              {desktop(j) && <img className="d-none d-lg-block" loading={j < 3 ? "eager" : "lazy"} src={desktop(j)} alt={alt} />}
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
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="photo-icon">
          <path
            d="M1.5 10.5L4.93934 7.06066C5.52513 6.47487 6.47487 6.47487 7.06066 7.06066L10.5 10.5M9.5 9.5L10.4393 8.56066C11.0251 7.97487 11.9749 7.97487 12.5607 8.56066L14.5 10.5M2.5 13H13.5C14.0523 13 14.5 12.5523 14.5 12V4C14.5 3.44772 14.0523 3 13.5 3H2.5C1.94772 3 1.5 3.44772 1.5 4V12C1.5 12.5523 1.94772 13 2.5 13ZM9.5 5.5H9.505V5.505H9.5V5.5ZM9.75 5.5C9.75 5.63807 9.63807 5.75 9.5 5.75C9.36193 5.75 9.25 5.63807 9.25 5.5C9.25 5.36193 9.36193 5.25 9.5 5.25C9.63807 5.25 9.75 5.36193 9.75 5.5Z"
            stroke="#07234B"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        {count ?? n}
      </span>
    </div>
  );
}
