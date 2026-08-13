"use client";

import { useMemo, useState } from "react";

const TABS = ["Management", "Associates", "Sales Managers", "Managers", "Primary Brokers", "Secondary Brokers"];
const TAB_MAP: Record<string, string> = {
  Management: "Management",
  Associates: "Associate",
  "Sales Managers": "Manager - Sales",
  Managers: "Manager",
  "Primary Brokers": "Primary Brokers",
  "Secondary Brokers": "Secondary Brokers",
};
const PER_PAGE = 20;

export function TeamListingClient({
  members,
  stats,
}: {
  members: any[];
  stats?: { professionals?: number; languages?: number };
}) {
  const STATS = [
    { value: `${(stats?.professionals ?? 500)}`, text: "Professionals" },
    { value: `${(stats?.languages ?? 40)}+`, text: "Languages Spoken" },
    { value: "17+", text: "Proven industry presence" },
  ];
  const [tab, setTab] = useState("Management");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const languages = useMemo(() => {
    const set = new Set<string>();
    for (const m of members) for (const l of m.languages || []) set.add(l);
    return [...set].sort();
  }, [members]);

  const filtered = useMemo(() => {
    const cat = category || (tab && TAB_MAP[tab] ? TAB_MAP[tab] : "");
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (cat && !(m.category || []).includes(cat)) return false;
      if (language && !(m.languages || []).includes(language)) return false;
      if (q && !((m.name || "").toLowerCase().includes(q) || (m.designation || "").toLowerCase().includes(q))) return false;
      return true;
    });
  }, [members, tab, category, language, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageMembers = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const selectTab = (t: string) => {
    setTab(t);
    setCategory("");
    setPage(1);
  };

  return (
    <div className="team-listing-wrap listing-wrap">
      <div className="container">
        <div className="statastic">
          {STATS.map((s, i) => (
            <div className="item" key={i}>
              <div className="value">{s.value}</div>
              <div className="text">{s.text}</div>
            </div>
          ))}
        </div>
        <div className="team-listing-container container">
          <div className="category-section-wrap category-sectionn d-none d-xl-block">
            <div className="category-sectionn">
              <div className="category-tabs-section">
                <div className="tab-header-section">
                  <div className="custom-tabs category-tabs">
                    {TABS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={"tab-button button " + (tab === t ? "selected-tab" : "button-white")}
                        onClick={() => selectTab(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-filter">
            <div className="search-team-filter">
              <div className="search-box-comm">
                <input
                  className="form-control search"
                  type="text"
                  placeholder="Search Name, Designation..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="select-boxes">
                <div className="d-block d-xl-none tab-width">
                  <div className="react-select-wrap">
                    <select
                      className="select-field"
                      aria-label="Category"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                      }}
                    >
                      <option value="">{tab}</option>
                      {TABS.filter((t) => t !== tab).map((t) => (
                        <option key={t} value={TAB_MAP[t]}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="react-select-wrap">
                  <select
                    className="select-field"
                    aria-label="Language"
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All Languages</option>
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="team-category-select-section"></div>
          <div className="team-listing-section">
            {pageMembers.map((t: any, i: number) => (
              <div className="team-card-wrap" key={i}>
                <div className="team-card rounded-card">
                  <a className="img-section img-zoom" href={`/team/${t.slug}/`}>
                    {t.image && <img loading="lazy" draggable="false" src={t.image} alt={t.name} />}
                  </a>
                  <a href={`/team/${t.slug}/`}>
                    <p className="name">{t.name}</p>
                  </a>
                  <p className="designation">{t.designation}</p>
                </div>
              </div>
            ))}
          </div>
          <nav className="pagination-wrapper" aria-label="Team pagination">
            <div>
              <div className="pagination-container">
                <button
                  className={"button button-white pagination-button button-back" + (current === 1 ? " button-disabled" : "")}
                  disabled={current === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-left-icon">
                    <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Back</span>
                </button>
                <div className="pagination-select-wrap">
                  <span className="page-text">Page:</span>
                  <span className="pagination-current">
                    {current} of {totalPages}
                  </span>
                </div>
                <button
                  className={"button button-white pagination-button button-next" + (current === totalPages ? " button-disabled" : "")}
                  disabled={current === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <span>Next</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-right-icon">
                    <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
