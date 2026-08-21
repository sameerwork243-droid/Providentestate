"use client";

import { useEffect, useRef, useState } from "react";

/** Slick-compatible carousel: same DOM hooks as the reference (slick-list/track/slide). */
export function Slick({
  children,
  perView,
  className = "",
  arrows = true,
  autoplay = false,
  speed = 4500,
  infinite = false,
  duration = 3000,
  breakpoints,
}: {
  children: React.ReactNode[];
  perView: number;
  className?: string;
  arrows?: boolean;
  autoplay?: boolean;
  speed?: number;
  infinite?: boolean;
  duration?: number;
  breakpoints?: [number, number][];
}) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const prevRef = useRef(0);
  const [vp, setVp] = useState(perView);

  const computeVp = (w: number): number => {
    if (!breakpoints) {
      if (w < 576) return Math.max(1, Math.min(perView, 1));
      if (w < 992) return Math.max(2, Math.min(perView, 2));
      return perView;
    }
    let v = Math.min(breakpoints[0][1], perView);
    for (const [t, n] of breakpoints) {
      if (w >= t) v = Math.min(n, perView);
    }
    return v;
  };

  useEffect(() => {
    const on = () => {
      const w = window.innerWidth || 1200;
      setVp(computeVp(w));
    };
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [perView, breakpoints]);

  const total = children.length;
  const clonesBefore = infinite ? vp : 0;
  const clonesAfter = infinite ? vp * 2 : 0;
  const trackSlides = total + clonesBefore + clonesAfter;
  const max = Math.max(0, total - vp);
  const idx = Math.min(index, max);
  const percent = infinite ? 100 + (100 / trackSlides) * idx : (100 / vp) * idx;

  useEffect(() => {
    if (!autoplay || total <= vp) return;
    const t = setInterval(() => {
      setIndex((i) => (i >= max ? 0 : i + 1));
    }, speed);
    return () => clearInterval(t);
  }, [autoplay, speed, total, vp, max]);

  useEffect(() => {
    prevRef.current = idx;
  }, [idx]);

  const wrapJump = idx === 0 && prevRef.current > 0 && prevRef.current >= max;
  const trackStyle: React.CSSProperties = {
    width: `${(trackSlides / vp) * 100}%`,
    left: `-${percent}%`,
  };
  if (!wrapJump) {
    trackStyle.transition = `left ${duration}ms linear`;
  }

  const slides: { c: React.ReactNode; di: number; clone: boolean }[] = [];
  for (let i = 0; i < clonesBefore; i++) {
    slides.push({ c: children[total - clonesBefore + i], di: -(clonesBefore - i), clone: true });
  }
  for (let i = 0; i < total; i++) {
    slides.push({ c: children[i], di: i, clone: false });
  }
  for (let i = 0; i < clonesAfter; i++) {
    slides.push({ c: children[i % total], di: total + i, clone: true });
  }

  return (
    <div ref={ref} className={"slick-slider custom-slider slick-initialized " + className} dir="ltr">
      <div className="slick-list">
        <div className="slick-track" style={trackStyle}>
          {slides.map((s, i) => (
            <div
              key={i}
              data-index={s.di}
              tabIndex={-1}
              aria-hidden={s.clone}
              className={"slick-slide" + (s.clone ? " slick-cloned" : " slick-active" + (s.di === idx ? " slick-current" : ""))}
              style={{ width: `${100 / trackSlides}%` }}
            >
              <div>{s.c}</div>
            </div>
          ))}
        </div>
      </div>
      {arrows && (
        <div className="custom-slider-arrows">
          <button
            className="button button-white pagination-button button-back"
            disabled={idx === 0}
            onClick={() => setIndex(idx - 1)}
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="arrow-left-icon">
              <path d="M15.75 19.5 8.25 12l7.5-7.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="button button-white pagination-button button-next"
            disabled={idx >= max}
            onClick={() => setIndex(idx + 1)}
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="arrow-right-icon">
              <path d="M8.25 4.5 15.75 12l-7.5 7.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
