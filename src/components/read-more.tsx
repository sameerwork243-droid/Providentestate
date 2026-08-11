"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Collapsible text section: clamps the content to `lines` and shows a
 * "Read More" / "Read Less" toggle only when the content actually overflows.
 */
export function ReadMore({
  children,
  lines = 4,
  className = "",
  moreLabel = "Read More",
  lessLabel = "Read Less",
}: {
  children: React.ReactNode;
  lines?: number;
  className?: string;
  moreLabel?: string;
  lessLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      el.style.webkitLineClamp = String(lines);
      el.style.display = "-webkit-box";
      el.style.webkitBoxOrient = "vertical";
      el.style.overflow = "hidden";
      setClamped(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(el);
    return () => {
      if (ro) ro.disconnect();
    };
  }, [lines]);

  const toggle = () => setExpanded((open) => !open);

  return (
    <div className={"read-more-wrap " + className}>
      <div
        ref={ref}
        className={"read-more" + (expanded ? " read-more-expanded" : " read-more-clamped")}
        style={
          expanded
            ? undefined
            : { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: lines, overflow: "hidden" }
        }
      >
        {children}
      </div>
      {clamped && (
        <button
          type="button"
          className="read-more-toggle"
          aria-expanded={expanded}
          onClick={toggle}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}