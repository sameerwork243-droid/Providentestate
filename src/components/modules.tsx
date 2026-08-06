import { Slick } from "./slick";
import { PropertyCard, MoreBox } from "./property-card";
import { Rich, ctaHref, stripHtml } from "./rich";
import { FaqList } from "./faq";
import { ServiceImage } from "./service-image";
import { PartnerImage } from "./partner-image";
import {
  communities,
  featuredIds,
  signatureIds,
  byLink,
  rentals,
  projectHits,
  blogPosts,
  teamMembers,
  developerHits,
  devLogos,
  cft,
  cfw,
} from "@/lib/store";
import homeJson from "@/data/home.json";

export { Rich, ctaHref, stripHtml };

export function DeveloperSlider({ heading }: { heading?: string }) {
  const h = heading && !heading.includes("\uFFFD") ? heading : "Partners with Dubai's leading developers";
  return (
    <div className="developer-slider-wrap">
      <div className="developer-slider-container container">
        <div className="d-block d-xl-flex align-items-center row">
          <div className="col-xl-2 col-md-12">
            <p className="heading">{h}</p>
          </div>
          <div className="col-xl-10 col-md-12">
            <div className="slider-section">
              <Slick perView={5} arrows={false} autoplay infinite className="developer-slider" breakpoints={[[640, 3], [1024, 4], [1400, 5]]}>
                {[...devLogos, ...devLogos].map((d, i) => (
                  <div key={i} className="developer-card" tabIndex={-1} style={{ width: "100%", display: "inline-block" }}>
                    <div className="developer-image img-zoom">
                      <a className="developer-image img-zoom" href={`/new-projects/developed-by-${d.slug}/`}>
                        <img
                          loading="lazy"
                          draggable="false"
                          src={`https://d3h330vgpwpjr8.cloudfront.net/x/296x/${d.file}`}
                          srcSet={`https://d3h330vgpwpjr8.cloudfront.net/x/118x/${d.file} 118w, https://d3h330vgpwpjr8.cloudfront.net/x/158x/${d.file} 158w, https://d3h330vgpwpjr8.cloudfront.net/x/296x/${d.file} 296w`}
                          sizes="100px 158px"
                          alt={`${d.name} - Provident Estate`}
                        />
                      </a>
                    </div>
                  </div>
                ))}
              </Slick>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedSlider({ m }: { m: any }) {
  const isSignature = !!m.is_signature;
  const ids = isSignature ? signatureIds : featuredIds;
  const sales = ids.map((l) => byLink(l)).filter(Boolean).slice(0, 6);
  const rents = rentals().slice(0, 6);
  const offplan = projectHits(6);
  const cta = m.cta_text?.cta || m.cta || null;
  const ctaLink = ctaHref(cta, isSignature ? "/buy/properties-for-sale/above-20000000/" : "/buy/properties-for-sale/");
  const ctaLabel = cta?.cta_label || (isSignature ? "Explore Signature" : "View more");

  if (isSignature) {
    return (
      <div className="singnature-slider-module-wrap" id="singnature">
        <div className="singnature-slider-module-container container">
          <div className="row">
            <div className="col-xl-3 col-lg-12">
              <div className="content-section">
                {m.logo_image?.url && (
                  <img
                    loading="lazy"
                    draggable="false"
                    src={cft(m.logo_image.url, 216, 96)}
                    srcSet={`${cft(m.logo_image.url, 160, 71)} 160w, ${cft(m.logo_image.url, 216, 96)} 216w`}
                    sizes="(max-width: 1199px) 160px, (min-width: 1199px) 216px"
                    alt="banner-bg - Provident Estate"
                    className="sign-img"
                  />
                )}
                <div className="row">
                  <div className="col-xl-12 col-md-9">
                    <div className="content">
                      <Rich html={m.description?.data?.description} />
                    </div>
                  </div>
                  <div className="col-xl-12 col-md-3">
                    <div className="cta-section">
                      <a className="button button-orange" href={ctaLink}>
                        <span>{ctaLabel}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-1 col-lg-12"></div>
            <div className="col-xl-8 col-lg-12">
              <div>
                <div className="singnature-slider-tab-section">
                  <Slick perView={2} arrows={false} autoplay className="signature-slider">
                    {[...sales, null].map((h, i) =>
                      h ? (
                        <PropertyCard key={i} hit={h} signature />
                      ) : (
                        <MoreBox key={i} title="Dive in the World of Luxury Estate" subtitle="Discover Refined Living with Exceptional Exclusivity" href={ctaLink} btn="View more properties" />
                      )
                    )}
                  </Slick>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-slider-module-wrap section-m">
      <div className="featured-slider-module-container container">
        <div className="content-section tiv">
          <h2 className="title">
            <span>{m.title || "Explore Property in Dubai."}</span>
          </h2>
        </div>
        <div className="featured-slider-tab-section">
          <div className="tab-header-section">
            <div className="custom-tabs tab-header">
              <button className="tab-button button selected-tab" type="button">
                For Sale
              </button>
              <button className="tab-button button button-white" type="button">
                For Rent
              </button>
              <button className="tab-button button button-white" type="button">
                Off Plan
              </button>
            </div>
            <div className="cta-section">
              <a className="button button-orange more-btn" href="/buy/properties-for-sale/">
                View more
              </a>
            </div>
          </div>
          <div className="tab-body">
            <Slick perView={3} arrows={false} autoplay className="featured-slider">
              {[...sales, null].map((h, i) =>
                h ? (
                  <PropertyCard key={i} hit={h} />
                ) : (
                  <MoreBox key={i} title="Explore Thousands of Properties for Sale" subtitle="Browse Through Our Extensive Listings to Find Your Dream Home" href="/buy/properties-for-sale/" btn="View more" />
                )
              )}
            </Slick>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentAndLinks({ m }: { m: any }) {
  const cards = m.cards || [];
  const cls = cards.length === 3 ? "three" : "null";
  return (
    <div className="content-links-wrap section-p ">
      <div className="content-links-container container">
        <div className="content-section">
          <h2 className="title">{m.title}</h2>
          <div className="description">
            <Rich html={m.content?.data?.content} />
          </div>
        </div>
        <div className={"links-section " + cls}>
          {cards.map((c: any, i: number) => {
            const label = c.cta?.cta_label || c.title || "";
            const href = c.cta ? ctaHref(c.cta) : null;
            const rich = c.content?.data?.content;
            const text = rich ? rich : c.description || "";
            return (
              <div className="link-item-wrap" key={i}>
                <div {...({ delay: String(c.delay ?? i * 200) } as any)} className="link-item">
                  <div className="icon-section">
                    <img
                      loading="lazy"
                      draggable="false"
                      src={c.icon?.url ? cft(c.icon.url, 48, 48) : undefined}
                      srcSet={c.icon?.url ? `${cft(c.icon.url, 40, 40)} 40w, ${cft(c.icon.url, 48, 48)} 48w` : undefined}
                      sizes="(max-width: 1199px) 40px, (min-width: 1199px) 48px"
                      alt="icon - Provident Estate"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className={"link-content " + cls}>
                    {href && href !== "#" ? (
                      <a className="link-title" href={href}>
                        <span>{label}</span>
                        <svg width="12" height="12" className="arrow-up-right-icon" viewBox="0 0 12 12" fill="none">
                          <path d="M2.25 9.75 9.75 2.25M9.75 2.25 4.125 2.25M9.75 2.25V7.875" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    ) : label ? (
                      <span className="link-title">
                        <span>{label}</span>
                      </span>
                    ) : null}
                    {rich ? (
                      <div className="link-description">
                        <Rich html={rich} />
                      </div>
                    ) : (
                      <p className="link-description">{text}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AdsBanner({ m }: { m: any }) {
  const b = m.marketing_banner || {};
  return (
    <div className={"ads-banner-wrap section-m" + (m.small ? " ads-banner-wrap-small" : " ads-banner-wrap-card")}>
      <div className="">
        <div className={"ads-banner-container " + (m.small ? "null " : "") + "container"}>
          <div className="gradient-overlay">
            <div className="banner-section">
              <div className="bg-img">
                {b.bg_image?.url && <img loading="lazy" draggable="false" src={cft(b.bg_image.url, 1128, 368)} alt={b.title + " - Provident Estate"} />}
              </div>
              <div className="content-section">
                <div className="content">
                  <p className="heading">{b.heading}</p>
                  <p className="title">{b.title}</p>
                  <div className="description">
                    <Rich html={b.description?.data?.description} />
                  </div>
                </div>
                {b.cta && (
                  <div className="cta-section cta-flex">
                    <a className="button button-orange btn2" href={ctaHref(b.cta)}>
                      <span> {b.cta?.cta_label || "Find out more"}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TileBlock({ m }: { m: any }) {
  const style = (m.style || "").replace(/ads_banner/g, "").trim();
  const alignRight = m.img_align === "right";
  const white = alignRight || m.bg_color === "white";
  const light = style.includes("light") || m.bg_color === "light" || m.img_align === "left";
  const magic = typeof m.cta?.custom_link === "string" && m.cta.custom_link.startsWith("$");
  const tileImg = m.image?.url
    ? (() => {
        const W = alignRight ? 640 : 696;
        const H = alignRight ? 500 : 400;
        const sw = alignRight ? 340 : 336;
        const sh = alignRight ? 0 : 240;
        const base = cft(m.image.url, W, H);
        const small = sh ? cft(m.image.url, sw, sh) : cfw(m.image.url, sw);
        return (
          <img
            loading="lazy"
            draggable="false"
            src={base}
            srcSet={`${small} ${sw}w, ${base} ${W}w, `}
            sizes={`(max-width: 480px) ${sw}px, (min-width: 700px) ${W}px, `}
            alt={m.title + " - Provident Estate"}
          />
        );
      })()
    : null;
  return (
    <div className={"tile-block-wrapper " + (style ? style + " " : "") + "section-m" + (white ? " white" : "") + (light ? " light" : "")}>
      <div className={"tile-block-container " + (alignRight ? "align-img-right contain-image " : "") + "container"}>
        <div className="img-section">
          <div>
            {tileImg}
            {m.video_url && (
              <video autoPlay muted loop playsInline preload="none" poster={m.image?.url || undefined}>
                <source src={m.video_url} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
        <div className="content-section">
          <div>
            <div className="design_title">
              <Rich html={m.design_title?.data?.design_title} />
            </div>
            <h3 className="title">{m.title}</h3>
            <div className="description">
              <Rich html={m.description?.data?.description} />
            </div>
            {m.cta &&
              (magic ? (
                <button className="button  button-orange">
                  <span>{m.cta.cta_label || "Find out more"}</span>
                </button>
              ) : (
                <a href={ctaHref(m.cta)} className="button  button-orange">
                  <span>{m.cta.cta_label || "Find out more"}</span>
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-right-icon">
                    <path d="M9.5 3L14.5 8M14.5 8L9.5 13M14.5 8H2.5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsSection({ m }: { m: any }) {
  const posts = (homeJson.featuredNews || []) as any[];
  if (!posts.length) return null;
  const [feat, ...rest] = posts;
  return (
    <div className="slider-module-wrap news-slider-wrap section-p">
      <div className="slider-module-container container">
        <div className="category-tabs-section">
          <div className="tab-header-section">
            <div className="top-section">
              <div className="content-section">
                <h2 className="title">
                  <span>{m.title || "News"}</span>
                </h2>
              </div>
            </div>
            <div className="custom-tabs category-tabs"></div>
            <div className="cta-section">
              <a className="button button-orange more-btn" href="/blog/">
                More Insights
              </a>
            </div>
          </div>
        </div>
        <div className="news-section">
          <div className="featured-news-card">
            <div className="img-section-wrap img-zoom">
              <a className="img-section" href={`/blog/${feat.slug}/`}>
                {feat.category && <p className="img-tag">{feat.category}</p>}
                {feat.image && (
                  <img
                    loading="lazy"
                    draggable="false"
                    src={feat.image}
                    srcSet={`${feat.image} 1260w, `}
                    sizes="100px 1260px, "
                    alt={feat.title + " - Provident Estate"}
                  />
                )}
              </a>
            </div>
            <div className="content-section">
              <a className="title" href={`/blog/${feat.slug}/`}>
                {feat.title}
              </a>
              <p className="date">{feat.date}</p>
              {feat.description && <p className="description">{feat.description}</p>}
              <a className="button button-white" href={`/blog/${feat.slug}/`}>
                Continue Reading
              </a>
            </div>
          </div>
          <div className="small-news-section">
            {rest.map((b, i) => (
              <div className="small-news-card" key={i}>
                <div className="img-section-wrap img-zoom">
                  <a className="img-section" href={`/blog/${b.slug}/`}>
                    {b.image && (
                      <img
                        loading="lazy"
                        draggable="false"
                        src={b.image}
                        srcSet={`${b.image} 340w, `}
                        sizes="100px 340px, "
                        alt={b.title + " - Provident Estate"}
                      />
                    )}
                  </a>
                </div>
                <div className="content-section">
                  <a className="title" href={`/blog/${b.slug}/`}>
                    {b.title}
                  </a>
                  <p className="date">{b.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewsSlider() {
  const reviews = homeJson.reviews as any[];
  return (
    <div className="review-slider-wrap section-m reviews_slider">
      <div className="review-slider-container container">
        <div className="d-flex">
          <div>
            <h2 className="title">Why Our Clients Trust Us</h2>
            <div className="description">
              <p>Discover what our customers are saying about their experiences.</p>
            </div>
          </div>
          <a className="button button-orange more-btn" href="/about/reviews/">
            See all reviews
          </a>
        </div>
        <Slick perView={3} arrows={false} autoplay className="review-slider">
          {reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="d-flex card-bio">
                <img
                  loading="lazy"
                  draggable="false"
                  src={`https://d3h330vgpwpjr8.cloudfront.net/x/70x70/${i % 2 ? "women_icon_db5442e706.webp" : "man_icon_98ac9e68af.webp"}`}
                  srcSet={`https://d3h330vgpwpjr8.cloudfront.net/x/70x70/${i % 2 ? "women_icon_db5442e706.webp" : "man_icon_98ac9e68af.webp"} 70w`}
                  sizes="(min-width: 100px) 70px"
                  alt={`${r.name} - Provident Estate`}
                />
                <div>
                  <p className="name">{r.name}</p>
                  <p className="date">{r.date}</p>
                  <div className="icons-wrap">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <svg key={s} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="star-icon">
                        <path
                          d="M15.7691 4.85712C15.8545 4.65179 16.1454 4.65179 16.2308 4.85712L19.0654 11.6724C19.2454 12.1052 19.6525 12.4009 20.1197 12.4384L27.4774 13.0282C27.699 13.046 27.7889 13.3226 27.62 13.4673L22.0143 18.2692C21.6583 18.5742 21.5028 19.0526 21.6116 19.5086L23.3242 26.6884C23.3758 26.9047 23.1405 27.0757 22.9507 26.9598L16.6515 23.1122C16.2515 22.8679 15.7484 22.8679 15.3484 23.1122L9.04922 26.9598C8.85945 27.0757 8.62413 26.9047 8.67573 26.6884L10.3884 19.5086C10.4971 19.0526 10.3417 18.5742 9.98569 18.2692L4.37993 13.4673C4.21104 13.3226 4.30092 13.046 4.52259 13.0282L11.8802 12.4384C12.3475 12.4009 12.7545 12.1052 12.9345 11.6724L15.7691 4.85712Z"
                          fill="#EE7133"
                          stroke="#EE7133"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="title-review">{r.title}</p>
              {r.description && (
                <p className="review">
                  {r.description}
                  <span className="read-more">more</span>
                </p>
              )}
            </div>
          ))}
        </Slick>
      </div>
    </div>
  );
}

export function Questionnaire({ m }: { m: any }) {
  return (
    <div className="qes-bk">
      <div className="container">
        <div className="question-banner-wrap">
          <div className="">
            <div className="question-banner-container">
              <div className="bg-img">
                <img
                  loading="lazy"
                  draggable="false"
                  src="https://d3h330vgpwpjr8.cloudfront.net/x/640x700/pro_quiz_banner_a8c3cbc202.webp"
                  srcSet="https://d3h330vgpwpjr8.cloudfront.net/x/320x260/pro_quiz_banner_a8c3cbc202.webp 320w, https://d3h330vgpwpjr8.cloudfront.net/x/640x700/pro_quiz_banner_a8c3cbc202.webp 640w"
                  sizes="(max-width: 480px) 320px, (min-width: 481px) 640px"
                  alt="Confused About Where to Buy or Invest in Dubai? - Provident Estate"
                />
              </div>
              <div className="content-section">
                <div className="div-pad">
                  <div className="content">
                    <p className="title">{m.title}</p>
                    <div className="description">
                      <Rich html={m.content?.data?.content} />
                    </div>
                  </div>
                  <div className="cta-section">
                    <a className="button button-orange cursur">Find My Dream Home!</a>
                    <div className="help-info">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 6V12H16.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="url(#paint0_linear_9303_7430)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <defs>
                          <linearGradient id="paint0_linear_9303_7430" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#07224B"></stop>
                            <stop offset="1" stopColor="#EA6C2E"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      It takes only 30 seconds
                    </div>
                  </div>
                  <div className="content">
                    <div className="description">
                      <Rich html={m.content1?.data?.content1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Communities() {
  const coms = communities;
  return (
    <div className="dubai-communities-wrap section-p">
      <div className="dubai-communities-container container">
        <h2 className="title">Popular Properties in Dubai Communities</h2>
        <div className="dubai-communities-tab-section d-none d-md-block">
          <div className="tab-header-section">
            <div className="custom-tabs tab-header">
              <button className="tab-button button selected-tab" type="button">
                For Sale
              </button>
              <button className="tab-button button button-white" type="button">
                For rent
              </button>
              <button className="tab-button button button-white" type="button">
                Off Plan
              </button>
            </div>
          </div>
          <div className="tab-body">
            {coms.map((c, i) => (
              <a key={i} href={`/buy/properties-for-sale/in-${c.slug}/`}>
                {c.label}
              </a>
            ))}
          </div>
        </div>
        <div className="dubai-communities-tab-section d-block d-md-none accordion">
          {["For Sale", "For Rent", "Off Plan"].map((t, j) => (
            <div className="accordion-item" key={j}>
              <h2 className="title accordion-header">
                <button type="button" aria-expanded="false" className="accordion-button collapsed">
                  {t}
                </button>
              </h2>
              <div className="accordion-collapse collapse">
                <div className="cta-section accordion-body">
                  <div className="tab-body">
                    {coms.map((c, i) => (
                      <a key={i} href={`/buy/properties-for-sale/in-${c.slug}/`}>
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactModule({ m }: { m: any }) {
  return (
    <div className="global-contact-module">
      <div className="container">
        <div className="content">
          {m.heading && <p className="heading">{m.heading}</p>}
          <p className="title">{m.title}</p>
          <div className="cta-section">
            <a className="button button-orange" href="/contact/">
              <span>Contact Us</span>
            </a>
            <a className="button button-white-outline" href="tel:+971 50 539 0249">
              <span>+971 50 539 0249</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentAndStats({ m }: { m: any }) {
  return (
    <div className="content-stats-wrap section-p">
      <div className="content-stats-container container">
        <div className="row">
          <div className="col-xl-4 col-lg-12">
            <div className="content-section">
              <h2 className="title">{m.title}</h2>
              <div className="description">
                <Rich html={m.description?.data?.description} />
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-lg-12">
            <div className="stats-section">
              {(m.stats || []).map((s: any, i: number) => (
                <div className="stat-item" key={i}>
                  <div className="stat-value">{s.stat_value}</div>
                  <p className="stat-title">{s.title}</p>
                  <p className="stat-description">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQ({ m }: { m: any }) {
  const items = (m.faqs || [])
    .map((f: any) => ({ question: f.question, answer: f.answer?.data?.answer || "" }))
    .filter((f: any) => f.answer);
  return <FaqList items={items} title={m.title} />;
}

function OurServices({ m }: { m: any }) {
  return (
    <div className="our-services-wrap section-m grid">
      <div className="our-services-container container">
        <div className="design_title">
          <Rich html={m.design_title?.data?.design_title} />
        </div>
        <h2 className="title">{m.title || m.heading || ""}</h2>
        <div className="services-section">
          <Slick perView={4} className="services-slider" breakpoints={[[640, 2], [1024, 3], [1400, 4]]}>
            {(m.services || []).map((s: any, i: number) => {
              const href = s.cta ? ctaHref(s.cta) : "#";
              return (
                <div className="service-item" key={i}>
                  <a className="img-section img-zoom" href={href}>
                    <ServiceImage url={s.image?.url} alt={(s.cta?.cta_label || s.title || "Service") + " - Provident Estate"} />
                  </a>
                  <div className="content-section false">
                    <a className="title" href={href}>
                      <span>{s.cta?.cta_label || s.title}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </Slick>
        </div>
      </div>
    </div>
  );
}

function OfficeLocation({ m }: { m: any }) {
  return (
    <div className="office-location-wrap section-p">
      <div className="office-location-container container">
        <div className="row">
          {(m.offices || []).map((o: any, i: number) => (
            <div className="col-xl-4 col-md-6" key={i}>
              <div className="office-card">
                {o.tile_image?.url && (
                  <div className="img-section">
                    <img loading="lazy" src={cft(o.tile_image.url, 1128, 752)} alt={o.title} />
                  </div>
                )}
                <div className="content">
                  <p className="title">{o.title}</p>
                  <p className="address">{o.address}</p>
                  {o.phone && (
                    <p className="phone">
                      <a href={`tel:${o.phone.replace(/\s/g, "")}`}>{o.phone}</a>
                    </p>
                  )}
                  {o.email && (
                    <p className="email">
                      <a href={`mailto:${o.email}`}>{o.email}</a>
                    </p>
                  )}
                  {o.opening_hours && <p className="hours">{o.opening_hours}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Partner({ m }: { m: any }) {
  return (
    <div className="our-partner-wrap section-m">
      <div className="our-partner-container container">
        <h2 className="title">{m.title}</h2>
        <div className="description">
          <Rich html={m.content?.data?.content} />
        </div>
        <div className="partner-section">
          <Slick perView={5} className="partner-slider" breakpoints={[[640, 2], [1024, 3], [1400, 5]]}>
            {(m.itemlist || []).map((p: any, i: number) => (
              <div className="partner-item" key={i}>
                <div className="img-section img-zoom">
                  {p.image?.url && (
                    <PartnerImage url={p.image.url} alt={p.name + " - Provident Estate"} />
                  )}
                </div>
                <div className="content-section">
                  <p className="title">{p.name}</p>
                  <div className="description">
                    <Rich html={p.description?.data?.description} />
                  </div>
                </div>
              </div>
            ))}
          </Slick>
        </div>
      </div>
    </div>
  );
}

function FormModule({ m }: { m: any }) {
  return (
    <div className="contact-form-wrapper  section-p" id="General_Enquiry">
      <div className="contact-form-container  container">
        <div className="content-section">
          <h3 className="title">{m.title}</h3>
          <div className="description">
            <Rich html={m.content?.data?.content} />
          </div>
          <div className="cta-section">
            <div className="cta-item">
              <div className="cta-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="whatsapp-icon">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.9971 0C4.48428 0 0 4.48553 0 9.99991C0 12.1868 0.705268 14.215 1.90417 15.8612L0.658162 19.5766L4.50185 18.3481C6.08275 19.3946 7.96934 20 10.0029 20C15.5157 20 20 15.5143 20 10.0001C20 4.48571 15.5157 0.000165304 10.0029 0.000165304L9.9971 0ZM7.20535 5.07951C7.01145 4.61511 6.86449 4.59753 6.57074 4.58558C6.47072 4.57978 6.35925 4.57397 6.23568 4.57397C5.85352 4.57397 5.45394 4.68564 5.21294 4.93252C4.91918 5.23233 4.19034 5.93182 4.19034 7.36633C4.19034 8.80084 5.23649 10.1882 5.37748 10.3823C5.52444 10.5761 7.41699 13.5626 10.3555 14.7798C12.6535 15.7321 13.3354 15.6439 13.8584 15.5322C14.6224 15.3676 15.5804 14.803 15.8214 14.1213C16.0624 13.4392 16.0624 12.8572 15.9918 12.7337C15.9213 12.6103 15.7272 12.5399 15.4335 12.3928C15.1397 12.2458 13.7114 11.5403 13.441 11.4462C13.1765 11.3463 12.9239 11.3817 12.7242 11.6639C12.442 12.0578 12.1658 12.4576 11.9424 12.6985C11.7661 12.8867 11.478 12.9102 11.2371 12.8102C10.9139 12.6751 10.0089 12.3574 8.89208 11.3639C8.02807 10.5939 7.4404 9.63573 7.27005 9.3477C7.09954 9.05386 7.25245 8.88313 7.38747 8.72452C7.5344 8.54218 7.67543 8.41293 7.82239 8.24236C7.96935 8.07197 8.05163 7.9837 8.14568 7.78378C8.24569 7.58982 8.17502 7.38989 8.10453 7.24289C8.03403 7.09589 7.44636 5.66138 7.20535 5.07951Z" fill="#67C15E" />
                </svg>
              </div>
              <div className="cta-content">
                <p className="cta-label">WhatsApp</p>
                <a
                  className="cta-value"
                  href="https://wa.provident.ae/inquire?phone=971505423503&text=Hello%20Provident%2C%0A%0AI%20would%20like%20to%20know%20more%20about%20this%20page%3A%0A%0A%E2%80%A2%20Page%20Name%3A%20%0A%E2%80%A2%20Link%3A%20%0A%0AModifying%20this%20message%20will%20prevent%20it%20from%20being%20sent%20to%20the%20agent.&utm_source=Browser%20Direct&gclid=%22%22&event_type=Whatsapp%20Click&utm_platform=%22%22"
                  target="_blank"
                  rel="noreferrer"
                >
                  Click to WhatsApp
                </a>
              </div>
            </div>
            <div className="divider"></div>
            <div className="cta-item">
              <div className="cta-icon">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="phone-icon">
                  <path d="M1.5 5C1.5 10.5228 5.97715 15 11.5 15H13C13.8284 15 14.5 14.3284 14.5 13.5V12.5856C14.5 12.2414 14.2658 11.9414 13.9319 11.858L10.9831 11.1208C10.6904 11.0476 10.3823 11.157 10.2012 11.3984L9.5544 12.2608C9.36668 12.5111 9.04201 12.6218 8.74823 12.5142C6.5436 11.7066 4.79344 9.95641 3.98584 7.75177C3.87823 7.45799 3.98891 7.13332 4.2392 6.9456L5.10161 6.29879C5.34302 6.11773 5.45241 5.80964 5.37922 5.51689L4.64202 2.5681C4.55856 2.23422 4.25857 2 3.91442 2H3C2.17157 2 1.5 2.67157 1.5 3.5V5Z" stroke="#35373C" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="cta-content phone-content">
                <p className="cta-label">Phone</p>
                <a className="cta-value" href="tel:+971 50 539 0249">
                  +971 50 539 0249
                </a>
              </div>
            </div>
            <div className="divider"></div>
            <div className="cta-item">
              <div className="cta-icon">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="phone-icon">
                  <path d="M14.5 5V12C14.5 12.8284 13.8284 13.5 13 13.5H3C2.17157 13.5 1.5 12.8284 1.5 12V5M14.5 5C14.5 4.17157 13.8284 3.5 13 3.5H3C2.17157 3.5 1.5 4.17157 1.5 5M14.5 5V5.16181C14.5 5.6827 14.2298 6.1663 13.7861 6.43929L8.78615 9.51622C8.30404 9.8129 7.69596 9.8129 7.21385 9.51622L2.21385 6.43929C1.77023 6.1663 1.5 5.6827 1.5 5.16181V5" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="cta-content">
                <p className="cta-label">Email</p>
                <a className="cta-value" href="mailto:info@providentestate.com" target="_blank" rel="noreferrer">
                  info@providentestate.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="form-section">
          <form action="#" method="post" className="custom-form">
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
                <span>Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ImagesSlider({ m }: { m: any }) {
  return (
    <div className="images-slider-wrap section-p">
      <div className="images-slider-container container">
        <Slick perView={3} className="images-slider">
          {(m.images || []).map((im: any, i: number) => (
            <div className="image-item" key={i}>
              <img loading="lazy" src={cft(im.url, 1128, 752)} alt={`Provident Estate ${i + 1}`} />
            </div>
          ))}
        </Slick>
      </div>
    </div>
  );
}

function IconCards({ m }: { m: any }) {
  return (
    <div className="icon-cards-wrap section-p">
      <div className="icon-cards-container container">
        <h2 className="title">{m.title}</h2>
        <div className="description">
          <Rich html={m.description?.data?.description} />
        </div>
        <div className="cards-section">
          {(m.cards || []).map((c: any, i: number) => (
            <div className="icon-card" key={i}>
              <p className="heading">{c.heading}</p>
              {c.icon?.url && <img loading="lazy" src={c.icon.url} alt={c.title} />}
              <p className="title">{c.title}</p>
              <p className="description">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CareerListing({ m }: { m: any }) {
  return (
    <div className="career-listing-wrap section-p">
      <div className="career-listing-container container">
        <h2 className="title">{m.title}</h2>
        <div className="career-list">
          {(m.careers || []).map((c: any, i: number) => (
            <div className="career-item" key={i}>
              <div className="content">
                <p className="title">{c.title}</p>
                <p className="location">{c.location}</p>
              </div>
              <a className="button button-orange" href={`/careers/${c.slug}/`}>
                <span>Apply Now</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NewsListing() {
  const posts = blogPosts(100);
  if (!posts.length) return null;
  return (
    <div className="news-listing-wrap section-p">
      <div className="news-listing-container container">
        <div className="row">
          {posts.map((b, i) => (
            <div className="col-xl-4 col-md-6" key={i}>
              <div className="news-card">
                <div className="img-section-wrap img-zoom">
                  <a className="img-section" href={`/blog/${b.slug}/`}>
                    {b.image && <img loading="lazy" src={cft(b.image, 1128, 752)} alt={b.title} />}
                  </a>
                </div>
                <div className="content-section">
                  {b.category && <p className="img-tag">{b.category}</p>}
                  <a className="title" href={`/blog/${b.slug}/`}>
                    {b.title}
                  </a>
                  <p className="date">{b.date}</p>
                  {b.description && <p className="description">{stripHtml(b.description).slice(0, 160)}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TeamListing() {
  const members = teamMembers();
  if (!members.length) return null;
  return (
    <div className="team-listing-wrap section-p">
      <div className="team-listing-container container">
        <div className="row">
          {members.map((t: any, i: number) => (
            <div className="col-xl-3 col-md-4 col-sm-6" key={i}>
              <a className="team-card" href={`/team/${t.slug}/`}>
                <div className="img-section">
                  {t.image && <img loading="lazy" src={t.image} alt={t.name} />}
                </div>
                <div className="content">
                  <p className="name">{t.name}</p>
                  <p className="designation">{t.designation}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CommunitiesListing() {
  return (
    <div className="communities-listing-wrap section-p">
      <div className="communities-listing-container container">
        <div className="row">
          {communities.map((c, i) => (
            <div className="col-xl-3 col-md-4 col-sm-6" key={i}>
              <a className="community-card" href={`/buy/properties-for-sale/in-${c.slug}/`}>
                <p className="name">{c.label}</p>
                <p className="count">View Properties</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeveloperListing() {
  const devs = developerHits();
  return (
    <div className="developer-listing-wrap section-p">
      <div className="developer-listing-container container">
        <div className="row">
          {devs.map((d: any, i: number) => (
            <div className="col-xl-3 col-md-4 col-sm-6" key={i}>
              <a className="developer-card" href={`/new-projects/developed-by-${(d.developer || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`}>
                <p className="name">{d.developer}</p>
                <p className="count">Projects</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ModuleRenderer({ m }: { m: any }) {
  if (!m) return null;
  switch (m.strapi_component) {
    case "modules.global-module":
      if (m.choose_module === "developer_slider") return <DeveloperSlider heading={m.heading} />;
      if (m.choose_module === "reviews_slider") return <ReviewsSlider />;
      if (m.choose_module === "dubai_communities") return <Communities />;
      if (m.choose_module === "contact_module") return <ContactModule m={m} />;
      if (m.choose_module === "news_slider") return <NewsSection m={m} />;
      return null;
    case "modules.listing-module":
      if (m.module === "news_listing") return <NewsListing />;
      if (m.module === "team_listing") return <TeamListing />;
      if (m.module === "communities_listing") return <CommunitiesListing />;
      if (m.module === "developer_listing") return <DeveloperListing />;
      return null;
    case "modules.content-and-links":
      return <ContentAndLinks m={m} />;
    case "modules.ads-banner":
      return <AdsBanner m={m} />;
    case "modules.tile-block":
      return <TileBlock m={m} />;
    case "modules.featured-prop-slider":
      return <FeaturedSlider m={m} />;
    case "modules.featured-news":
      return <NewsSection m={m} />;
    case "modules.questionnaire":
      return <Questionnaire m={m} />;
    case "modules.content-and-stats":
      return <ContentAndStats m={m} />;
    case "modules.faq":
      return <FAQ m={m} />;
    case "modules.our-services":
      return <OurServices m={m} />;
    case "modules.office-location":
      return <OfficeLocation m={m} />;
    case "modules.partner":
      return <Partner m={m} />;
    case "modules.form-module":
      return <FormModule m={m} />;
    case "modules.images-slider":
      return <ImagesSlider m={m} />;
    case "modules.icon-cards":
      return <IconCards m={m} />;
    case "modules.career-listing":
      return <CareerListing m={m} />;
    default:
      return null;
  }
}



