"use client";

import { useState } from "react";

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "buy",
    links: [
      ["Properties for Sale", "/buy/properties-for-sale/"],
      ["Guide to Buying", "/property-buying-dubai-guide/"],
      ["Signature Collection", "https://providentestate.com/#singnature"],
      ["Mortgages", "/property-services/mortgages/"],
      ["Property Management", "/property-services/property-management/"],
      ["Legal Services", "/property-services/conveyancing/"],
      ["Currency Exchange", "/ifx-dubai/"],
      ["Snagging & Inspection", "/property-services/property-snagging/"],
    ],
  },
  {
    title: "sell",
    links: [
      ["List your Property", "/list-your-property/"],
      ["Guide to Selling", "/property-selling-dubai-guide/"],
      ["Book a Valuation", "/list-your-property/"],
    ],
  },
  {
    title: "Off plan",
    links: [
      ["New Projects", "/new-projects/"],
      ["Guide to Buying Off Plan", "/offplan-property-buying-dubai-guide/"],
      ["Best Dubai Communities", "/area-guides/"],
      ["Top Dubai Developers", "/developers/"],
      ["Snagging & Inspection", "/property-services/property-snagging/"],
      ["Upcoming Roadshows", "/roadshow/"],
      ["Branded Residences", "/branded-residences-in-dubai/"],
    ],
  },
  {
    title: "rent",
    links: [
      ["Properties to Rent", "/let/properties-for-rent/"],
      ["Guide to Renting", "/property-renting-dubai-guide/"],
      ["Short Term Rentals", "/property-services/short-term-rentals/"],
      ["Property Management", "/property-services/property-management/"],
    ],
  },
  {
    title: "services",
    links: [
      ["Properties for Sale", "/buy/properties-for-sale/"],
      ["Leasing", "/property-services/leasing/"],
      ["Mortgages", "/property-services/mortgages/"],
      ["Conveyancing", "/property-services/conveyancing/"],
      ["Property Management", "/property-services/property-management/"],
      ["Snagging & Inspection", "/property-services/property-snagging/"],
      ["Holiday Homes", "/property-services/short-term-rentals/"],
      ["Currency Exchange", "/ifx-dubai/"],
      ["Partner with Provident", "/property-services/partner-program/"],
      ["PRYPCO", "/property-services/prypco/"],
      ["Ethnovate", "/property-services/ethnovate/"],
    ],
  },
  {
    title: "About",
    links: [
      ["About Us", "/about/"],
      ["Meet The Team", "/team/"],
      ["Our Awards", "/about/our-awards/"],
      ["Careers", "/careers/"],
      ["Philanthropy", "/about/philanthropy/"],
      ["Dubai News & Blog", "/blog/"],
      ["Sustainability Initiative", "/about/sustainability-initiative/"],
    ],
  },
];

const WA_LINK =
  "https://wa.provident.ae/inquire?phone=971505423503&text=Hello%20Provident%2C%0A%0AI%20would%20like%20to%20know%20more%20about%20this%20page%3A%0A%0A%E2%80%A2%20Page%20Name%3A%20%0A%E2%80%A2%20Link%3A%20%0A%0AModifying%20this%20message%20will%20prevent%20it%20from%20being%20sent%20to%20the%20agent.&utm_source=Browser%20Direct&gclid=%22%22&event_type=Whatsapp%20Click&utm_platform=%22%22";

function SettingsSelects() {
  const [cur, setCur] = useState(false);
  const [unit, setUnit] = useState(false);
  return (
    <div className="footer-cta-section-wrap settings">
      <div className="react-select-wrap filter-select currency-type-select">
        <div className="react-select css-b62m3t-container">
          <div className="react-select__control css-14qho42-control" onClick={() => setCur(!cur)}>
            <div className="react-select__value-container react-select__value-container--has-value css-hlgwow">
              <div className="react-select__single-value css-1ubv46r-singleValue">{cur ? "UAE Dirams - AED د.إ" : "UAE Dirams - AED د.إ"}</div>
            </div>
            <div className="react-select__indicators css-1wy0on6">
              <span className="react-select__indicator-separator css-1uei4ir-indicatorSeparator"></span>
              <div className="dropdown-indicator react-select__indicator react-select__dropdown-indicator css-15ctyzv-indicatorContainer" aria-hidden="true">
                <svg width="16" height="16" className="arrow-down-icon">
                  <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          {cur && (
            <div className="react-select__menu">
              {["UAE Dirams - AED د.إ", "USD - $", "EUR - €", "GBP - £", "SAR - ر.س"].map((c) => (
                <div key={c} className="react-select__option" onClick={() => setCur(false)}>
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="react-select-wrap filter-select currency-type-select">
        <div className="react-select css-b62m3t-container">
          <div className="react-select__control css-14qho42-control" onClick={() => setUnit(!unit)}>
            <div className="react-select__value-container react-select__value-container--has-value css-hlgwow">
              <div className="react-select__single-value css-1ubv46r-singleValue">SQ FT</div>
            </div>
            <div className="react-select__indicators css-1wy0on6">
              <span className="react-select__indicator-separator css-1uei4ir-indicatorSeparator"></span>
              <div className="dropdown-indicator react-select__indicator react-select__dropdown-indicator css-15ctyzv-indicatorContainer" aria-hidden="true">
                <svg width="16" height="16" className="arrow-down-icon">
                  <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          {unit && (
            <div className="react-select__menu">
              {["SQ FT", "SQM"].map((u) => (
                <div key={u} className="react-select__option" onClick={() => setUnit(false)}>
                  {u}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="footer-wrap section-p">
      <div className="footer-container container">
        <div className="d-flex justify-content-between">
          <div className="footer-cta-section-wrap d-none d-xl-grid">
            {COLS.map((c, i) => (
              <div key={i} className="footer-cta-section">
                <p className="title">{c.title}</p>
                <div className="cta-section">
                  {c.links.map(([label, href], j) => (
                    <a key={j} className="cta" href={href}>
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-cta-section-wrap settings d-block d-xl-none">
          <SettingsSelects />
        </div>
        <div className="footer-cta-section-wrap d-block d-xl-none">
          {COLS.map((c, i) => (
            <div key={i} className={"footer-cta-section accordion accordion-item" + (open === i ? " open" : "")}>
              <p className="title accordion-header">
                <button
                  type="button"
                  aria-expanded={open === i}
                  className={"accordion-button" + (open === i ? "" : " collapsed")}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {c.title}
                </button>
              </p>
              <div className="accordion-collapse" style={{ display: open === i ? "block" : "none" }}>
                <div className="cta-section accordion-body">
                  {c.links.map(([label, href], j) => (
                    <a key={j} className="cta" href={href}>
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="divider d-none d-md-block"></div>
        <div className="footer-bottom-section">
          <div className="footer-cta-section-wrap settings d-none d-xl-block">
            <SettingsSelects />
          </div>
          <div className="bottom-section new-logo-gptw">
            <div className="gptw">
              <a href="/blog/provident-estate-great-place-to-work-certification/">
                <svg width="77" height="131" viewBox="0 0 77 131" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Great Place To Work">
                  <rect width="77" height="131" fill="#002171" />
                  <path d="M38.5 16 14 38.5V94.5L38.5 117 63 94.5V38.5L38.5 16Z" stroke="#FF1628" strokeWidth="2.5" />
                  <text x="38.5" y="72" textAnchor="middle" fill="#FF1628" fontSize="17" fontFamily="Arial, sans-serif" fontWeight="bold">
                    GPTW
                  </text>
                  <text x="38.5" y="92" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="Arial, sans-serif">
                    Great Place To Work
                  </text>
                  <text x="38.5" y="104" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="Arial, sans-serif">
                    CERTIFIED 2026
                  </text>
                </svg>
              </a>
              <div className="d-block d-md-none">
                <p>Provident Estate is proud to announce that we are now officially certified as a Great Place to Work®</p>
              </div>
            </div>
            <div className="no-top">
              <div className="socials-section">
                <a href="https://facebook.com/providentestate" target="_blank" rel="noreferrer" aria-label="Facebook" className="fb-icon"></a>
                <a href="https://twitter.com/providentagents" target="_blank" rel="noreferrer" aria-label="Twitter" className="tw-icon"></a>
                <a href="https://instagram.com/providentestate/" target="_blank" rel="noreferrer" aria-label="Instagram" className="ig-icon"></a>
                <a href="https://ae.linkedin.com/company/providentestate" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="in-icon"></a>
                <a href="https://youtube.com/@Providentestate" target="_blank" rel="noreferrer" aria-label="YouTube" className="yt-icon"></a>
                <a href="https://t.me/dubaipropertynews" target="_blank" rel="noreferrer" aria-label="Telegram" className="tg-icon"></a>
                <a href={WA_LINK} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="wa-icon"></a>
              </div>
              <div className="terms-section">
                <a href="/privacy-policy/">Privacy Policy</a> <span>/</span>
                <a href="/terms-and-conditions/">Terms &amp; Conditions</a> <span>/</span>
                <a href="/sitemap/">Sitemap</a>
              </div>
              <div className="copyright-section">
                <p>Copyright © {new Date().getFullYear()}. Provident Real Estate</p>
                <span>|</span>
                <p className="">
                  ORN No:<span className="orn-no">1933</span>
                </p>
              </div>
              <div className="copyright-section">
                <p>PROVIDENT® is a registered trademark since 2008</p>
              </div>
              <p className="site-by">
                Site by <a rel="nofollow" href="https://www.starberry.tv" target="_blank" className="site-by-name">Starberry</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
