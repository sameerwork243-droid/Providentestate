"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const BED_MIN_OPTS: [string, string][] = [
  ["", "No Min"],
  ["0", "Studio"],
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
  ["6", "6"],
  ["7", "7"],
  ["8", "8"],
  ["9", "9"],
];

const BED_MAX_OPTS: [string, string][] = [
  ["", "No Max"],
  ["0", "Studio"],
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
  ["6", "6"],
  ["7", "7"],
  ["8", "8"],
  ["9", "9"],
];

const PRICE_VALUES = [
  300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1100000, 1200000,
  1300000, 1400000, 1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000,
  2300000, 2400000, 2500000, 2600000, 2700000, 2800000, 2900000, 3000000, 3250000, 3500000,
  3750000, 4000000, 4250000, 4500000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000,
  20000000, 25000000, 50000000,
];

const AED_TO_USD = 0.27229402;

const usdLabel = (v: string) => (v === "" ? "" : "USD " + Math.floor(Number(v) * AED_TO_USD).toLocaleString("en-US"));

const PRICE_MIN_OPTS: [string, string][] = [
  ["", "No Min"],
  ...PRICE_VALUES.map((v) => [String(v), usdLabel(String(v))] as [string, string]),
];

const PRICE_MAX_OPTS: [string, string][] = [
  ["", "No Max"],
  ...PRICE_VALUES.map((v) => [String(v), usdLabel(String(v))] as [string, string]),
];

function BedSelect({
  id,
  value,
  options,
  onChange,
}: {
  id: "min-bedroom-select" | "max-bedroom-select";
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find(([v]) => v === value);
  const text = selected ? selected[1] : options[0][1];
  return (
    <div className={`react-select-wrap filter-select ${id}`}>
      <div className="react-select" style={{ position: "relative" }}>
        <button
          type="button"
          className={"react-select__control" + (open ? " react-select__control--menu-is-open" : "")}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={id === "min-bedroom-select" ? "Min Bedrooms" : "Max Bedrooms"}
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: 21,
            minHeight: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
            paddingLeft: 0,
          }}
        >
          <div
            className="react-select__value-container react-select__value-container--has-value"
            style={{ flex: "1 1 0%", display: "grid", alignItems: "center", overflow: "hidden" }}
          >
            <div
              className="react-select__single-value"
              style={{
                display: "flex",
                color: "#35373C",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: "19.6px",
                letterSpacing: "normal",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "max-content",
              }}
            >
              {text}
            </div>
          </div>
          <span className="react-select__indicators" style={{ flex: "0 0 auto", display: "flex", alignItems: "center" }}>
            <span
              className="dropdown-indicator react-select__indicator react-select__dropdown-indicator"
              aria-hidden="true"
              style={{ display: "flex", alignItems: "center", marginLeft: 10 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="arrow-down-icon">
                <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </button>
        {open && (
          <div
            className="react-select__menu"
            role="listbox"
            style={{
              position: "absolute",
              top: 21,
              left: 0,
              width: "100%",
              minWidth: "100%",
              zIndex: 10,
              background: "#fff",
              borderRadius: 4,
              boxShadow: "0 0 0 1px rgba(0,0,0,.1), 0 4px 11px rgba(0,0,0,.1)",
            }}
          >
            <div className="react-select__menu-list" style={{ maxHeight: 300, overflowY: "auto", padding: "4px 0" }}>
              {options.map(([v, lab]) => (
                <div
                  key={v}
                  role="option"
                  aria-selected={value === v}
                  className={"react-select__option" + (value === v ? " react-select__option--is-selected" : "")}
                  onClick={() => {
                    onChange(v);
                    setOpen(false);
                  }}
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: "25.6px",
                    padding: "8px 12px",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    color: value === v ? "#fff" : "#000",
                    background: value === v ? "#07234B" : "#fff",
                    zIndex: 1,
                  }}
                >
                  {lab}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PriceSelect({
  id,
  value,
  options,
  onChange,
}: {
  id: "min-price-select" | "max-price-select";
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find(([v]) => v === value);
  const text = selected ? selected[1] : options[0][1];
  return (
    <div className={`react-select-wrap filter-select ${id}`}>
      <div className="react-select" style={{ position: "relative" }}>
        <button
          type="button"
          className={"react-select__control" + (open ? " react-select__control--menu-is-open" : "")}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={id === "min-price-select" ? "Min Price" : "Max Price"}
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: 21,
            minHeight: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
            paddingLeft: 0,
          }}
        >
          <div
            className="react-select__value-container react-select__value-container--has-value"
            style={{ flex: "1 1 0%", display: "grid", alignItems: "center", overflow: "hidden" }}
          >
            <div
              className="react-select__single-value"
              style={{
                display: "flex",
                color: "#35373C",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: "19.6px",
                letterSpacing: "normal",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "max-content",
              }}
            >
              {text}
            </div>
          </div>
          <span className="react-select__indicators" style={{ flex: "0 0 auto", display: "flex", alignItems: "center" }}>
            <span
              className="dropdown-indicator react-select__indicator react-select__dropdown-indicator"
              aria-hidden="true"
              style={{ display: "flex", alignItems: "center", marginLeft: 10 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="arrow-down-icon">
                <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </button>
        {open && (
          <div
            className="react-select__menu"
            role="listbox"
            style={{
              position: "absolute",
              top: 21,
              left: 0,
              width: "100%",
              minWidth: "100%",
              zIndex: 10,
              background: "#fff",
              borderRadius: 4,
              boxShadow: "0 0 0 1px rgba(0,0,0,.1), 0 4px 11px rgba(0,0,0,.1)",
            }}
          >
            <div className="react-select__menu-list" style={{ maxHeight: 300, overflowY: "auto", padding: "4px 0" }}>
              {options.map(([v, lab]) => (
                <div
                  key={v}
                  role="option"
                  aria-selected={value === v}
                  className={"react-select__option" + (value === v ? " react-select__option--is-selected" : "")}
                  onClick={() => {
                    onChange(v);
                    setOpen(false);
                  }}
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: "25.6px",
                    padding: "8px 12px",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    color: value === v ? "#fff" : "#000",
                    background: value === v ? "#07234B" : "#fff",
                    zIndex: 1,
                  }}
                >
                  {lab}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
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

  const bedsLabel = "Beds";
  const priceLabel = "Price Range";

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
              {bedsOpen && (
                <div className="dropdown-menu filter-dropdown-menu show">
                  <div className="custom-dropdown-menu">
                    <div className="menu-item-wrap">
                      <p
                        className="label"
                        style={{
                          color: "#35373C",
                          fontSize: 12,
                          fontWeight: 400,
                          letterSpacing: 0.12,
                          lineHeight: "19.2px",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        Min Bedrooms
                      </p>
                      <BedSelect id="min-bedroom-select" value={minBed} options={BED_MIN_OPTS} onChange={setMinBed} />
                    </div>
                    <div className="menu-item-wrap">
                      <p
                        className="label"
                        style={{
                          color: "#35373C",
                          fontSize: 12,
                          fontWeight: 400,
                          letterSpacing: 0.12,
                          lineHeight: "19.2px",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        Max Bedrooms
                      </p>
                      <BedSelect id="max-bedroom-select" value={maxBed} options={BED_MAX_OPTS} onChange={setMaxBed} />
                    </div>
                  </div>
                </div>
              )}
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
              {priceOpen && (
                <div className="dropdown-menu filter-dropdown-menu show">
                  <div className="custom-dropdown-menu">
                    <div className="menu-item-wrap">
                      <p
                        className="label"
                        style={{
                          color: "#35373C",
                          fontSize: 12,
                          fontWeight: 400,
                          letterSpacing: 0.12,
                          lineHeight: "19.2px",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        Min Price
                      </p>
                      <PriceSelect id="min-price-select" value={minPrice} options={PRICE_MIN_OPTS} onChange={setMinPrice} />
                    </div>
                    <div className="menu-item-wrap">
                      <p
                        className="label"
                        style={{
                          color: "#35373C",
                          fontSize: 12,
                          fontWeight: 400,
                          letterSpacing: 0.12,
                          lineHeight: "19.2px",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        Max Price
                      </p>
                      <PriceSelect id="max-price-select" value={maxPrice} options={PRICE_MAX_OPTS} onChange={setMaxPrice} />
                    </div>
                  </div>
                </div>
              )}
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
