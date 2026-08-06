"use client";

import { useMemo, useState } from "react";
import { DeveloperImage } from "./developer-image";

export function DeveloperListing({ developers }: { developers: any[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return developers;
    return developers.filter((d) => d.name.toLowerCase().includes(q));
  }, [developers, query]);

  return (
    <div className="developer-listing-wrap listing-wrap">
      <div className="developer-listing-container container">
        <div className="category-section search-section-wrap container">
          <div className="search-section">
            <div className="search-input-wrap">
              <input type="text" placeholder="Search Developers" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button className="button button-orange">
              <span>Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none" className="search-icon">
                <path d="M14.5 14L11.0355 10.5355M11.0355 10.5355C11.9404 9.63071 12.5 8.38071 12.5 7C12.5 4.23858 10.2614 2 7.5 2C4.73858 2 2.5 4.23858 2.5 7C2.5 9.76142 4.73858 12 7.5 12C8.88071 12 10.1307 11.4404 11.0355 10.5355Z" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="developer-listing-section">
          {filtered.map((d, i) => {
            const link = `/new-projects/developed-by-${d.slug}/`;
            return (
              <div className="developer-card" key={i}>
                <a className="img-section-wrap img-zoom" href={link}>
                  <div className="img-section">
                    <div className="logo-section">
                      <DeveloperImage url={d.logo} alt={`${d.name} - Provident Estate`} />
                    </div>
                  </div>
                </a>
                <a className="name" href={link}>
                  <span>{d.name}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-up-right-icon">
                    <path d="M2.25 9.75L9.75 2.25M9.75 2.25L4.125 2.25M9.75 2.25V7.875" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <p className="description">{d.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}