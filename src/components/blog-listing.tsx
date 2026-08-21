"use client";

import { useMemo, useState } from "react";

const PER_PAGE = 12;

function ArrowDownIcon({ stroke = "#07234B" }: { stroke?: string }) {
  return (
    <svg className="arrow-down-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13 5.5L8 10.5L3 5.5" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BlogListing({ posts }: { posts: any[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [catOpen, setCatOpen] = useState(false);
  const [pageOpen, setPageOpen] = useState(false);
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of posts) if (p.category) seen.add(p.category);
    return ["All Categories", ...Array.from(seen)];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (category !== "All Categories" && p.category !== category) return false;
      if (q && !`${p.title} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [posts, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const go = (p: number) => {
    setPage(Math.max(1, Math.min(totalPages, p)));
  };

  return (
    <div className="blog-listing-wrap listing-wrap">
      <div className="category-section-wrap category-section">
        <div className="category-section container">
          <div className="max-filter">
            <div className="search-box-comm">
              <input
                className="form-control search"
                placeholder="Search by keyword"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
              <span>
                <i className="icon grey-search-icon"></i>
              </span>
            </div>
            <div className="react-select-wrap">
              <div className={"react-select css-b62m3t-container" + (catOpen ? " react-select--is-open" : "")}>
                <div
                  className={"react-select__control css-14qho42-control" + (catOpen ? " react-select__control--menu-is-open" : "")}
                  onClick={() => setCatOpen(!catOpen)}
                >
                  <div className="react-select__value-container react-select__value-container--has-value css-hlgwow">
                    <div className="react-select__single-value css-1ubv46r-singleValue">{category}</div>
                  </div>
                  <div className="react-select__indicators css-1wy0on6">
                    <span className="react-select__indicator-separator css-1uei4ir-indicatorSeparator"></span>
                    <div className="dropdown-indicator react-select__indicator react-select__dropdown-indicator css-15ctyzv-indicatorContainer" aria-hidden="true">
                      <ArrowDownIcon />
                    </div>
                  </div>
                </div>
                {catOpen && (
                  <div className="react-select__menu">
                    <div className="react-select__menu-list">
                      {categories.map((c) => (
                        <div
                          key={c}
                          className={"react-select__option" + (c === category ? " react-select__option--is-selected" : "")}
                          onClick={() => {
                            setCategory(c);
                            setPage(1);
                            setCatOpen(false);
                          }}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <a
              className="yt-subscribe-pill"
              href="https://www.youtube.com/@providentestate"
              target="_blank"
              rel="noreferrer"
              aria-label="Subscribe on YouTube"
            >
              <span className="yt-count">87.7k Subscribers</span>
              <svg width="20" height="15" viewBox="0 0 28 20" fill="none" aria-hidden="true">
                <path d="M27.4 3.1A3.5 3.5 0 0 0 25 .7C22.8 0 14 0 14 0S5.2 0 3 .7A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9A3.5 3.5 0 0 0 3 19.3c2.2.7 11 .7 11 .7s8.8 0 11-.7a3.5 3.5 0 0 0 2.4-2.4c.6-2.2.6-6.9.6-6.9s0-4.7-.6-6.9Z" fill="#FF0000" />
                <path d="M11.2 14.3 18.5 10l-7.3-4.3v8.6Z" fill="#fff" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="blog-listing-container container">
        <div className="blog-category-select-section"></div>
        <div className="blog-listing-section">
          {pageItems.map((b, i) => (
            <div className="news-card-wrapper" key={i}>
              <div className="news-card">
                <div className="img-section-wrap img-zoom">
                  <a className="img-section" href={`/blog/${b.slug}/`}>
                    {b.image && <img loading="lazy" src={b.image} alt={b.title} />}
                    {b.category && <p className="img-tag">{b.category}</p>}
                  </a>
                </div>
                <a className="title" href={`/blog/${b.slug}/`}>
                  {b.title}
                </a>
                <p className="date">{b.date}</p>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <nav className="pagination-wrapper">
            <div>
              <div className="pagination-container">
                <button
                  className={"button button-white pagination-button button-back" + (safePage === 1 ? " button-disabled" : "")}
                  disabled={safePage === 1}
                  onClick={() => go(safePage - 1)}
                >
                  <svg className="arrow-left-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Back</span>
                </button>
                <div className="pagination-select-wrap">
                  <span className="page-text">Page:</span>
                  <div className="pagination-select">
                    <div className={"react-select css-b62m3t-container" + (pageOpen ? " react-select--is-open" : "")}>
                      <div
                        className={"pagination-select__control css-13cymwt-control" + (pageOpen ? " react-select__control--menu-is-open" : "")}
                        onClick={() => setPageOpen(!pageOpen)}
                      >
                        <div className="pagination-select__value-container pagination-select__value-container--has-value css-hlgwow">
                          <div className="pagination-select__single-value css-1dimb5e-singleValue">{safePage}</div>
                        </div>
                        <div className="pagination-select__indicators css-1wy0on6">
                          <span className="pagination-select__indicator-separator css-1uei4ir-indicatorSeparator"></span>
                          <div className="dropdown-indicator react-select__indicator react-select__dropdown-indicator css-15ctyzv-indicatorContainer" aria-hidden="true">
                            <ArrowDownIcon stroke="#9399A4" />
                          </div>
                        </div>
                      </div>
                      {pageOpen && (
                        <div className="pagination-select__menu">
                          <div className="pagination-select__menu-list">
                            {Array.from({ length: totalPages }, (_, n) => (
                              <div
                                key={n + 1}
                                className={"pagination-select__option" + (n + 1 === safePage ? " pagination-select__option--is-selected" : "")}
                                onClick={() => {
                                  go(n + 1);
                                  setPageOpen(false);
                                }}
                              >
                                {n + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="page-text">of {totalPages}</span>
                </div>
                <button
                  className={"button button-white pagination-button button-next" + (safePage === totalPages ? " button-disabled" : "")}
                  disabled={safePage === totalPages}
                  onClick={() => go(safePage + 1)}
                >
                  <span>Next</span>
                  <svg className="arrow-right-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}