import { Rich, ctaHref, stripHtml } from "./rich";
import { ModuleRenderer } from "./modules";
import { FaqList } from "./faq";
import { Slick } from "./slick";
import { PropertyCard } from "./property-card";
import { AreaGuidesListing } from "./area-guides-listing";
import { BlogListing } from "./blog-listing";
import { DeveloperListing } from "./developer-listing";
import { cfw, cft, blogPosts, projectsByArea, projectBySlug, areaGuidesData, developersList } from "@/lib/store";
import { CountryFlag } from "./phone-flag";
import { ReadMore } from "./read-more";

const QUICK_LINKS = [
  { label: "Buy", href: "/buy/properties-for-sale/" },
  { label: "Rent", href: "/let/properties-for-rent/" },
  { label: "Projects", href: "/new-projects/" },
  { label: "Developers ", href: "/developers/" },
  { label: "Areas", href: "/area-guides/" },
  { label: "Services", href: "/property-services/" },
  { label: "Blogs", href: "/blog/" },
];

const PARENT_LABELS: Record<string, string> = {
  sell: "Sell",
  contact: "Contact",
  "property-services": "Services",
  roadshow: "Roadshow",
  careers: "Careers",
  blog: "News & Insights",
  team: "Meet the Team",
  "area-guides": "Communities",
  about: "About",
  "off-plan": "Off-Plan",
  "new-projects": "Off-Plan Projects",
  developers: "Developers",
  "list-your-property": "List Your Property",
};

function MobileBannerMenu({ black = false, current }: { black?: boolean; current?: string }) {
  return (
    <div className={"mobile-banner-menu" + (black ? " black" : " undefined")}>
      <div className="scroll-i d-flex d-md-none">
        {QUICK_LINKS.map((l) => (
          <a key={l.href} aria-current={current === l.href ? "page" : undefined} className="main-menu" href={l.href}>
            <span>{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Breadcrumbs({ route, crumbs }: { route: string; crumbs: { label: string; href: string; active?: boolean }[] }) {
  return (
    <div className="breadcrumbs-wrap">
      <div className="breadcrumbs-container container">
        <nav className="breadcrumbs">
          <ol className="breadcrumb">
            {crumbs.map((c, i) => (
              <li className={"breadcrumb-item" + (i === 0 ? " enable-link-home" : "") + (c.active ? " active" : "")} key={i}>
                <a aria-current={c.active ? "page" : undefined} className={"breadcrumb-link " + (c.active ? "disable-link" : "enable-link")} href={c.href}>
                  {c.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

function routeCrumbs(route: string, leafLabel: string, leafHref?: string, white = false) {
  const segs = route.split("/").filter(Boolean);
  const crumbs: { label: string; href: string; active?: boolean }[] = [{ label: "Home", href: "/" }];
  for (let i = 0; i < segs.length - 1; i++) {
    const href = "/" + segs.slice(0, i + 1).join("/") + "/";
    crumbs.push({ label: PARENT_LABELS[segs[i]] || segs[i].replace(/-/g, " "), href });
  }
  crumbs.push({ label: leafLabel, href: leafHref || route + "/", active: true });
  return crumbs;
}

export function ContentPages({ model }: { model: { kind: string; data: any; route: string } }) {
  const d = model.data || {};
  const route = model.route;
  if (d.job_details || d.title && d.location) {
    const isCareer = !!(d.job_details && d.job_details.data && d.job_details.data.job_details);
    if (isCareer) return <CareerDetail c={d} route={route} />;
  }
  if (d.designation) return <TeamDetail t={d} route={route} />;
  if (d.more_info && (d.content || d.banner_image)) return <AreaGuideDetail a={d} route={route} />;
  if (d.images && d.tile_block) return <EventDetail e={d} route={route} />;
  if (d.tile_image && d.short_description) return <BlogDetail b={d} route={route} />;
  if (d.modules || d.banner || d.page_name) return <StrapiPage page={d} route={route} />;
  return <StrapiPage page={d} route={route} />;
}

export function ModuleWrap({ m }: { m: any }) {
  if (!m) return null;
  if (m.strapi_component === "components.rich-text-block") {
    const html = m.text?.data?.text;
    if (!html) return null;
    return (
      <div className="text-copy-wrap section-p">
        <div className="text-copy-container container">
          <Rich html={html} />
        </div>
      </div>
    );
  }
  return <ModuleRenderer m={m} />;
}

function StrapiPage({ page, route }: { page: any; route: string }) {
  const banner = page.banner || {};
  const layout = page.layout || "landing_page";
  const isForm = layout === "form_page";
  const isAreasListing = page.page_class === "communities_listing_page";
  const bg = banner.banner_image?.url;
  const title = banner.title || page.page_name || "";
  const mods = Array.isArray(page.modules) ? page.modules : [];
  const crumbLeaf = page.page_name || banner.title || stripHtml(title) || "Page";
  const allCtas = [...(banner.ctas || [])];
  const descHtml = banner.description?.data?.description;
  const videoThumb = banner.banner_video?.thumbnail?.url;

  if (page.page_class === "developers_listing_page") return <DevelopersListingPage page={page} route={route} />;
  if (page.page_class === "news_landing_page") return <NewsListingPage page={page} route={route} />;

  const crumbNav = (
    <div className="breadcrumbs-wrap">
      <div className="breadcrumbs-container container">
        <nav className="breadcrumbs">
          <ol className="breadcrumb">
            {routeCrumbs(route, crumbLeaf).map((c, i) => (
              <li className={"breadcrumb-item" + (i === 0 ? " enable-link-home" : "") + (c.active ? " active" : "")} key={i}>
                <a aria-current={c.active ? "page" : undefined} className={"breadcrumb-link " + (c.active ? "disable-link" : "enable-link")} href={c.href}>
                  {c.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );

  const ctaSection = allCtas.length > 0 ? (
    <div className="cta-section">
      {allCtas.map((c: any, i: number) => {
        const magic = typeof c.custom_link === "string" && (c.custom_link.startsWith("#") || c.custom_link.startsWith("$"));
        const label = c.cta_label || "Learn More";
        const gray = c.icon === "phone-blue" || c.icon === "right-arrow-white";
        const cls = "button " + (gray ? "button-gray" : "button-orange");
        const btn = (
          <>
            <span>{label}</span>
            {c.icon === "up-right-arrow-white" && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-up-right-icon">
                <path d="M2.25 9.75L9.75 2.25M9.75 2.25L4.125 2.25M9.75 2.25V7.875" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {c.icon === "phone-blue" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mobile-icon">
                <path d="M10.5 1.5H8.25C7.00736 1.5 6 2.50736 6 3.75V20.25C6 21.4926 7.00736 22.5 8.25 22.5H15.75C16.9926 22.5 18 21.4926 18 20.25V3.75C18 2.50736 16.9926 1.5 15.75 1.5H13.5M10.5 1.5V3H13.5V1.5M10.5 1.5H13.5M10.5 20.25H13.5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {c.icon === "right-arrow-white" && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="right-arrow-icon">
                <path d="M2.25 6H9.75M9.75 6L5.625 1.875M9.75 6L5.625 10.125" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </>
        );
        return magic ? (
          <button key={i} className={cls} type="button">
            {btn}
          </button>
        ) : (
          <a key={i} className={cls} href={ctaHref(c, "/contact/")}>
            {btn}
          </a>
        );
      })}
    </div>
  ) : null;

  const brandBx = (
    <div className="brand-bx">
      <h1 className="title">{title}</h1>
      {banner.heading && <h2 className="heading">{banner.heading}</h2>}
      {descHtml && (
        <div className="description">
          <Rich html={descHtml} />
        </div>
      )}
      {ctaSection}
    </div>
  );

  if (isAreasListing) {
    return (
      <div>
        {!isForm && <MobileBannerMenu black />}
        {crumbNav}
        <div className="banner-listing-wrap" style={{ paddingBottom: "186px" }}>
          <div className="banner-listing-container container">
            <h1 className="title">{title}</h1>
            {descHtml && (
              <div className="description">
                <Rich html={descHtml} />
              </div>
            )}
          </div>
        </div>
        <AreaGuidesListing areas={areaGuidesData()} />
      </div>
    );
  }

  if (layout === "landing_page_2") {
    return (
      <div>
        <div className="banner-wrap banner-home-wrap">
          <div className="bg-section-gradient"></div>
          <MobileBannerMenu black />
          {crumbNav}
          <div className="center-content">
            <div className="banner-container container">
              {brandBx}
              {videoThumb && (
                <div className="banner-video">
                  <img
                    loading="lazy"
                    draggable="false"
                    src={cfw(videoThumb, 1968)}
                    srcSet={`${cfw(videoThumb, 336)} 336w, ${cfw(videoThumb, 696)} 696w, ${cfw(videoThumb, 1968)} 1968w`}
                    sizes="(max-width: 480px) 336px, (max-width: 1100px) 696px, (min-width: 1100px) 1968px"
                    alt="banner-video - Provident Estate"
                    className="video-thumbnail"
                  />
                  <button className="play-button" aria-label="play button"></button>
                </div>
              )}
            </div>
          </div>
        </div>
        {mods.map((m: any, i: number) =>
          m.strapi_component === "modules.listing-module" && m.module === "communities_listing" ? null : <ModuleWrap m={m} key={i} />
        )}
      </div>
    );
  }

  if (layout === "listing_page") {
    return (
      <div>
        <div className="listing-page-wrap">
          <div className="listing-page-top">
            <div className="bg-section-gradient"></div>
            <MobileBannerMenu black />
            {crumbNav}
            <div className="banner-listing-wrap">
              <div className="banner-listing-container container">
                <h1 className="title">{title}</h1>
                {descHtml && (
                  <div className="description">
                    <Rich html={descHtml} />
                  </div>
                )}
                {ctaSection}
              </div>
            </div>
          </div>
        </div>
        {mods.map((m: any, i: number) =>
          m.strapi_component === "modules.listing-module" && m.module === "communities_listing" ? null : <ModuleWrap m={m} key={i} />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="banner-wrap banner-landing-wrap">
        {!isForm && <MobileBannerMenu />}
        <div className="bg-section">
          {bg && (
            <img
              loading="eager"
              draggable="false"
              src={cfw(bg, 1773)}
              srcSet={`${cfw(bg, 376)} 376w, ${cfw(bg, 744)} 744w, ${cfw(bg, 1773)} 1773w`}
              sizes="(max-width: 480px) 376px, (max-width: 1100px) 744px, (min-width: 1100px) 1773px"
              alt="banner-bg - Provident Estate"
            />
          )}
          <div className="overlay"></div>
        </div>
        <div className="breadcrumbs-wrap white-color">
          <div className="breadcrumbs-container container">
            <nav className="breadcrumbs">
              <ol className="breadcrumb">
                {routeCrumbs(route, crumbLeaf).map((c, i) => (
                  <li className={"breadcrumb-item" + (i === 0 ? " enable-link-home" : "") + (c.active ? " active" : "")} key={i}>
                    <a aria-current={c.active ? "page" : undefined} className={"breadcrumb-link " + (c.active ? "disable-link" : "enable-link")} href={c.href}>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
        <div>
          <div className="banner-container container">{brandBx}</div>
        </div>
      </div>
      {mods.map((m: any, i: number) =>
        m.strapi_component === "modules.listing-module" && m.module === "communities_listing" ? null : <ModuleWrap m={m} key={i} />
      )}
    </div>
  );
}

function DevelopersListingPage({ page, route }: { page: any; route: string }) {
  const banner = page.banner || {};
  const title = banner.title || page.page_name || "Developers";
  const descHtml = banner.description?.data?.description;
  const mods = Array.isArray(page.modules) ? page.modules : [];
  const body = mods.filter(
    (m: any) =>
      !(m.strapi_component === "modules.listing-module" && m.module === "developer_listing") &&
      !(m.strapi_component === "modules.global-module" && m.choose_module === "contact_module")
  );

  return (
    <div className="listing-page-wrap">
      <div className="listing-page-top">
        <div className="bg-section-gradient"></div>
        <MobileBannerMenu black current="/developers/" />
        <Breadcrumbs route={route} crumbs={routeCrumbs(route, "Developers")} />
        <div className="banner-listing-wrap">
          <div className="banner-listing-container container">
            <h1 className="title">{title}</h1>
            <div className="description">{descHtml && <Rich html={descHtml} />}</div>
          </div>
        </div>
      </div>
      <DeveloperListing developers={developersList()} />
      {body.map((m: any, i: number) => (
        <ModuleWrap m={m} key={i} />
      ))}
    </div>
  );
}

function NewsListingPage({ page, route }: { page: any; route: string }) {
  const banner = page.banner || {};
  const title = banner.title || page.page_name || "News, Media Gallery & Insights";
  const descHtml = banner.description?.data?.description;

  return (
    <div className="listing-page-wrap">
      <div className="listing-page-top">
        <div className="bg-section-gradient"></div>
        <MobileBannerMenu black current="/blog/" />
        <Breadcrumbs route={route} crumbs={routeCrumbs(route, "News & Insight")} />
        <div className="banner-listing-wrap">
          <div className="banner-listing-container container">
            <h1 className="title">{title}</h1>
            <div className="description">{descHtml && <Rich html={descHtml} />}</div>
          </div>
        </div>
      </div>
      <BlogListing posts={blogPosts(10000)} />
    </div>
  );
}

function BlogDetail({ b, route }: { b: any; route: string }) {
  const bg = b.banner_image?.url;
  const mods = Array.isArray(b.modules) ? b.modules : [];
  const category = Array.isArray(b.category?.strapi_json_value) ? b.category.strapi_json_value.join(", ") : b.category || "";
  const posts = blogPosts(12).filter((p) => p.slug !== b.slug).slice(0, 10);

  return (
    <div>
      <MobileBannerMenu black />
      <Breadcrumbs route={route} crumbs={routeCrumbs(route, b.title || b.slug)} />
      <div className="news-detail-container container">
        <div className="news-info-section">
          <div>
            <div className="new-banner-wrap">
              <h1 className="title">{b.title}</h1>
              <div className="info-section">
                {b.date && <p className="date">{b.date}</p>}
                {b.date && category && <span className="slash-divider">/</span>}
                {category && <p className="category">{category}</p>}
              </div>
            </div>
          </div>
          {bg && (
            <div>
              <div className="news-banner-img">
                <img
                  loading="lazy"
                  src={cfw(bg, 1000)}
                  srcSet={`${cfw(bg, 339)} 339w, ${cfw(bg, 696)} 696w, ${cfw(bg, 1000)} 1000w`}
                  sizes="(max-width: 480px) 339px, (max-width: 1100px) 696px, (min-width: 1100px) 1000px"
                  alt={`${b.title} - Provident Estate`}
                />
              </div>
            </div>
          )}
          <div>
            <div className="news-content">
              {mods.map((m: any, i: number) => (
                <ModuleWrap m={m} key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {posts.length > 0 && (
        <div className="slider-module-wrap more-nwes-wrap section-p">
          <div className="slider-module-container container">
            <h2 className="heading">More News</h2>
            <Slick perView={4}>
              {posts.map((p, i) => (
                <div className="slick-slide-item" key={i}>
                  <div className="news-card">
                    <div className="img-section-wrap img-zoom">
                      <a className="img-section" href={`/blog/${p.slug}/`}>
                        {p.image && <img loading="lazy" src={cfw(p.image, 696)} alt={p.title} />}
                      </a>
                    </div>
                    <div className="content-section">
                      {p.category && <p className="img-tag">{p.category}</p>}
                      <a className="title" href={`/blog/${p.slug}/`}>
                        {p.title}
                      </a>
                      {p.date && <p className="date">{p.date}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </Slick>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamDetail({ t, route }: { t: any; route: string }) {
  const img = t.extra?.profile_image || t.image?.url;
  const about = t.about?.data?.about || t.bio || "";
  const langs = Array.isArray(t.languages?.strapi_json_value) ? t.languages.strapi_json_value : [];
  const cats = Array.isArray(t.category?.strapi_json_value) ? t.category.strapi_json_value : [];
  const phone = (t.phone || t.office_phone || "").replace(/[^+\d]/g, "");
  const waPhone = (phone || "").replace(/^\+/, "");

  return (
    <div>
      <MobileBannerMenu black />
      <Breadcrumbs route={route} crumbs={routeCrumbs(route, t.name || t.slug)} />
      <div className="team-detail-container container">
        <div className="team-info-section ">
          <div className="left-section">
            <h1 className="name">{t.name}</h1>
            {t.designation && <p className="designation">{t.designation}</p>}
            {about && (
              <div className="about-section-wrap" id="about-section">
                <p className="heading">About {t.name}</p>
                <ReadMore className="about-section">
                  <Rich html={about} />
                </ReadMore>
              </div>
            )}
            {(langs.length > 0 || t.license) && (
              <div className="agent-info-wrap">
                {langs.length > 0 && (
                  <p className="agent-info">
                    <span className="label">Languages:</span> {langs.join(", ")}
                  </p>
                )}
                {t.license && (
                  <p className="agent-info">
                    <span className="label">License:</span> {t.license}
                  </p>
                )}
                {cats.length > 0 && (
                  <p className="agent-info">
                    <span className="label">Category:</span> {cats.join(", ")}
                  </p>
                )}
              </div>
            )}
            <div className="cta-section agent-cta-section">
              {phone && (
                <a className="property-cta" href={`tel:${phone}`}>
                  <CountryFlag />
                  <span>Call</span>
                </a>
              )}
              {waPhone && (
                <a className="property-cta whats" target="_blank" rel="noreferrer" href={`https://wa.provident.ae/inquire?phone=${waPhone}&text=Hello%20Provident%2C%0A%0AI%20would%20like%20to%20know%20more%20about%20this%20page%3A%0A%0A%E2%80%A2%20Page%20Name%3A%20%0A%E2%80%A2%20Link%3A%20%0A%0AModifying%20this%20message%20will%20prevent%20it%20from%20being%20sent%20to%20the%20agent.`}>
                  <span>WhatsApp</span>
                </a>
              )}
              {t.email && (
                <a className="property-cta email" href={`mailto:${t.email}`}>
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
          {img && (
            <div className="right-section">
              <div className="image-wrap">
                <img loading="lazy" src={img} alt={t.name} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AreaGuideDetail({ a, route }: { a: any; route: string }) {
  const bg = a.banner_image?.url;
  const content = a.content?.data?.content || "";
  const desc = a.description?.data?.description || "";
  const label = stripHtml(a.title || "").trim();
  const moreInfo = Array.isArray(a.more_info)
    ? a.more_info.map((m: any) => ({ question: m.question, answer: m.answer?.data?.answer || "" }))
    : [];
  const sponsored = Array.isArray(a.sponsored_projects)
    ? a.sponsored_projects.map((s: any) => (typeof s === "string" ? projectBySlug(s) : projectBySlug(s?.slug))).filter(Boolean)
    : [];
  const projects = projectsByArea(a.title || a.slug).slice(0, 10);

  return (
    <div>
      <div className="banner-wrap banner-landing-wrap">
        <MobileBannerMenu />
        <div className="bg-section">
          {bg && (
            <img
              loading="eager"
              src={cfw(bg, 1773)}
              srcSet={`${cfw(bg, 376)} 376w, ${cfw(bg, 744)} 744w, ${cfw(bg, 1773)} 1773w`}
              sizes="(max-width: 480px) 376px, (max-width: 1100px) 744px, (min-width: 1100px) 1773px"
              alt="banner-bg - Provident Estate"
            />
          )}
          <div className="overlay"></div>
        </div>
        <div className="breadcrumbs-wrap white-color">
          <div className="breadcrumbs-container container">
            <nav className="breadcrumbs">
              <ol className="breadcrumb">
                {routeCrumbs(route, label).map((c, i) => (
                  <li className={"breadcrumb-item" + (i === 0 ? " enable-link-home" : "") + (c.active ? " active" : "")} key={i}>
                    <a aria-current={c.active ? "page" : undefined} className={"breadcrumb-link " + (c.active ? "disable-link" : "enable-link")} href={c.href}>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
        <div>
          <div className="banner-container container">
            <div className="brand-bx">
              <h1 className="title">{label} Guide</h1>
              {desc && (
                <div className="description">
                  <Rich html={desc} />
                </div>
              )}
            </div>
            <div className="search-box-wrap">
              <div className="search-box-container">
                <div className="search-filter">
                  <div className="mutil-select-wrap">
                    <div className="multi-select-input" id="multi-select-input">
                      <div className="filter search-box">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none" className="search-icon">
                          <path d="M14.5 14L11.0355 10.5355M11.0355 10.5355C11.9404 9.63071 12.5 8.38071 12.5 7C12.5 4.23858 10.2614 2 7.5 2C4.73858 2 2.5 4.23858 2.5 7C2.5 9.76142 4.73858 12 7.5 12C8.88071 12 10.1307 11.4404 11.0355 10.5355Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="autosuggest__container">
                          <input id="search-input-field" type="text" placeholder="Area, project or community" className="autosuggest__input" autoComplete="off" value="" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="filter-dropdown bedroom-filter-dropdown ishide-mod dropdown">
                    <button className="custom-dropdown-toggle filter-dropdown-toggle dropdown-toggle" aria-expanded="false">
                      <span>
                        <span>Beds</span>
                      </span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="arrow-down-icon">
                        <path d="M13 5.5L8 10.5L3 5.5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="vertical-divider ishide-mod"></div>
                  <div className="filter-dropdown price-filter-dropdown ishide-mod dropdown">
                    <button className="custom-dropdown-toggle filter-dropdown-toggle dropdown-toggle" aria-expanded="false">
                      <span>
                        <span>Price Range</span>
                      </span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="arrow-down-icon">
                        <path d="M13 5.5L8 10.5L3 5.5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="search-cta-section">
                  <a className="button button-orange" href={`/buy/properties-for-sale/in-${a.slug}/`}>
                    <span>Search</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {content && (
        <div className="area-info-wrap section-m">
          <div className="area-info-container container">
            <div className="content-section">
              <p className="heading">about {label}</p>
              <div className="content">
                <Rich html={content} />
              </div>
            </div>
          </div>
        </div>
      )}

      {sponsored.length > 0 && (
        <div className="container">
          <div className="offplan-card-wrap sponsor list-view">
            {sponsored.map((p: any, i: number) => {
              const link = `/new-projects/${p.slug}/`;
              return (
                <div className="sponsor-card" key={i}>
                  <div className="img-section">
                    <div className="flag-section">
                      <p className="img-tag">
                        <span>Sponsored Project</span>
                      </p>
                      <p className="img-tag tag-new">
                        <span>{Array.isArray(p.building_type) ? p.building_type.join(", ") : p.building_type}</span>
                      </p>
                    </div>
                    <a className="img-section listview-img-section" href={link}>
                      <img loading="lazy" src={p.images?.["464x312"] || p.images?.["340x252"]} alt={p.title} />
                    </a>
                  </div>
                  <div className="content-section">
                    <a className="title" href={link}>
                      {p.title}
                    </a>
                    <div className="price">
                      <span>Starting Price </span>
                      {p.display_price ? `AED ${p.display_price}` : ""}
                    </div>
                    {p.display_address && <p className="location">{p.display_address}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="area-guide-featured-slider-tab-section">
          <div className="tab-body">
            <Slick perView={4}>
              {projects.map((p, i) => {
                const link = `/new-projects/${p.slug}/`;
                return (
                  <div className="offplan-card-wrap" key={i}>
                    <div className="img-section">
                      <div className="flag-section">
                        <p className="img-tag">
                          <span>{Array.isArray(p.building_type) ? p.building_type.join(", ") : p.building_type || "Project"}</span>
                        </p>
                      </div>
                      {p.completion_year && (
                        <div className="flag-section ready-flag">
                          <p className="img-tag">
                            <span>{p.completion_year}</span>
                          </p>
                        </div>
                      )}
                      <a href={link}>
                        <div className="img-section">
                          <img loading="lazy" src={p.images?.["464x312"] || p.images?.["340x252"]} alt={p.title} />
                        </div>
                      </a>
                    </div>
                    <div className="content-section">
                      <a className="title" href={link}>
                        {p.title}
                      </a>
                      {p.developer && (
                        <a className="developer" href={`/new-projects/developed-by-${p.developer}/`}>
                          by <span>{p.developer}</span>
                        </a>
                      )}
                      <div className="price">
                        <span>Starting Price </span>
                        {p.display_price ? `AED ${p.display_price}` : ""}
                      </div>
                      <div className="more-info">
                        {p.display_address && <p className="location">{p.display_address}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slick>
          </div>
        </div>
      )}

      {moreInfo.length > 0 && (
        <div className="areaguide-moreinfo-wrap section-p">
          <FaqList items={moreInfo} title={`More About ${label}`} />
        </div>
      )}
    </div>
  );
}

function CareerDetail({ c, route }: { c: any; route: string }) {
  const details = c.job_details?.data?.job_details || "";
  return (
    <div>
      <MobileBannerMenu black />
      <Breadcrumbs route={route} crumbs={routeCrumbs(route, c.title || c.slug)} />
      <div className="career-info-wrap">
        <div className="career-info-container container">
          <div className="left-section">
            <div className="banner-section">
              <h1 className="title">
                <span>{c.title}</span>
              </h1>
              {c.location && (
                <p className="location">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="location-icon">
                    <path d="M10 7C10 8.10457 9.10457 9 8 9C6.89543 9 6 8.10457 6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 7C13 11.7614 8 14.5 8 14.5C8 14.5 3 11.7614 3 7C3 4.23858 5.23858 2 8 2C10.7614 2 13 4.23858 13 7Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{c.location}</span>
                </p>
              )}
            </div>
            <div className="career-content">
              <Rich html={details} />
            </div>
          </div>
          <div className="right-section">
            <div className="contact-section">
              <div className="cta-section">
                <a className="button button-orange bottom-fix-career" href="/send-us-your-cv/">
                  <span>Apply for this job</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDetail({ e, route }: { e: any; route: string }) {
  const desc = e.description?.data?.description || "";
  const imgs = Array.isArray(e.images) ? e.images.map((im: any) => im.image?.url).filter(Boolean) : [];
  const tb = e.tile_block || {};
  const tbDesc = tb.description?.data?.description || "";
  const tbImg = tb.image?.url;

  return (
    <div>
      <MobileBannerMenu black />
      <Breadcrumbs route={route} crumbs={routeCrumbs(route, e.title || "Event")} />
      <div className="event-reg page-layout">
        <div className="event-info">
          <div className="event-content-bk">
            <div className="content-section">
              <h1 className="title">{e.title}</h1>
              {e.date && <p className="event-date">{e.date}</p>}
              {e.location && (
                <p className="event-loc">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="location-icon">
                    <path d="M10 7C10 8.10457 9.10457 9 8 9C6.89543 9 6 8.10457 6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 7C13 11.7614 8 14.5 8 14.5C8 14.5 3 11.7614 3 7C3 4.23858 5.23858 2 8 2C10.7614 2 13 4.23858 13 7Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{e.location}</span>
                </p>
              )}
              {desc && (
                <div className="description">
                  <Rich html={desc} />
                </div>
              )}
            </div>
          </div>
        </div>
        {imgs.length > 0 && (
          <div className="event-gallery-wrap">
            <div className="event-gallery-container container">
              <div className="row">
                {imgs.map((src: string, i: number) => (
                  <div className="col-xl-3 col-md-4 col-sm-6" key={i}>
                    <div className="img-zoom">
                      <img loading="lazy" src={cft(src, 360, 430)} alt={`${e.title} - ${i + 1}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {(tbDesc || tbImg) && (
          <div className="tile-block-wrapper section-p">
            <div className="tile-block-container container">
              <div className="row align-items-center">
                {tbImg && (
                  <div className="col-xl-6 col-lg-12">
                    <div className="img-section">
                      <img loading="lazy" src={cfw(tbImg, 744)} alt={tb.title || e.title} />
                    </div>
                  </div>
                )}
                <div className="col-xl-6 col-lg-12">
                  <div className="content-section">
                    {tb.title && <h2 className="title">{tb.title}</h2>}
                    {tbDesc && (
                      <div className="description">
                        <Rich html={tbDesc} />
                      </div>
                    )}
                    {tb.cta?.cta_label && (
                      <a className="button button-orange" href={ctaHref(tb.cta, "#register")}>
                        <span>{tb.cta.cta_label}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="register-interest-section section-p" id="Event_Form">
          <div className="register-interest-wrapper container">
            <div className="contact-form-wrapper  section-p">
              <div className="contact-form-container  container">
                <h2 className="title">Register Your Interest</h2>
                <form className="custom-form team-contact-form Event_Form" action="#" method="post">
                  <div className="form-grid">
                    <div className="form-section">
                      <div className="input-box input-box-name">
                        <label className="input-label" htmlFor="name">
                          Full Name
                        </label>
                        <input className="input-field" type="text" name="name" id="name" placeholder="Full Name" />
                      </div>
                      <div className="input-box input-box-telephone">
                        <label className="input-label" htmlFor="phone">
                          Phone Number
                        </label>
                        <input className="input-field" type="tel" name="phone" id="phone" placeholder="Phone Number" />
                      </div>
                      <div className="input-box input-box-email">
                        <label className="input-label" htmlFor="email">
                          Email Address
                        </label>
                        <input className="input-field" type="email" name="email" id="email" placeholder="Email Address" />
                      </div>
                      <div className="input-box input-box-message">
                        <label className="input-label" htmlFor="message">
                          Message
                        </label>
                        <textarea className="input-field input-textarea" name="message" id="message" placeholder="Message"></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="form-bottom">
                    <button className="reg-btn button button-orange" type="submit">
                      <span>Register Interest</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsInAreaSlider({ slug }: { slug: string }) {
  const items = projectsByArea(slug).slice(0, 10);
  if (!items.length) return null;
  return (
    <div className="area-guide-featured-slider-tab-section">
      <div className="tab-body">
        <Slick perView={4}>
          {items.map((p, i) => {
            const link = `/new-projects/${p.slug}/`;
            return (
              <div className="offplan-card-wrap" key={i}>
                <div className="img-section">
                  <div className="flag-section">
                    <p className="img-tag">
                      <span>{Array.isArray(p.building_type) ? p.building_type.join(", ") : p.building_type || "Project"}</span>
                    </p>
                  </div>
                  <a href={link}>
                    <div className="img-section">
                      <img loading="lazy" src={p.images?.["464x312"] || p.images?.["340x252"]} alt={p.title} />
                    </div>
                  </a>
                </div>
                <div className="content-section">
                  <a className="title" href={link}>
                    {p.title}
                  </a>
                  <div className="price">
                    <span>Starting Price </span>
                    {p.display_price ? `AED ${p.display_price}` : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </Slick>
      </div>
    </div>
  );
}
