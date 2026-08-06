import { PropertyCard } from "./property-card";
import { AdsBanner } from "./modules";
import { getListing, synthHits, areaLabel, existsRel } from "@/lib/store";
import { stripHtml } from "./rich";

export function ListingPage({ data, route, page = 1 }: { data: any; route: string; page?: number }) {
  const hits = page <= 1 ? data.hits || [] : synthHits(route, page);
  const nbPages = Math.max(1, data.nbPages || 1);
  const nbHits = data.nbHits ?? hits.length;
  const f = parseRoute(route);
  const rent = route.startsWith("/let");
  const title = data.content?.title || titleFromRoute(route, rent);
  const h1 = data.content?.title || titleFromRoute(route, rent, true);
  const baseRoute = route.replace(/\/page\/\d+\/?$/, "").replace(/\/$/, "");

  const pagination = buildPagination(baseRoute, page, nbPages);

  return (
    <div>
      <section className="banner-listing-wrap">
        <div className="search-filters-section">
          <div className="search-filters-container container">
            <div className="mutil-select-wrap">
              <div className="multi-select-input" id="multi-select-input">
                <div className="filter search-box">
                  <svg className="search-icon" width="17" height="16" viewBox="0 0 17 16" fill="none">
                    <circle cx="7" cy="7" r="5.25" stroke="#07234B" strokeWidth="1.2" />
                    <path d="m11 11 4.5 4.5" stroke="#07234B" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <div className="autosuggest__container">
                    <input
                      id="search-input-field"
                      type="text"
                      placeholder="Area, project or community"
                      className="autosuggest__input"
                      autoComplete="off"
                      defaultValue={f.area ? areaLabel(f.area) : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="filters-section d-none d-xl-flex">
              <FilterButton label="Property Type" options={typeOptions(route)} current={f.type ? f.type.replace(/-/g, " ") : ""} />
              <FilterButton label="Price" options={priceOptions(route)} current={f.priceMin ? `Above ${f.priceMin.toLocaleString()}` : ""} />
              <FilterButton label="Beds" options={bedOptions(route)} current="" />
              <FilterButton label="Size" options={sizeOptions(route)} current="" />
              <FilterButton label="Amenities" options={amenityOptions(route)} current="" />
            </div>
          </div>
        </div>
        <div className="search-filters-container mobile-toggle-filter container">
          <div className="filters-section d-flex d-xl-none">
            <FilterButton label="Property Type" options={typeOptions(route)} current={f.type ? f.type.replace(/-/g, " ") : ""} />
            <FilterButton label="Price" options={priceOptions(route)} current="" />
            <FilterButton label="Beds" options={bedOptions(route)} current="" />
          </div>
        </div>
      </section>

      <div className="property-breadcrumb-wrap">
        <div className="breadcrumbs-wrap">
          <div className="breadcrumbs-container container">
            <nav className="breadcrumbs">
              <ol className="breadcrumb">
                <li className="enable-link-home breadcrumb-item">
                  <a className="breadcrumb-link enable-link" href="/">
                    Home
                  </a>
                </li>
                <li className=" breadcrumb-item active">
                  <a aria-current="page" className="breadcrumb-link disable-link" href={baseRoute + "/"}>
                    {h1}
                  </a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

       <div className="search-results-section list-page">
         <div className="container mx-auto px-4">
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-6 border-b border-gray-200">
             <div className="flex items-center gap-4">
               <h1 className="text-2xl font-semibold text-gray-900 font-cinzel">{h1}</h1>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-600">
                 <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.2" />
                 <path d="m11 11 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
               </svg>
               <p className="text-gray-600">
                 <span className="font-semibold">{nbHits.toLocaleString()}</span> listings
               </p>
             </div>
             <div className="flex items-center gap-4 mt-4 lg:mt-0">
               <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                 <svg width="16" height="16" className="text-gray-600" viewBox="0 0 16 16" fill="none">
                   <path d="M8 14s5-3.686 5-8a5 5 0 1 0-10 0c0 4.314 5 8 5 8Zm0-5.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
                 <span>Map</span>
               </button>
               <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-600">
                   <path d="M8.00008 4.00033C8.36827 4.00033 8.66675 3.70185 8.66675 3.33366C8.66675 2.96547 8.36827 2.66699 8.00008 2.66699C7.63189 2.66699 7.33341 2.96547 7.33341 3.33366C7.33341 3.70185 7.63189 4.00033 8.00008 4.00033Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                   <path d="M8.00008 8.66699C8.36827 8.66699 8.66675 8.36851 8.66675 8.00033C8.66675 7.63214 8.36827 7.33366 8.00008 7.33366C7.63189 7.33366 7.33341 7.63214 7.33341 8.00033C7.33341 8.36851 7.63189 8.66699 8.00008 8.66699Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                   <path d="M8.00008 13.3337C8.36827 13.3337 8.66675 13.0352 8.66675 12.667C8.66675 12.2988 8.36827 12.0003 8.00008 12.0003C7.63189 12.0003 7.33341 12.2988 7.33341 12.667C7.33341 13.0352 7.63189 13.3337 8.00008 13.3337Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </button>
             </div>
           </div>
         </div>

         <div className="container mx-auto px-4 py-8">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-9">
               <div className="property-list-container">
                 <div className="property-list-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {hits.length ? (
                     hits.map((h: any, i: number) => <PropertyCard key={h.id ?? i} hit={h} list />)
                   ) : (
                     <p className="no-results col-span-full text-center text-gray-500 py-12">No properties found for this search. Try adjusting your filters.</p>
                   )}
                 </div>
               </div>
             </div>
             <div className="lg:col-span-3">
               <div className="side-bar-listing-page sticky top-8">
                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <div className="flex flex-col gap-4">
                     <div className="flex gap-2">
                       <a href="tel:+971 50 539 0249" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                         <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                           <path d="M14.5 11.3v2a1.34 1.34 0 0 1-1.47 1.34 13.2 13.2 0 0 1-5.74-2 13.2 13.2 0 0 1-4-4A13.2 13.2 0 0 1 1.3 2.97 1.34 1.34 0 0 1 2.63 1.5h2a1.34 1.34 0 0 1 1.34 1.14c.07.66.27 1.3.47 1.87a1.34 1.34 0 0 1-.33 1.4l-.87.87a10.7 10.7 0 0 0 4 4l.87-.87a1.34 1.34 0 0 1 1.4-.33c.57.2 1.21.4 1.87.47.62.06 1.1.6 1.1 1.25Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                         </svg>
                         <span>Call</span>
                       </a>
                       <a href="https://wa.provident.ae/inquire?phone=97150539860" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors" target="_blank" rel="noreferrer">
                         <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                           <path fill="currentColor" d="M8.5 0C4.06 0 .5 3.56.5 8c0 1.4.37 2.77 1.07 3.98L.5 16l4.2-1.1a8 8 0 0 0 3.8.97c4.44 0 8-3.56 8-7.95S12.94 0 8.5 0Zm4.68 11.3c-.2.57-1.17 1.09-1.6 1.13-.42.04-.9.2-3.03-.63-2.56-1-4.17-3.6-4.3-3.77-.12-.17-1.02-1.36-1.02-2.6 0-1.23.65-1.83.88-2.08.23-.25.5-.31.67-.31h.48c.15 0 .36-.06.56.42l.78 1.9c.06.15.1.32.02.49-.07.17-.12.26-.23.4l-.35.43c-.12.11-.24.24-.1.47.14.23.6 1 1.3 1.61.9.8 1.65 1.05 1.9 1.17.23.12.37.1.5-.06l.75-.87c.16-.19.31-.15.52-.09l1.9.9c.24.11.4.17.46.26.06.1.06.56-.14 1.13Z" />
                         </svg>
                         <span>WhatsApp</span>
                       </a>
                     </div>
                     <div className="text-center">
                       <img src="https://providentestate.com/logo.svg" alt="Provident Estate Logo" className="h-12 mx-auto mb-2" />
                       <p className="font-semibold text-gray-900">Provident Estate</p>
                       <p className="text-sm text-gray-600">Dubai's Trusted Real Estate Agency</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

        <div className="banner-listing-section">
          <div className="ads-banner-wrap section-m ads-banner-wrap-small">
            <div className="">
              <div className="ads-banner-container null container">
                <div className="gradient-overlay">
                  <div className="banner-section">
                    <div className="bg-img">
                      <img
                        loading="lazy"
                        draggable="false"
                        src="https://d3h330vgpwpjr8.cloudfront.net/x/1128x/trusted_property_managers_4cc49e805e.webp"
                        srcSet="https://d3h330vgpwpjr8.cloudfront.net/x/492x/trusted_property_managers_4cc49e805e.webp 492w, https://d3h330vgpwpjr8.cloudfront.net/x/1128x/trusted_property_managers_4cc49e805e.webp 1128w"
                        sizes="(max-width: 480px) 492px, (min-width: 481px) 1128px"
                        alt="Dubai&#x27;s Trusted Property Managers - Provident Estate"
                      />
                    </div>
                    <div className="content-section">
                      <div className="content">
                        <p className="heading">Your Property, Our Priority</p>
                        <p className="title">Dubai's Trusted Property Managers</p>
                        <div className="description">
                          <p>Maximize returns with our efficient, expert property care.</p>
                        </div>
                      </div>
                      <div className="cta-section">
                        <a className="button button-orange" href="/property-services/property-management/">
                          <span> Get Started</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pagination-wrapper search-pagination-wrapper container">
          <div>
            <div className="pagination-container">
              {page > 1 ? (
                <a className="button button-white pagination-button button-back" href={pageUrl(baseRoute, page - 1)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="arrow-left-icon">
                    <path d="M15.75 19.5 8.25 12l7.5-7.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : (
                <button className="button button-white pagination-button button-back button-disabled" disabled>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="arrow-left-icon">
                    <path d="M15.75 19.5 8.25 12l7.5-7.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              <div className="pagination-numbers">
                {pagination.items.map((p, i) =>
                  p === null ? (
                    <span key={i} className="pagination-dots">
                      ...
                    </span>
                  ) : (
                    <a key={i} className={"pagination-number" + (p === page ? " active" : "")} href={pageUrl(baseRoute, p)}>
                      {p}
                    </a>
                  )
                )}
              </div>
              {page < nbPages ? (
                <a className="button button-white pagination-button button-next" href={pageUrl(baseRoute, page + 1)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="arrow-right-icon">
                    <path d="M8.25 4.5 15.75 12l-7.5 7.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : (
                <button className="button button-white pagination-button button-next button-disabled" disabled>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="arrow-right-icon">
                    <path d="M8.25 4.5 15.75 12l-7.5 7.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseRoute(route: string) {
  const segs = route.replace(/^\//, "").split("/").filter(Boolean);
  const f: { type: string | null; area: string | null; priceMin: number | null } = { type: null, area: null, priceMin: null };
  for (const s of segs) {
    if (s.startsWith("in-")) f.area = s.slice(3);
    else if (/^above-\d+$/.test(s)) f.priceMin = parseInt(s.slice(6), 10);
    else if (/-for-sale$/.test(s)) f.type = s.replace(/-for-sale$/, "");
    else if (/-for-rent$/.test(s)) f.type = s.replace(/-for-rent$/, "");
  }
  return f;
}

function titleFromRoute(route: string, rent: boolean, h1 = false): string {
  const f = parseRoute(route);
  const verb = rent ? "for rent" : "for sale";
  const type = f.type ? f.type.replace(/-/g, " ") : "properties";
  const parts: string[] = [];
  if (h1) {
    if (f.type === "properties") parts.push(`Properties ${verb} in Dubai`);
    else parts.push(`${type.charAt(0).toUpperCase() + type.slice(1)} ${verb} in Dubai`);
    if (f.area) parts.push(`in ${areaLabel(f.area)}`);
    if (f.priceMin) parts.push(`above AED ${f.priceMin.toLocaleString()}`);
  } else {
    parts.push(`${type} ${verb}`);
    if (f.area) parts.push(`in ${areaLabel(f.area)}`);
  }
  return parts.join(" ");
}

function pageUrl(base: string, n: number): string {
  if (n <= 1) return base + "/";
  return `${base}/page/${n}/`;
}

function buildPagination(base: string, page: number, nbPages: number) {
  const items: (number | null)[] = [];
  const add = (n: number) => items.push(n);
  const MAX = 7;
  if (nbPages <= MAX) {
    for (let i = 1; i <= nbPages; i++) add(i);
  } else {
    add(1);
    const lo = Math.max(2, page - 1);
    const hi = Math.min(nbPages - 1, page + 1);
    if (lo > 2) items.push(null);
    for (let i = lo; i <= hi; i++) add(i);
    if (hi < nbPages - 1) items.push(null);
    add(nbPages);
  }
  return { items };
}

const TYPES = ["apartment", "villa", "townhouse", "penthouse", "duplex", "commercial-properties", "whole-building", "plots", "short-term", "office-space"];
const PRICES = [
  { label: "Under AED 1M", suffix: "under-1000000" },
  { label: "Above AED 20M", suffix: "above-20000000" },
  { label: "Above AED 10M", suffix: "above-10000000" },
  { label: "Above AED 5M", suffix: "above-5000000" },
  { label: "Above AED 3M", suffix: "above-3000000" },
  { label: "Above AED 2M", suffix: "above-2000000" },
];
const BEDS = [
  { label: "Studio", suffix: "under-0-bedrooms" },
  { label: "1 Bed", suffix: "with-1-to-1-bedrooms" },
  { label: "2 Beds", suffix: "with-2-to-2-bedrooms" },
  { label: "3 Beds", suffix: "with-3-to-3-bedrooms" },
  { label: "4 Beds", suffix: "with-4-to-4-bedrooms" },
  { label: "5+ Beds", suffix: "with-5-to-6-bedrooms" },
];
const SIZES = [
  { label: "Under 1000 sqft", suffix: "with-size-under-1000" },
  { label: "1000 - 2000 sqft", suffix: "with-size-1000-to-2000" },
  { label: "2000 - 4000 sqft", suffix: "with-size-2000-to-4000" },
  { label: "Above 4000 sqft", suffix: "with-size-above-4000" },
];
const AMENITIES = [
  { label: "Swimming Pool", suffix: "with-amenities-swimming-pool" },
  { label: "Shared Gym", suffix: "with-amenities-shared-gym" },
  { label: "Near Metro", suffix: "with-amenities-near-metro" },
  { label: "Covered Parking", suffix: "with-amenities-covered-parking" },
  { label: "Security", suffix: "with-amenities-security" },
];

function typeOptions(route: string) {
  const rent = route.startsWith("/let");
  return TYPES.map((t) => {
    const suffix = rent ? `${t}-for-rent` : `${t}-for-sale`;
    const href = `/${rent ? "let" : "buy"}/${suffix}/`;
    return { label: t.replace(/-/g, " "), href, exists: existsRel(`listings/${rent ? "let" : "buy"}/${suffix}.json`) };
  });
}

function priceOptions(route: string) {
  const rent = route.startsWith("/let");
  const base = `/${rent ? "let" : "buy"}/properties-for-${rent ? "rent" : "sale"}`;
  return PRICES.map((p) => {
    const href = `${base}/${p.suffix}/`;
    return { label: p.label, href, exists: existsRel(`listings/${rent ? "let" : "buy"}/properties-for-${rent ? "rent" : "sale"}/${p.suffix}.json`) };
  });
}

function bedOptions(route: string) {
  const rent = route.startsWith("/let");
  const type = parseRoute(route).type || "properties";
  const base = `/${rent ? "let" : "buy"}/${type}-for-${rent ? "rent" : "sale"}`;
  return BEDS.map((b) => {
    const href = `${base}/${b.suffix}/`;
    return { label: b.label, href, exists: existsRel(`listings/${rent ? "let" : "buy"}/${type}-for-${rent ? "rent" : "sale"}/${b.suffix}.json`) };
  });
}

function sizeOptions(route: string) {
  const rent = route.startsWith("/let");
  const base = `/${rent ? "let" : "buy"}/properties-for-${rent ? "rent" : "sale"}`;
  return SIZES.map((s) => {
    const href = `${base}/${s.suffix}/`;
    return { label: s.label, href, exists: existsRel(`listings/${rent ? "let" : "buy"}/properties-for-${rent ? "rent" : "sale"}/${s.suffix}.json`) };
  });
}

function amenityOptions(route: string) {
  const rent = route.startsWith("/let");
  const base = `/${rent ? "let" : "buy"}/properties-for-${rent ? "rent" : "sale"}`;
  return AMENITIES.map((a) => {
    const href = `${base}/${a.suffix}/`;
    return { label: a.label, href, exists: existsRel(`listings/${rent ? "let" : "buy"}/properties-for-${rent ? "rent" : "sale"}/${a.suffix}.json`) };
  });
}

function FilterButton({ label, options, current }: { label: string; options: { label: string; href: string; exists: boolean }[]; current: string }) {
  const live = options.filter((o) => o.exists);
  return (
    <div className="filter-dropdown">
      <button className="custom-dropdown-toggle filter-dropdown-toggle dropdown-toggle" aria-expanded="false">
        <span>
          <span>{current || label}</span>
        </span>
        <svg className="arrow-down-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 5.5L8 10.5L3 5.5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="dropdown-menu">
        {live.map((o) => (
          <a key={o.href} className="dropdown-item" href={o.href}>
            {o.label}
          </a>
        ))}
      </div>
    </div>
  );
}
