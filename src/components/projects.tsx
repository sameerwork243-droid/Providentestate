import { Rich, stripHtml } from "./rich";
import { cft, areaLabel, communities } from "@/lib/store";
import { Questionnaire } from "./modules";
import { CountryFlag } from "./phone-flag";
import { FilterDropdown, TypeSelect } from "./listing-ui";
import { ReadMore } from "./read-more";
import { RegisterInterestForm } from "./register-interest-form";

export function ProjectPages({ data, route, hub = false }: { data: any; route: string; hub?: boolean }) {
  const hits = (data?.hits || []).filter((h: any) => h && h.slug);
  const content = data?.content || null;
  const last = route.split("/").filter(Boolean).pop() || "";
  const isDetail = hits.length <= 1 && !!hits[0] && (last.startsWith("in-") || last === hits[0].slug);

  if (isDetail && hits[0]) return <ProjectDetail hit={hits[0]} route={route} />;

  const title = content?.title || "Off-Plan Projects in Dubai";
  const count = data?.nbHits ?? hits.length;

  return (
    <div>
      <div className="offplan-results-wrap min-vh-100">
        <div className="bg-section-gradient">
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
                      <input id="search-input-field" type="text" placeholder="Area, project or community" className="autosuggest__input" autoComplete="off" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="filters-section d-none d-xl-flex">
                <TypeSelect options={typeLinks(route)} label="All Types" />
                <FilterDropdown label="Area" options={areaLinks(route)} />
                <FilterDropdown label="Type" options={typeLinks(route)} />
                <FilterDropdown label="Completion" options={completionLinks(route)} />
              </div>
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
                    <a aria-current="page" className="breadcrumb-link disable-link" href="/new-projects/">
                      Off-Plan Projects
                    </a>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <div className="search-results-section offplan-results-section">
          <div className="info-map-sort-wrap container">
            <div className="info-map-sort-section">
              <div className="bottom-section">
                <div className="fit-bk-search">
                  <div className="h1-section">
                    <h1>{title}</h1>
                  </div>
                  <p className="info d-none d-xl-block">
                    <span>{count.toLocaleString()}</span> projects
                  </p>
                </div>
                <div className="map-sort-section">
                  <div className="d-block d-xl-none info">
                    <span>{count.toLocaleString()}</span> projects
                  </div>
                  <div className="sort-divider"></div>
                  <div className="d-flex align-items-center">
                    <div className="sort-dropdown dropdown">
                      <div className="sort-field">
                        <svg width="16" height="16" className="sort-icon" viewBox="0 0 16 16" fill="none">
                          <path d="M3 4h10M6 8h4M8.5 12h-1" stroke="#07234B" strokeLinecap="round" />
                        </svg>
                        <span>Sort By</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="property-list-container container">
            <div className="property-list-section isoffplan">
              {hits.length ? (
                hits.map((h: any, i: number) => <OffplanCard key={h.slug ?? i} h={h} />)
              ) : (
                <p className="no-results">No projects found for this search.</p>
              )}
            </div>
          </div>

          {content?.description && (
            <div className="text-copy-wrap section-p">
              <div className="text-copy-container container">
                <ReadMore className="description">
                  <Rich html={content.description} />
                </ReadMore>
              </div>
            </div>
          )}

          <div className="qes-bk com">
            <div className="container">
              <Questionnaire m={{ title: "Confused About Where to Buy or Invest in Dubai?", content: { data: { content: null } } }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function areaLinks(route: string) {
  return [
    { label: "All Areas", href: "/new-projects/" },
    ...communities.slice(0, 20).map((c) => ({ label: c.label, href: `/new-projects/in-${c.slug}/` })),
  ];
}

function typeLinks(route: string) {
  return [
    { label: "All Types", href: "/new-projects/" },
    { label: "Apartment", href: "/new-projects/type-apartment/" },
    { label: "Villa", href: "/new-projects/type-villa/" },
    { label: "Townhouse", href: "/new-projects/type-townhouse/" },
    { label: "Penthouse", href: "/new-projects/type-penthouse/" },
  ];
}

function completionLinks(route: string) {
  return [
    { label: "All", href: "/new-projects/" },
    { label: "Ready", href: "/new-projects/completion-ready/" },
    { label: "Under Construction", href: "/new-projects/completion-under-construction/" },
  ];
}

function OffplanCard({ h }: { h: any }) {
  const link = `/new-projects/${h.slug}/`;
  const allImages = [h.images, ...(h.images2 || []), ...(h.images1 || [])]
    .filter(Boolean)
    .map((im: any) => im["340x252"] || im["464x312"])
    .filter(Boolean);
  const devSlug = (h.developer || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const beds = h.display_bedrooms || (h.min_bedrooms != null && h.max_bedrooms != null ? `${h.min_bedrooms} - ${h.max_bedrooms}` : "");
  return (
    <div className="offplan-card-wrap">
      <div className="img-section ttf">
        <div className="flag-section">
          <p className="img-tag">
            <span>{Array.isArray(h.building_type) ? h.building_type.join(", ") : h.building_type || "Project"}</span>
          </p>
        </div>
        {h.completion_year && (
          <div className="flag-section ready-flag">
            <p className="img-tag">
              <span>{h.completion_year}</span>
            </p>
          </div>
        )}
        <a href={link}>
          <div className="img-section">
            <div className="swiper">
              <div className="swiper-wrapper">
                {allImages.slice(0, 3).map((src: string, i: number) => (
                  <div className="swiper-slide" key={i}>
                    <a href={link}>
                      <img
                        loading={i === 0 ? "eager" : "lazy"}
                        src={src}
                        alt={Array.isArray(h.building_type) ? h.building_type.join(", ") : h.building_type || "Project"}
                      />
                    </a>
                  </div>
                ))}
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </a>
      </div>
      <div className="content-section">
        <a className="title" href={link}>
          {h.title}
        </a>
        {h.developer && (
          <a className="developer" href={`/new-projects/developed-by-${devSlug}/`}>
            by <span>{h.developer}</span>
          </a>
        )}
        <div className="price">
          {h.display_price && <span>Starting Price </span>}
          {h.display_price ? `AED ${h.display_price}` : h.price ? `AED ${Number(h.price).toLocaleString()}` : ""}
        </div>
        <div className="more-info">
          {h.display_address && (
            <p className="location">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 7C10 8.10457 9.10457 9 8 9C6.89543 9 6 8.10457 6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7Z" stroke="#9399A4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 7C13 11.7614 8 14.5 8 14.5C8 14.5 3 11.7614 3 7C3 4.23858 5.23858 2 8 2C10.7614 2 13 4.23858 13 7Z" stroke="#9399A4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{h.display_address}</span>
            </p>
          )}
          {beds && (
            <p className="beds">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.714 10.857c.631 0 1.143-.767 1.143-1.714s-.512-1.714-1.143-1.714S.57 7.196.57 8.143s.513 1.714 1.143 1.714ZM5.143 5.714c.631 0 1.143-.767 1.143-1.714S5.774 2.286 5.143 2.286 4 3.053 4 4s.512 1.714 1.143 1.714ZM10.857 5.714C11.488 5.714 12 4.947 12 4s-.512-1.714-1.143-1.714S9.714 3.053 9.714 4s.512 1.714 1.143 1.714ZM14.286 10.857c.63 0 1.143-.767 1.143-1.714s-.512-1.714-1.143-1.714-1.143.767-1.143 1.714.512 1.714 1.143 1.714ZM11.429 11.429c0 1.577-1.852 2.285-3.429 2.285-1.577 0-3.429-.708-3.429-2.285 0-1.578 1.143-4 3.429-4 2.286 0 3.429 2.422 3.429 4Z" fill="#07234B" />
              </svg>
              <span>{beds}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ hit, route }: { hit: any; route: string }) {
  const gallery = [hit.images, ...(hit.images1 || []), ...(hit.images2 || [])].filter(Boolean);
  const bannerMobile = hit.banner_image_mobile?.["376x512"] || hit.banner_image?.["376x512"] || hit.banner_image?.["1650x"] || hit.images?.["464x312"];
  const bannerDesktop = hit.banner_image?.["1650x"] || hit.images?.["696x520"] || hit.banner_image?.["744x"];
  const devSlug = (hit.developer || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const beds = hit.display_bedrooms || (hit.min_bedrooms != null && hit.max_bedrooms != null ? `${hit.min_bedrooms} - ${hit.max_bedrooms}` : "");
  const features = Array.isArray(hit.features) ? hit.features : [];
  const amenities = Array.isArray(hit.amenities) ? hit.amenities : [];
  const allProps = [...features, ...amenities];

  return (
    <div>
      <div className="offplan-banner-wrap">
        <div className="bg-section d-block d-lg-none">
          <div className="overlay"></div>
          {bannerMobile && <img loading="eager" src={bannerMobile} alt={hit.title} />}
        </div>
        <div className="bg-section d-none d-lg-block">
          <div className="overlay"></div>
          {bannerDesktop && <img loading="eager" src={bannerDesktop} alt={hit.title} />}
        </div>
        <div className="mobile-banner-menu undefined">
          <div className="scroll-i d-flex d-md-none">
            {["About", "Images", "Features", "Location", "Payment Plan", "FAQ"].map((l, i) => (
              <a key={i} className="main-menu" href={`#${["about", "images", "features", "location", "payment", "faq"][i]}`}>
                <span>{l}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="offplan-banner-container container">
          <div className="offplan-banner-section">
            <div className="content-section">
              <h1 className="title">{hit.title}</h1>
              {hit.developer && (
                <a className="developer" href={`/new-projects/developed-by-${devSlug}/`}>
                  by <span>{hit.developer}</span>
                </a>
              )}
              {hit.display_address && <p className="location">{hit.display_address}</p>}
            </div>
            <div className="cta-section">
              {hit.display_price && <p className="price">AED {hit.display_price}</p>}
              <a className="button button-orange" href="#register">
                <span>Register Interest</span>
              </a>
              <a className="button button-white" href={`tel:${"+971 568 308 221".replace(/\s/g, "")}`}>
                <span><CountryFlag /> Call Us</span>
              </a>
            </div>
          </div>
        </div>
        <div className="breadcrumbs-wrap white-color">
          <div className="breadcrumbs-container container">
            <nav className="breadcrumbs">
              <ol className="breadcrumb">
                <li className="enable-link-home breadcrumb-item">
                  <a className="breadcrumb-link enable-link" href="/">
                    Home
                  </a>
                </li>
                <li className=" breadcrumb-item">
                  <a className="breadcrumb-link enable-link" href="/new-projects/">
                    Off-Plan Projects
                  </a>
                </li>
                <li className=" breadcrumb-item active">
                  <a aria-current="page" className="breadcrumb-link disable-link" href={route + "/"}>
                    {hit.title}
                  </a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="about-offplan-wrap new section-l-m" id="about">
        <div className="about-offplan-container container">
          <div className="row">
            <div className="col-xl-8 col-lg-12">
              <div className="left-section">
                <h2 className="title">About {hit.title}</h2>
                <div className="description">
                  <Rich html={hit.about} />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-12">
              <div className="right-section">
                <div className="item-wrap">
                  <p className="label">Starting Price</p>
                  <p className="value">{hit.display_price ? `AED ${hit.display_price}` : hit.price ? `AED ${Number(hit.price).toLocaleString()}` : "—"}</p>
                </div>
                {beds && (
                  <div className="item-wrap">
                    <p className="label">Bedrooms</p>
                    <p className="value">{beds}</p>
                  </div>
                )}
                {hit.completion_year && (
                  <div className="item-wrap">
                    <p className="label">Completion</p>
                    <p className="value">{hit.completion_year}</p>
                  </div>
                )}
                {hit.status && (
                  <div className="item-wrap">
                    <p className="label">Status</p>
                    <p className="value">{hit.status.replace(/-/g, " ")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="offplan-images-wrap section-l-m" id="images">
          <div className="offplan-images-container container">
            <div className="images-grid-wrap">
              <div className="images-grid">
                {gallery.slice(0, 6).map((im: any, i: number) => (
                  <div className="image-item img-zoom" key={i}>
                    <img loading="lazy" src={im["696x520"] || im["464x312"] || im["340x252"]} alt={`${hit.title} - image ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {allProps.length > 0 && (
        <div className="tile-block-wrapper tile-blue-bg section-l-p characteristics-module blue" id="features">
          <div className="tile-block-container container">
            <div className="img-section">
              <div>
                <h3 className="title">Features & Amenities</h3>
              </div>
            </div>
            <div className="content-section">
              <div className="description">
                <div className="features-grid">
                  {allProps.map((f: any, i: number) => (
                    <div className="feature-item" key={i}>
                      <span>{typeof f === "string" ? f : f.name || f.title || ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="register-interest-module-wrap section-l-p" id="register">
        <div className="register-interest-module-container container">
          <div className="row">
            <div className="col-xl-6 col-lg-12">
              <div className="content-section">
                <h2 className="title">Register Your Interest</h2>
                <p className="description">Be the first to know about payment plans, availability and launch offers for {hit.title}.</p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-12">
              <RegisterInterestForm projectTitle={hit.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
