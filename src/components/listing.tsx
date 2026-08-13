import { PropertyCard } from "./property-card";
import { Rich } from "./rich";
import { Questionnaire } from "./modules";
import { FilterDropdown, TypeSelect, MortgageCalculator } from "./listing-ui";
import { synthHits, areaLabel, teamMembers, projectHits, routeFilters } from "@/lib/store";
import { CountryFlag } from "./phone-flag";
import { ReadMore } from "./read-more";

export function ListingPage({ data, route, page = 1 }: { data: any; route: string; page?: number }) {
  const list = data.hits || [];
  const start = (page - 1) * 20;
  const hits = list.length ? list.slice(start, start + 20) : synthHits(route, page);
  const nbHits = data.nbHits ?? hits.length;
  const f = routeFilters(route);
  const rent = route.startsWith("/let");
  const h1 = titleFromRoute(route, rent, true);
  const baseRoute = route.replace(/\/page\/\d+\/?$/, "").replace(/\/$/, "");
  const content = Array.isArray(data.content) ? data.content[0] : data.content || null;
  const contentDesc = content?.description || null;

  const spotlight = projectHits(1)[0];
  const expert = teamMembers(1)[0];

  const typeOptions_ = typeOptions(route);
  const priceOptions_ = priceOptions(route);
  const bedOptions_ = bedOptions(route);
  const sizeOptions_ = sizeOptions(route);
  const amenityOptions_ = amenityOptions(route);

  const togBtnClass = "tog-btn  btn btn-primary";

  return (
    <div>
      <div className="se-r min-vh-100">
        <div className="search-filters-section">
          <div className="search-filters-container container">
            <div className="mutil-select-wrap">
              <div className="multi-select-input" id="multi-select-input">
                <div className="filter search-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none" className="search-icon">
                    <path
                      d="M14.5 14L11.0355 10.5355M11.0355 10.5355C11.9404 9.63071 12.5 8.38071 12.5 7C12.5 4.23858 10.2614 2 7.5 2C4.73858 2 2.5 4.23858 2.5 7C2.5 9.76142 4.73858 12 7.5 12C8.88071 12 10.1307 11.4404 11.0355 10.5355Z"
                      stroke="#07234B"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
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
              <TypeSelect options={typeOptions_} />
              <FilterDropdown label="Price" options={priceOptions_} className="price-filter-dropdown" />
              <FilterDropdown label="Beds" options={bedOptions_} className="bedroom-filter-dropdown" />
              <FilterDropdown label="Size" options={sizeOptions_} />
              <div className="cta-section">
                <button className="button button-gray filter-button">
                  <span>Filters</span>
                  <svg className="d-inline d-md-none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M8.75 5L16.875 5M8.75 5C8.75 5.69036 8.19036 6.25 7.5 6.25C6.80964 6.25 6.25 5.69036 6.25 5M8.75 5C8.75 4.30964 8.19036 3.75 7.5 3.75C6.80964 3.75 6.25 4.30964 6.25 5M3.125 5H6.25M8.75 15H16.875M8.75 15C8.75 15.6904 8.19036 16.25 7.5 16.25C6.80964 16.25 6.25 15.6904 6.25 15M8.75 15C8.75 14.3096 8.19036 13.75 7.5 13.75C6.80964 13.75 6.25 14.3096 6.25 15M3.125 15L6.25 15M13.75 10L16.875 10M13.75 10C13.75 10.6904 13.1904 11.25 12.5 11.25C11.8096 11.25 11.25 10.6904 11.25 10M13.75 10C13.75 9.30964 13.1904 8.75 12.5 8.75C11.8096 8.75 11.25 9.30964 11.25 10M3.125 10H11.25"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-down-icon d-none d-md-inline">
                    <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
                <a className="button button-orange" href={baseRoute + "/"}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none" className="search-icon">
                    <path
                      d="M14.5 14L11.0355 10.5355M11.0355 10.5355C11.9404 9.63071 12.5 8.38071 12.5 7C12.5 4.23858 10.2614 2 7.5 2C4.73858 2 2.5 4.23858 2.5 7C2.5 9.76142 4.73858 12 7.5 12C8.88071 12 10.1307 11.4404 11.0355 10.5355Z"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <span>Search</span>
                </a>
                <div className="sb-myacc icon wishlist-icn button button-blue d-none d-md-flex ma-save-search">
                  <div className="search-icon">
                    <span className="search-save search icon-save"></span>
                    <span className="search-save search icon-saved"></span>
                  </div>
                  <span className="save-text button-text">Save</span>
                  <span className="saved-text button-text">Saved</span>
                </div>
              </div>
            </div>
          </div>
          <div className="search-filters-container mobile-toggle-filter container">
            <div>
              <a type="button" className="tog-btn active btn btn-primary" href={baseRoute + "/"}>
                {rent ? "Rentals" : "Sales"}{" "}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-down-icon">
                  <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </a>
            </div>
            <div>
              <a type="button" className={togBtnClass} href={`/${rent ? "let" : "buy"}/properties-${rent ? "for-rent" : "for-sale"}/`}>
                {rent ? "Sales" : "Rentals"}{" "}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-down-icon">
                  <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </a>
            </div>
            <div>
              <FilterDropdown label="Property Type" options={typeOptions_} btnClass={togBtnClass} />
            </div>
            <div>
              <FilterDropdown label="Price" options={priceOptions_} btnClass={togBtnClass} />
            </div>
            <div>
              <FilterDropdown label="Beds" options={bedOptions_} btnClass={togBtnClass} />
            </div>
            <div>
              <FilterDropdown label="Size" options={sizeOptions_} btnClass={togBtnClass} />
            </div>
            <div>
              <FilterDropdown label="Amenities" options={amenityOptions_} btnClass={togBtnClass} />
            </div>
          </div>
        </div>

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
        <div className="info-map-sort-wrap container">
          <div className="info-map-sort-section">
            <div className="bottom-section">
              <div className="fit-bk-search">
                <div className="h1-section">
                  <h1>{h1}</h1>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="info-icon">
                    <path
                      d="M9.375 9.375L9.40957 9.35771C9.88717 9.11891 10.4249 9.55029 10.2954 10.0683L9.70458 12.4317C9.57507 12.9497 10.1128 13.3811 10.5904 13.1423L10.625 13.125M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10ZM10 6.875H10.0063V6.88125H10V6.875Z"
                      stroke="#9399A4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
                <p className="info d-none d-xl-block">
                  <span>{nbHits.toLocaleString()}</span> listings
                </p>
              </div>
              <div className="map-sort-section">
                <div className="d-block d-xl-none info">
                  <span>{nbHits.toLocaleString()}</span> listings
                </div>
                <div className="d-none d-xl-block">
                  <button className="map-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="map-icon">
                      <path d="M10 7C10 8.10457 9.10457 9 8 9C6.89543 9 6 8.10457 6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M13 7C13 11.7614 8 14.5 8 14.5C8 14.5 3 11.7614 3 7C3 4.23858 5.23858 2 8 2C10.7614 2 13 4.23858 13 7Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="button-text">Map</span>
                  </button>
                </div>
                <div className="d-none d-xl-block">
                  <button className="map-button list-grid">
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
                    <span className="button-text">Grid</span>
                  </button>
                </div>
                <div className="d-none d-xl-block">
                  <div className="sort-divider"></div>
                </div>
                <div className="d-flex align-items-center">
                  <p className="sort-txt">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 5L5 2M5 2L8 5M5 2V11M14 11L11 14M11 14L8 11M11 14L11 5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>{" "}
                    Sort:{" "}
                  </p>{" "}
                  <div className="sort-dropdown dropdown">
                    <button className="sort-section dropdown-toggle" aria-expanded="false">
                      <div className="sort-field">
                        <p className="text button-text">
                          <span>Most Recent</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-down-icon">
                            <path d="M13 5.5L8 10.5L3 5.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-section mob-view-tab d-block d-xl-none">
              <div className="map-sort-section">
                <div className="d-block">
                  <button className="map-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="map-icon">
                      <path d="M10 7C10 8.10457 9.10457 9 8 9C6.89543 9 6 8.10457 6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M13 7C13 11.7614 8 14.5 8 14.5C8 14.5 3 11.7614 3 7C3 4.23858 5.23858 2 8 2C10.7614 2 13 4.23858 13 7Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="button-text">Map</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="new-layout-with-sidebar container list-k">
          <div>
            <div className="property-list-container">
              <div className="property-list-section list-view" id="property-page-1">
                {hits.length ? (
                  hits.map((h: any, i: number) => <PropertyCard key={h.id ?? i} hit={h} list />)
                ) : (
                  <p className="no-results">No properties found for this search.</p>
                )}
              </div>
            </div>
            <Pagination route={route} baseRoute={baseRoute} page={page} nbHits={nbHits} />
          </div>
          <div className="side-bar-listing-page">
            <div className="sticky-container">
              {spotlight && (
                <div className="content-cta-section sub-menu offplan">
                  <div
                    className="image-bg"
                    style={{ backgroundImage: `url(${spotImg(spotlight)})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    <div className="spotlight">Spotlight Property</div>
                    <div className="content">
                      <p className="heading">{spotlight.title}</p>
                      {spotlight.developer && <p className="description">By {spotlight.developer}</p>}
                      <a className="button button-orange" href={`/new-projects/${spotlight.slug}/`}>
                        <span>View Project</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <div className="alldepartments-popular-search">
                <div className="popular_links_holder">
                  <div className="default-psearch-wrapper psearch">
                    <h4>Popular Searches</h4>
                    <div>
                      <div className="column-links">
                        {POPULAR_RENT.map((l) => (
                          <div key={l.href}>
                            <a href={l.href}>{l.label}</a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="alldepartments-popular-search">
                <div className="popular_links_holder">
                  <div className="default-psearch-wrapper psearch">
                    <h4>Useful Links</h4>
                    <div className="column-links">
                      {USEFUL_LINKS.map((l) => (
                        <div key={l.href}>
                          <a className="sub-menu-link" href={l.href}>
                            {l.label}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {expert && (
                <div className="property-nego-card-wrap sr">
                  <div className="border-side">
                    <h4>Connect with Our Property Experts Today!</h4>
                    <div className="bottom-section">
                      <a className="img-section img-zoom" href={`/team/${expert.slug}/`}>
                        {expert.image && <img loading="lazy" draggable="false" src={expert.image} alt={expert.name} />}
                      </a>
                      <div className="nego-info">
                        <a href={`/team/${expert.slug}/`}>
                          <p className="name">{expert.name}</p>
                          <p className="designation">{expert.designation}</p>
                        </a>
                      </div>
                    </div>
                    <div className="cta-section">
                      <a className="button button-orange" href={`tel:${String(expert.phone || "").replace(/\s/g, "")}`}>
                        <span><CountryFlag /> Call {expert.name.split(" ")[0]}</span>
                      </a>
                      <a
                        className="button button-white"
                        href={`https://wa.provident.ae/inquire?phone=${String(expert.phone || "").replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <div className="card-view">
                <img
                  loading="lazy"
                  draggable="false"
                  src="https://d3h330vgpwpjr8.cloudfront.net/x/368x220/Rectangle_551_3ae6d0ae77_2f860c8381.webp"
                  srcSet="https://d3h330vgpwpjr8.cloudfront.net/x/368x220/Rectangle_551_3ae6d0ae77_2f860c8381.webp 368w"
                  sizes="(min-width: 180px) 368px"
                  alt="Find The Best Mortgage in Dubai - Zoya Ventures Real Estate"
                />
                <div className="content">
                  <h4>Find The Best Mortgage in Dubai</h4>
                  <div className="description">
                    <p>
                      <span style={{ whiteSpace: "pre-wrap" }}>
                        Get the best mortgage rates and terms in the UAE.
                        {"\n"}Your journey begins here.
                      </span>
                    </p>
                  </div>
                  <a className="button button-orange" href="/property-services/mortgages/">
                    <span>Get Pre-Approved Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <MortgageCalculator />

      <div className="container">
        <div className="qes-bk com">
          <Questionnaire
            m={{
              title: "Confused About Where to Buy or Invest in Dubai?",
              content: {
                data: {
                  content:
                    "<p><strong>Take the 30-Second Dubai Property </strong>Quiz and instantly get matched with the <strong>best projects</strong> in Dubai — tailored to your <strong>budget, goals, and lifestyle</strong>. Perfect for <strong>investors and end users</strong> alike.</p><ul><li><strong>Personalized Results in Seconds</strong> – Instantly discover which Dubai areas and projects best fit your needs.</li><li><strong>Handpicked Projects You Can Trust</strong> – Explore Dubai’s most in-demand developments, carefully curated by our experts for quality, price, and potential.</li><li><strong>Smart Investment Insights</strong> – Instantly see which projects offer the best returns and long-term growth, based on real market data and performance.</li><li><strong>Free Dubai Investment Guidebook</strong> – Get the must-read guide packed with 2025 market insights, top launches, and expert tips to help you invest smart.</li></ul>",
                },
              },
              content1: {
                data: {
                  content1:
                    "<p><strong>Take the 30-Second Quiz Now</strong></p><p>Find your ideal property in Dubai — and unlock your <strong>personalized results</strong> plus the <strong>Dubai Investment Guidebook</strong> instantly.</p>",
                },
              },
            }}
          />
        </div>
      </div>

      {contentDesc && (
        <div className="text-copy-wrap section-p" id="contentsection-text-copy">
          <div className="text-copy-container container">
            <h2 className="title">{content?.title}</h2>
            <ReadMore className="description">
              <Rich html={contentDesc} />
            </ReadMore>
          </div>
        </div>
      )}
    </div>
  );
}

function Pagination({
  route,
  baseRoute,
  page,
  nbHits,
}: {
  route: string;
  baseRoute: string;
  page: number;
  nbHits: number;
}) {
  const per = 20;
  const total = Math.max(1, Math.ceil(nbHits / per));
  const nums = pageNumbers(page, total);
  const pageUrl = (n: number) => `${baseRoute}/page/${n}/`;
  const arrow = (d: "left" | "right") =>
    d === "left" ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    );

  return (
    <div className="pagination-wrapper search-pagination-wrapper container">
      <div>
        <div className="pagination-container">
          <a
            className={"button button-white pagination-button button-back" + (page <= 1 ? " button-disabled" : "")}
            href={page > 1 ? pageUrl(page - 1) : undefined}
            aria-disabled={page <= 1}
          >
            {arrow("left")}
          </a>
          <div className="pagination-numbers">
            {nums.map((n, i) =>
              n === "…" ? (
                <span className="pagination-dots" key={`d${i}`}>
                  ...
                </span>
              ) : (
                <a className={"pagination-number" + (n === page ? " active" : "")} href={n !== page ? pageUrl(n as number) : undefined} key={n}>
                  {n}
                </a>
              ),
            )}
          </div>
          <a
            className={"button button-white pagination-button button-next" + (page >= total ? " button-disabled" : "")}
            href={page < total ? pageUrl(page + 1) : undefined}
            aria-disabled={page >= total}
          >
            {arrow("right")}
          </a>
        </div>
      </div>
    </div>
  );
}

function pageNumbers(page: number, total: number): (number | "…")[] {
  if (total <= 8) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 6) return [1, 2, 3, 4, 5, 6, "…", total];
  if (page >= total - 4) {
    const out: (number | "…")[] = [1, "…"];
    for (let i = total - 4; i <= total; i++) out.push(i);
    return out;
  }
  return [1, "…", page - 2, page - 1, page, page + 1, page + 2, "…", total];
}

function spotImg(p: any): string {
  const im = p.images || p.image || null;
  if (!im) return "";
  return (typeof im === "string" ? im : im["340x252"] || im["464x312"] || im["696x520"] || "") || "";
}

const POPULAR_RENT = [
  { label: "Apartments to rent in Dubai", href: "/let/apartment-for-rent/" },
  { label: "Villas to rent in Dubai", href: "/let/villa-for-rent/" },
  { label: "Townhouses to rent in Dubai", href: "/let/townhouse-for-rent/" },
  { label: "Penthouses to rent in Dubai", href: "/let/penthouse-for-rent/" },
  { label: "Short terms to rent in Dubai", href: "/let/short-term-for-rent/" },
  { label: "Duplexes to rent in Dubai", href: "/let/duplex-for-rent/" },
];

const USEFUL_LINKS = [
  { label: "Off Plan Projects", href: "/new-projects/" },
  { label: "Area Guides", href: "/area-guides/" },
  { label: "Top Developers", href: "/developers/" },
  { label: "Meet the team", href: "/team/" },
  { label: "Our Awards", href: "/about/our-awards/" },
  { label: "News & Insights", href: "/blog/" },
];

function titleFromRoute(route: string, rent: boolean, h1 = false): string {
  const f = routeFilters(route);
  const verb = rent ? "for rent" : "for sale";
  const type = f.type && f.type !== "properties" ? f.type.replace(/-/g, " ") : "properties";
  const parts: string[] = [];
  if (h1) {
    if (type === "properties") parts.push(`Properties ${verb} in Dubai`);
    else parts.push(`${type.charAt(0).toUpperCase() + type.slice(1)} ${verb} in Dubai`);
    if (f.area) parts.push(`in ${areaLabel(f.area)}`);
    if (f.priceMin) parts.push(`above AED ${f.priceMin.toLocaleString()}`);
    if (f.priceMax) parts.push(`under AED ${f.priceMax.toLocaleString()}`);
    if (f.bedsMin != null || f.bedsMax != null) {
      if (f.bedsMax === 0) parts.push("Studios");
      else if (f.bedsMin != null && f.bedsMax != null && f.bedsMin !== f.bedsMax) parts.push(`with ${f.bedsMin} to ${f.bedsMax} Bedrooms`);
      else {
        const b = f.bedsMin ?? f.bedsMax ?? 0;
        parts.push(`with ${b} Bedroom${b !== 1 ? "s" : ""}`);
      }
    }
    if (f.sizeMin != null && f.sizeMax != null) parts.push(`with size ${f.sizeMin.toLocaleString()} to ${f.sizeMax.toLocaleString()} sqft`);
    else if (f.sizeMin != null) parts.push(`above ${f.sizeMin.toLocaleString()} sqft`);
    else if (f.sizeMax != null) parts.push(`under ${f.sizeMax.toLocaleString()} sqft`);
    for (const a of f.amenities) parts.push(`with ${a.replace(/-/g, " ")}`);
  } else {
    parts.push(`${type} ${verb}`);
    if (f.area) parts.push(`in ${areaLabel(f.area)}`);
  }
  return parts.join(" ");
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
    return { label: t.replace(/-/g, " "), href };
  });
}

function priceOptions(route: string) {
  const rent = route.startsWith("/let");
  const base = `/${rent ? "let" : "buy"}/properties-for-${rent ? "rent" : "sale"}`;
  return PRICES.map((p) => {
    const href = `${base}/${p.suffix}/`;
    return { label: p.label, href };
  });
}

function bedOptions(route: string) {
  const rent = route.startsWith("/let");
  const type = routeFilters(route).type || "properties";
  const base = `/${rent ? "let" : "buy"}/${type}-for-${rent ? "rent" : "sale"}`;
  return BEDS.map((b) => {
    const href = `${base}/${b.suffix}/`;
    return { label: b.label, href };
  });
}

function sizeOptions(route: string) {
  const rent = route.startsWith("/let");
  const base = `/${rent ? "let" : "buy"}/properties-for-${rent ? "rent" : "sale"}`;
  return SIZES.map((s) => {
    const href = `${base}/${s.suffix}/`;
    return { label: s.label, href };
  });
}

function amenityOptions(route: string) {
  const rent = route.startsWith("/let");
  const base = `/${rent ? "let" : "buy"}/properties-for-${rent ? "rent" : "sale"}`;
  return AMENITIES.map((a) => {
    const href = `${base}/${a.suffix}/`;
    return { label: a.label, href };
  });
}
