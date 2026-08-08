"use client";

import { useEffect, useRef, useState } from "react";

export function FilterDropdown({
  label,
  options,
  className = "",
  btnClass = "custom-dropdown-toggle filter-dropdown-toggle dropdown-toggle",
}: {
  label: string;
  options: { label: string; href: string }[];
  className?: string;
  btnClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className={"filter-dropdown dropdown" + (className ? " " + className : "")} ref={root}>
      <button className={btnClass} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span>
          <span>{label}</span>
        </span>
        <svg className="arrow-down-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 5.5L8 10.5L3 5.5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className={"dropdown-menu" + (open ? " show" : "")}>
        {options.map((o) => (
          <a key={o.href} className="dropdown-item" href={o.href}>
            {o.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function TypeSelect({ options }: { options: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="react-select-wrap filter-select building-type-select" ref={root}>
      <div className={"react-select css-b62m3t-container" + (open ? " react-select--is-open" : "")}>
        <div
          className={"react-select__control css-14qho42-control" + (open ? " react-select__control--menu-is-open" : "")}
          onClick={() => setOpen(!open)}
        >
          <div className="react-select__value-container react-select__value-container--has-value css-hlgwow">
            <div className="react-select__single-value css-1ubv46r-singleValue">Property Type</div>
          </div>
          <div className="react-select__indicators css-1wy0on6">
            <span className="react-select__indicator-separator css-1uei4ir-indicatorSeparator"></span>
            <div className="dropdown-indicator react-select__indicator react-select__dropdown-indicator css-15ctyzv-indicatorContainer" aria-hidden="true">
              <svg className="arrow-down-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        {open && (
          <div className="react-select__menu">
            <div className="react-select__menu-list">
              {options.map((o) => (
                <a key={o.href} className="react-select__option" href={o.href}>
                  {o.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MortgageCalculator({
  initialPrice = "3,000,000",
  currency = "AED",
  heading = "Mortgage Calculator",
  panel = false,
}: {
  initialPrice?: string;
  currency?: string;
  heading?: string;
  panel?: boolean;
}) {
  const [price, setPrice] = useState(initialPrice);
  const [down, setDown] = useState(25);
  const [rate, setRate] = useState(3.75);
  const [years, setYears] = useState(25);

  const p = parseFloat(price.replace(/,/g, "")) || 0;
  const principal = p * (1 - (down || 0) / 100);
  const r = (rate || 0) / 12 / 100;
  const n = (years || 0) * 12;
  const monthly = p > 0 && r > 0 && n > 0 ? (principal * r) / (1 - Math.pow(1 + r, -n)) : 0;
  const fmt = (v: number) => (v ? Math.round(v).toLocaleString("en-US") : "0");

  if (panel) {
    return (
      <div className="property-mortagage-wrap" id="mortgage-calculator">
        <h2 className="heading">{heading}</h2>
        <div className="property-calc">
          <div className="calculator-section">
            <div className="input-section">
              <div className="label-bk">
                <label>Total Price</label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-item"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <span className="fix-txt">{currency}</span>
              </div>
              <div className="label-bk">
                <label>Down Payment (%)</label>
                <input type="number" className="input-item" value={down} onChange={(e) => setDown(parseFloat(e.target.value))} />
              </div>
              <div className="label-bk">
                <label>Interest Rate (%)</label>
                <input type="number" className="input-item" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} />
              </div>
              <div className="label-bk">
                <label>Loan Period (Years)</label>
                <input type="number" className="input-item" value={years} onChange={(e) => setYears(parseFloat(e.target.value))} />
              </div>
            </div>
          </div>
          <div className="result-section">
            <div className="pric-bx">
              <p className="per-txt">Monthly repayment</p>
              <p className="results">
                {currency} {fmt(monthly)} /month
              </p>
            </div>
            <div className="div-bor"></div>
            <div className="nn-bt">
              <div className="one-bk">
                <p className="tit">Total Loan Amount</p>
                <p className="con">
                  {currency} {fmt(principal)}
                </p>
              </div>
              <div className="one-bk">
                <p className="tit">Duration</p>
                <p className="con">{years || 0} Years</p>
              </div>
              <div className="one-bk tif">
                <a className="button button-orange trigger-button" href="/property-services/mortgages/">
                  <span>Get a free consultation</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-calculator section-m">
      <div className="container">
        <div className="property-mortagage-wrap" id="mortgage-calculator">
          <h2 className="title">{heading}</h2>
          <p className="content">Calculate your monthly mortgage repayments</p>
          <div className="calculator-section">
            <div className="input-section">
              <p className="label">Total Price ({currency})</p>
              <input
                type="text"
                inputMode="decimal"
                className="input-item"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="input-section">
              <p className="label">Down Payment (%)</p>
              <input type="number" className="input-item" value={down} onChange={(e) => setDown(parseFloat(e.target.value))} />
            </div>
            <div className="input-section">
              <p className="label">Interest Rate (%)</p>
              <input type="number" className="input-item" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} />
            </div>
            <div className="input-section">
              <p className="label">Loan Period Yearly</p>
              <input type="number" className="input-item" value={years} onChange={(e) => setYears(parseFloat(e.target.value))} />
            </div>
          </div>
          <div className="result-section">
            <div className="left-side">
              <p className="text">Monthly Payments</p>
              <p className="results"> {currency} {fmt(monthly)} /month</p>
            </div>
            <div className="right-side">
              <a className="button button-orange trigger-button" href="/property-services/mortgages/">
                <span>Get a free consultation</span>
              </a>
            </div>
          </div>
        </div>
        <div className="divider"></div>
      </div>
    </div>
  );
}
