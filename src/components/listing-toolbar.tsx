"use client";

import { useEffect, useRef, useState } from "react";

type SortKey = "recent" | "price-high" | "price-low" | "popular";

const SORT_LABELS: Record<SortKey, string> = {
  recent: "Most Recent",
  "price-high": "Price: High to Low",
  "price-low": "Price: Low to High",
  popular: "Most Popular",
};

type StatusKey = "any" | "ready" | "offplan";

export function ListingToolbar() {
  const [sort, setSort] = useState<SortKey>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [status, setStatus] = useState<StatusKey>("any");
  const [view, setView] = useState<"list" | "grid">("list");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".property-list-section");
    if (!section) return;
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".property-card-wrapper"));

    // ---- sorting ----
    const order = cards.map((el, i) => ({ el, i }));
    type Item = { el: HTMLElement; i: number };
    const bySort: Record<SortKey, (a: Item, b: Item) => number> = {
      recent: (a, b) => a.i - b.i,
      "price-high": (a, b) => num(b.el, "price") - num(a.el, "price") || a.i - b.i,
      "price-low": (a, b) => num(a.el, "price") - num(b.el, "price") || a.i - b.i,
      popular: (a, b) => num(b.el, "featured") - num(a.el, "featured") || a.i - b.i,
    };
    const sorted = [...order].sort(bySort[sort]);
    for (const { el } of sorted) section.appendChild(el);

    // ---- status filter ----
    for (const el of cards) {
      const s = (el.dataset.status || "ready").toLowerCase();
      const off = s.includes("off") || s.includes("plan");
      const show = status === "any" || (status === "ready" ? !off : off);
      el.style.display = show ? "" : "none";
    }
  }, [sort, status]);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".property-list-section");
    if (!section) return;
    section.classList.toggle("list-view", view === "list");
    section.classList.toggle("grid-view", view === "grid");
  }, [view]);

  // close sort dropdown on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="listing-toolbar" ref={rootRef}>
      <div className="status-pills" role="group" aria-label="Property status">
        {(["any", "ready", "offplan"] as StatusKey[]).map((k) => (
          <button
            key={k}
            type="button"
            className={"status-pill" + (status === k ? " active" : "")}
            onClick={() => setStatus(k)}
          >
            {k === "any" ? "Any" : k === "ready" ? "Ready" : "Off Plan"}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="map-button list-grid"
        onClick={() => setView(view === "list" ? "grid" : "list")}
        aria-label={view === "list" ? "Switch to grid view" : "Switch to list view"}
      >
        {view === "list" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="grid-icon">
            <path d="M8.00008 4.00033C8.36827 4.00033 8.66675 3.70185 8.66675 3.33366C8.66675 2.96547 8.36827 2.66699 8.00008 2.66699C7.63189 2.66699 7.33341 2.96547 7.33341 3.33366C7.33341 3.70185 7.63189 4.00033 8.00008 4.00033Z" stroke="#07234B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M8.00008 8.66699C8.36827 8.66699 8.66675 8.36851 8.66675 8.00033C8.66675 7.63214 8.36827 7.33366 8.00008 7.33366C7.63189 7.33366 7.33341 7.63214 7.33341 8.00033C7.33341 8.36851 7.63189 8.66699 8.00008 8.66699Z" stroke="#07234B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M8.00008 13.3337C8.36827 13.3337 8.66675 13.0352 8.66675 12.667C8.66675 12.2988 8.36827 12.0003 8.00008 12.0003C7.63189 12.0003 7.33341 12.2988 7.33341 12.667C7.33341 13.0352 7.63189 13.3337 8.00008 13.3337Z" stroke="#07234B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M12.6667 4.00033C13.0349 4.00033 13.3334 3.70185 13.3334 3.33366C13.3334 2.96547 13.0349 2.66699 12.6667 2.66699C12.2986 2.66699 12.0001 2.96547 12.0001 3.33366C12.0001 3.70185 12.2986 4.00033 12.6667 4.00033Z" stroke="#07234B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M12.6667 8.66699C13.0349 8.66699 13.3334 8.36851 13.3334 8.00033C13.3334 7.63214 13.0349 7.33366 12.6667 7.33366C12.2986 7.33366 12.0001 7.63214 12.0001 8.00033C12.0001 8.36851 12.2986 8.66699 12.6667 8.66699Z" stroke="#07234B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M12.6667 13.3337C13.0349 13.3337 13.3334 13.0352 13.3334 12.667C13.3334 12.2988 13.0349 12.0003 12.6667 12.0003C12.2986 12.0003 12.0001 12.2988 12.0001 12.667C12.0001 13.0352 12.2986 13.3337 12.6667 13.3337Z" stroke="#07234B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M3.33341 4.00033C3.7016 4.00033 4.00008 3.70185 4.00008 3.33366C4.00008 2.96547 3.7016 2.66699 3.33341 2.66699C2.96522 2.66699 2.66675 2.96547 2.66675 3.33366C2.66675 3.70185 2.96522 4.00033 3.33341 4.00033Z" stroke="#07234B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M3.33341 8.66699C3.7016 8.66699 4.00008 8.36851 4.00008 8.00033C4.00008 7.63214 3.7016 7.33366 3.33341 7.33366C2.96522 7.33366 2.66675 7.63214 2.66675 8.00033C2.66675 8.36851 2.96522 8.66699 3.33341 8.66699Z" stroke="#07234B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M3.33341 13.3337C3.7016 13.3337 4.00008 13.0352 4.00008 12.667C4.00008 12.2988 3.7016 12.0003 3.33341 12.0003C2.96522 12.0003 2.66675 12.2988 2.66675 12.667C2.66675 13.0352 2.96522 13.3337 3.33341 13.3337Z" stroke="#07234B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="list-icon">
            <path d="M5.5 4H13.5M5.5 8H13.5M5.5 12H13.5" stroke="#07234B" strokeWidth="1.4" strokeLinecap="round"></path>
            <circle cx="2.5" cy="4" r="1" fill="#07234B"></circle>
            <circle cx="2.5" cy="8" r="1" fill="#07234B"></circle>
            <circle cx="2.5" cy="12" r="1" fill="#07234B"></circle>
          </svg>
        )}
        <span className="button-text">{view === "list" ? "Grid" : "List"}</span>
      </button>

      <div className="sort-divider"></div>

      <div className="d-flex align-items-center">
        <p className="sort-txt">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 5L5 2M5 2L8 5M5 2V11M14 11L11 14M11 14L8 11M11 14L11 5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>{" "}
          Sort:{" "}
        </p>
        <div className={"sort-dropdown dropdown" + (sortOpen ? " open" : "")}>
          <button type="button" className="sort-section dropdown-toggle" aria-expanded={sortOpen} onClick={() => setSortOpen(!sortOpen)}>
            <div className="sort-field">
              <p className="text button-text">
                <span>{SORT_LABELS[sort]}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-down-icon">
                  <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </p>
            </div>
          </button>
          {sortOpen && (
            <div className="sort-menu">
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  className={"sort-option" + (sort === k ? " selected" : "")}
                  onClick={() => {
                    setSort(k);
                    setSortOpen(false);
                  }}
                >
                  {SORT_LABELS[k]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function num(el: HTMLElement, key: string): number {
  const v = Number(el.dataset[key] || 0);
  return isNaN(v) ? 0 : v;
}
