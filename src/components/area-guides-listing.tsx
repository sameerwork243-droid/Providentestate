"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const AMENITIES = [
  "All",
  "Luxury living",
  "Big city life",
  "Beachfront properties",
  "Waterfront properties",
  "Near metro",
  "Green nature living",
  "Family community",
  "Near golf course",
  "Villa community",
  "Outdoor spaces",
  "Children's play area",
];

export function AreaGuidesListing({ areas }: { areas: any[] }) {
  const [q, setQ] = useState("");
  const [amenity, setAmenity] = useState("All");
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    return areas.filter((a) => {
      if (t && !a.title.toLowerCase().includes(t)) return false;
      if (amenity !== "All" && !(a.amenities || []).some((x: string) => x.toLowerCase() === amenity)) return false;
      return true;
    });
  }, [q, amenity, areas]);

  const visible = q.trim() || amenity !== "All" ? matches : matches.slice(0, 24);

  return (
    <div className="community-listing-wrap listing-wrap">
      <div className="amenities-section-wrap category-section" style={{ top: "-146px" }}>
        <div className="amenities-section container">
          <div className="max-filter">
            <div className="search-box-comm">
              <input className="form-control search" placeholder="Search Communities" value={q} onChange={(e) => setQ(e.target.value)} />
              <span>
                <i className="icon grey-search-icon"></i>
              </span>
            </div>
            <div className="react-select-wrap" ref={root}>
              <div className="react-select">
                <div
                  className={"react-select__control" + (open ? " react-select__control--menu-is-open" : "")}
                  onClick={() => setOpen(!open)}
                >
                  <div className="react-select__value-container react-select__value-container--has-value">
                    <div className="react-select__single-value">{amenity}</div>
                  </div>
                  <div className="react-select__indicators">
                    <span className="react-select__indicator-separator"></span>
                    <div className="dropdown-indicator react-select__indicator react-select__dropdown-indicator" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-down-icon">
                        <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                {open && (
                  <div className="react-select__menu">
                    <div className="react-select__menu-list">
                      {AMENITIES.map((o) => (
                        <div
                          key={o}
                          className={
                            "react-select__option" +
                            (o === amenity ? " react-select__option--is-focused react-select__option--is-selected" : "")
                          }
                          onClick={() => {
                            setAmenity(o);
                            setOpen(false);
                          }}
                        >
                          {o}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="community-listing-container container">
        <div className="community-amenities-select-section"></div>
        <div className="community-listing-section">
          {visible.map((a: any) => (
            <div className="areaguide-card" key={a.slug}>
              <div className="img-section img-zoom">
                <a className="tt-fi" href={`/area-guides/${a.slug}/`}>
                  {a.image && (
                    <img
                      loading="lazy"
                      draggable="false"
                      src={a.image}
                      srcSet={`${a.image} 340w, ${a.image304} 304w`}
                      sizes="(min-width: 100px) 340px"
                      alt={`${a.title} - Provident Estate`}
                    />
                  )}
                </a>
              </div>
              <a className="title" href={`/area-guides/${a.slug}/`}>
                {a.title}
              </a>
              {a.desc && (
                <a className="description" href={`/area-guides/${a.slug}/`} dangerouslySetInnerHTML={{ __html: a.desc }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}