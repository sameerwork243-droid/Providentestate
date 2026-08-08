"use client";

import { useState } from "react";
import { cft } from "@/lib/image";

export function PropertyGallery({ imgs, type }: { imgs: string[]; type: string }) {
  const [cur, setCur] = useState(0);
  const srcs = (imgs || []).filter(Boolean) as string[];
  const n = Math.max(1, srcs.length);
  const i = cur % n;
  const thumbs = srcs.slice(0, 6).map((s, idx) => ({ src: s, idx }));

  return (
    <>
      <div className="d-block d-xl-none mob-bann-prop-img">
        <div className="container">
          <div className="d-block mob-banner-img">
            <div className="main-image img-zoom">
              {srcs[i] && <img loading="eager" src={cft(srcs[i], 696, 520)} alt={`${type} - Provident Estate`} />}
            </div>
          </div>
        </div>
      </div>
      <div className="d-none d-xl-block">
        <div className="container">
          <div className="main-image-container img-zoom">
            {srcs[i] && <img loading="eager" src={cft(srcs[i], 1200, 675)} alt={`${type} - Provident Estate`} />}
          </div>
          {n > 1 && (
            <div className="thumbnail-gallery">
              {thumbs.map(({ src, idx }) => (
                <div
                  className={`thumbnail-item img-zoom${idx === i ? " active" : ""}`}
                  key={idx}
                  onClick={() => setCur(idx)}
                >
                  <img loading="eager" draggable="false" src={cft(src, 150, 100)} alt={`${type} - thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}