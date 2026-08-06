"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const BED_OPTS = ["0", "1", "2", "3", "4", "5", "6", "7", "8+"];

const PRICE_OPTS: [string, string][] = [
  ["500000", "AED 500K"],
  ["1000000", "AED 1M"],
  ["2000000", "AED 2M"],
  ["3000000", "AED 3M"],
  ["5000000", "AED 5M"],
  ["10000000", "AED 10M"],
  ["20000000", "AED 20M"],
  ["50000000", "AED 50M"],
];

const fmt = (v: string) => PRICE_OPTS.find(([val]) => val === v)?.[1] ?? v;

function Select({
  label,
  value,
  options,
  onChange,
  width,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
  width: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="filter-select" style={{ minWidth: width, position: "relative" }}>
      <div className="react-select">
        <button
          type="button"
          className="react-select__control"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <div className="react-select__value-container">
            <span className="react-select__single-value">{value === "" ? label : value}</span>
          </div>
          <span className="dropdown-indicator">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 5.5L8 10.5L3 5.5" stroke="#35373C" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        {open && (
          <div
            className="react-select__menu"
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              background: "#fff",
              border: "1px solid #e1e8ed",
              borderRadius: 8,
              boxShadow: "0 10px 30px rgba(0,0,0,.12)",
              maxHeight: 220,
              overflow: "auto",
              zIndex: 11,
            }}
          >
            <div className="react-select__menu-list">
              {options.map(([val, lab]) => (
                <button
                  key={val}
                  type="button"
                  className={"react-select__option" + (value === val ? " selected" : "")}
                  onClick={() => {
                    onChange(val);
                    setOpen(false);
                  }}
                >
                  {lab}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPanel({
  open,
  cols,
  options,
}: {
  open: boolean;
  cols: { label: string; value: string; onChange: (v: string) => void; width: number }[];
  options: [string, string][];
}) {
  return open ? (
    <div className="dropdown-menu filter-dropdown-menu show">
      <div className="custom-dropdown-menu">
        {cols.map((c, i) => (
          <div key={i} className="menu-item-wrap">
            <p className="label">{c.label}</p>
            <Select label={c.label} value={c.value} options={options} onChange={c.onChange} width={c.width} />
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

export function HeroSearch({ areas, showTabs = true, review }: { areas: string[]; showTabs?: boolean; review?: string }) {
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const [sugg, setSugg] = useState(false);
  const [bedsOpen, setBedsOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [minBed, setMinBed] = useState("");
  const [maxBed, setMaxBed] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return areas.filter((a) => a.toLowerCase().includes(t)).slice(0, 6);
  }, [q, areas]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setSugg(false);
        setBedsOpen(false);
        setPriceOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const tabBase = tab === 0 ? "/buy/properties-for-sale" : tab === 1 ? "/let/properties-for-rent" : "/new-projects";

  const go = (area?: string) => {
    const params = new URLSearchParams();
    const target = area ? `${tabBase}/in-${area.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}/` : tabBase + "/";
    if (minBed) params.set("minBedroom", minBed);
    if (maxBed) params.set("maxBedroom", maxBed);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (q.trim() && !area) params.set("areas", q.trim());
    router.push(target + (params.toString() ? "?" + params.toString() : ""));
  };

  const bedsLabel = minBed && maxBed ? `${minBed} - ${maxBed} Beds` : minBed ? `${minBed}+ Beds` : maxBed ? `Up to ${maxBed} Beds` : "Beds";
  const priceLabel = minPrice && maxPrice ? `${fmt(minPrice)} - ${fmt(maxPrice)}` : minPrice ? `${fmt(minPrice)}+` : maxPrice ? `Up to ${fmt(maxPrice)}` : "Price Range";

  return (
    <div className="modal-filter-item buy-rent-tab" ref={rootRef}>
      {showTabs && (
        <div className="filter-tabs tab-header">
          <button className={"tab-button" + (tab === 0 ? " selected-tab" : "")} onClick={() => setTab(0)}>
            Buy
          </button>
          <button className={"tab-button" + (tab === 1 ? " selected-tab" : "")} onClick={() => setTab(1)}>
            Rent
          </button>
          <button className={"tab-button" + (tab === 2 ? " selected-tab" : "")} onClick={() => setTab(2)}>
            Off Plan
          </button>
        </div>
      )}
      <div className="search-box-wrap">
        <div className="search-box-container">
          <div className="search-filter">
            <div className="mutil-select-wrap">
              <div className="multi-select-input" id="multi-select-input">
                <div className="filter search-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none" className="search-icon">
                    <path d="M14.5 14L11.0355 10.5355M11.0355 10.5355C11.9404 9.63071 12.5 8.38071 12.5 7C12.5 4.23858 10.2614 2 7.5 2C4.73858 2 2.5 4.23858 2.5 7C2.5 9.76142 4.73858 12 7.5 12C8.88071 12 10.1307 11.4404 11.0355 10.5355Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <div className="autosuggest__container">
                    <input
                      id="search-input-field"
                      type="text"
                      placeholder="Area, project or community"
                      className="autosuggest__input"
                      autoComplete="off"
                      value={q}
                      onChange={(e) => {
                        setQ(e.target.value);
                        setSugg(true);
                      }}
                      onFocus={() => setSugg(true)}
                      onBlur={() => setTimeout(() => setSugg(false), 150)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") go();
                      }}
                    />
                    {sugg && matches.length > 0 && (
                      <div className="autosuggest__suggestions">
                        {matches.map((a) => (
                          <button key={a} onMouseDown={() => go(a)} className="autosuggest__suggestion">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path d="M10 7C10 8.10457 9.10457 9 8 9C6.89543 9 6 8.10457 6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7Z" stroke="#9399A4" />
                              <path d="M13 7C13 11.7614 8 14.5 8 14.5C8 14.5 3 11.7614 3 7C3 4.23858 5.23858 2 8 2C10.7614 2 13 4.23858 13 7Z" stroke="#9399A4" />
                            </svg>
                            {a}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="filter-dropdown bedroom-filter-dropdown ishide-mod dropdown">
              <button
                type="button"
                className="custom-dropdown-toggle filter-dropdown-toggle dropdown-toggle"
                aria-expanded={bedsOpen}
                onClick={() => {
                  setBedsOpen((o) => !o);
                  setPriceOpen(false);
                }}
              >
                <span>
                  <span>{bedsLabel}</span>
                </span>
                <svg className="arrow-down-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 5.5L8 10.5L3 5.5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <FilterPanel
                open={bedsOpen}
                options={BED_OPTS.map((b) => [b, b])}
                cols={[
                  { label: "Min Beds", value: minBed, onChange: setMinBed, width: 140 },
                  { label: "Max Beds", value: maxBed, onChange: setMaxBed, width: 140 },
                ]}
              />
            </div>
            <div className="vertical-divider ishide-mod"></div>
            <div className="filter-dropdown price-filter-dropdown ishide-mod dropdown">
              <button
                type="button"
                className="custom-dropdown-toggle filter-dropdown-toggle dropdown-toggle"
                aria-expanded={priceOpen}
                onClick={() => {
                  setPriceOpen((o) => !o);
                  setBedsOpen(false);
                }}
              >
                <span>
                  <span>{priceLabel}</span>
                </span>
                <svg className="arrow-down-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 5.5L8 10.5L3 5.5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <FilterPanel
                open={priceOpen}
                options={PRICE_OPTS}
                cols={[
                  { label: "Min Price", value: minPrice, onChange: setMinPrice, width: 220 },
                  { label: "Max Price", value: maxPrice, onChange: setMaxPrice, width: 220 },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="search-cta-section">
          <button className="button button-orange" onClick={() => go()}>
            <span>Search</span>
          </button>
        </div>
      </div>
      {review && (
        <div className="review-txt">
          <p>{review}</p>
        </div>
      )}
    </div>
  );
}
