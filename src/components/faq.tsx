"use client";

import { useState } from "react";
import { Rich } from "./rich";

/** FAQ accordion (interactive client version of the reference bootstrap accordion). */
export function FaqList({ items, title }: { items: { question: string; answer: string }[]; title?: string }) {
  const [open, setOpen] = useState<number>(-1);
  return (
    <div className="faq-section section-p">
      <div className="faq-container container">
        {title && <h2 className="title">{title}</h2>}
        <div className="faq-list">
          {items.map((f, i) => (
            <div className={"accordion-item" + (open === i ? " open" : "")} key={i}>
              <button className={"accordion-button" + (open !== i ? " collapsed" : "")} onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{f.question}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="#07234B" strokeLinecap="round" />
                </svg>
              </button>
              {open === i && (
                <div className="accordion-collapse collapse show">
                  <div className="accordion-body">
                    <Rich html={f.answer} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
