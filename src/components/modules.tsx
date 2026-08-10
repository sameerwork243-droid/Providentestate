import { Slick } from "./slick";
import { PropertyCard, MoreBox } from "./property-card";
import { Rich, ctaHref, stripHtml } from "./rich";
import { FaqList } from "./faq";
import { ServiceImage } from "./service-image";
import { PartnerImage } from "./partner-image";
import { CountryFlag } from "./phone-flag";
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
import { TeamListingClient } from "./team-listing-client";
import { OfficeCard } from "./office-card";

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
  const isAward = style === "award" || style.includes("award");
  const isYoutube = typeof m.video_url === "string" && /youtu\.?be/.test(m.video_url);
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
            {m.video_url && !isYoutube && (
              <video autoPlay muted loop playsInline preload="none" poster={m.image?.url || undefined}>
                <source src={m.video_url} type="video/mp4" />
              </video>
            )}
            {m.video_url && isYoutube && (
              <a className="video-link-wrap" href={m.video_url} target="_blank" rel="noreferrer" aria-label="Play video">
                <button className="play-button" aria-label="play button" type="button"></button>
              </a>
            )}
          </div>
        </div>
        <div className="content-section">
          <div>
            {isAward && <AwardBadge />}
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
                <a href={ctaHref(m.cta)} className={"button  " + (isAward ? "button-blue" : "button-orange")}>
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

function AwardBadge() {
  return (
    <>
      <a href="/blog/provident-estate-great-place-to-work-certification/" aria-label="Great Place to Work certification">
        <svg xmlns="http://www.w3.org/2000/svg" width="77" height="131" viewBox="0 0 77 131" fill="none">
          <path d="M0 0V110.311L38.4164 131L76.8328 110.311V0H0Z" fill="#002171"></path>
          <path d="M72.4851 117.064H71.7341V118.707H71.0474V117.064H70.3031V116.402H72.4861V117.064H72.4851ZM75.5354 118.707H74.8487V117.757L74.3291 118.682H74.0208L73.5012 117.757V118.707H72.8145V116.402H73.3985L74.1754 117.795L74.9524 116.402H75.5363V118.707H75.5354Z" fill="#002171"></path>
          <path d="M76.8328 0H0V76.8328H76.8328V0Z" fill="#FF1628"></path>
          <path d="M19.116 11.8746V12.9148C19.116 14.8413 18.4994 16.402 17.2663 17.5958C16.0331 18.7906 14.434 19.3879 12.4882 19.3879C10.407 19.3879 8.67348 18.7137 7.30586 17.3653C5.93823 15.9977 5.26402 14.341 5.26402 12.3952C5.26402 10.4494 5.93823 8.77347 7.28665 7.40585C8.65427 6.03822 10.3302 5.36401 12.3336 5.36401C14.8576 5.36401 17.054 6.59718 18.2094 8.50456L15.9361 9.81456C15.3003 8.71681 13.9135 7.9456 12.3144 7.9456C11.0236 7.9456 9.96427 8.36914 9.13544 9.21718C8.30756 10.046 7.90227 11.1053 7.90227 12.3961C7.90227 13.6869 8.32581 14.7271 9.15465 15.5559C10.0027 16.3838 11.1196 16.7891 12.5065 16.7891C14.5675 16.7891 15.9544 15.8258 16.4365 14.2267H12.3528V11.8766H19.1151L19.116 11.8746Z" fill="white"></path>
          <path d="M23.0969 11.1427C23.5358 9.90955 24.6345 9.29297 25.8792 9.29297V12.0676C25.1656 11.9716 24.5068 12.1252 23.9392 12.5305C23.3716 12.9348 23.0969 13.5898 23.0969 14.5147V19.1189H20.7362V9.48601H23.0969V11.1427Z" fill="white"></path>
          <path d="M29.8668 15.3233C30.1943 16.5373 31.1 17.1346 32.5829 17.1346C33.527 17.1346 34.2588 16.8071 34.7409 16.1714L36.7443 17.3267C35.8002 18.6944 34.3942 19.3878 32.5444 19.3878C30.9454 19.3878 29.6738 18.9056 28.7105 17.9433C27.7472 16.98 27.2651 15.7661 27.2651 14.3024C27.2651 12.8387 27.7472 11.644 28.6913 10.6807C29.6354 9.69819 30.8685 9.21606 32.3514 9.21606C33.7575 9.21606 34.933 9.69819 35.8387 10.6807C36.7635 11.6632 37.2255 12.8579 37.2255 14.3024C37.2255 14.6299 37.1871 14.9574 37.1295 15.3233H29.8668ZM34.7409 13.3967C34.4518 12.0867 33.4885 11.4509 32.3524 11.4509C31.0232 11.4509 30.1175 12.1636 29.8284 13.3967H34.7409Z" fill="white"></path>
          <path d="M46.1852 9.48592H48.6707V19.1188H46.1852V17.9817C45.4341 18.9258 44.394 19.3878 43.0446 19.3878C41.6952 19.3878 40.6561 18.9056 39.7312 17.9231C38.8255 16.9406 38.3636 15.7267 38.3636 14.3014C38.3636 12.8762 38.8265 11.6814 39.7312 10.6989C40.6561 9.71642 41.7538 9.21509 43.0446 9.21509C44.3354 9.21509 45.4332 9.67705 46.1852 10.6211V9.48496V9.48592ZM43.5075 17.0184C44.2787 17.0184 44.9136 16.7678 45.4149 16.2674C45.9345 15.7468 46.1852 15.0918 46.1852 14.3024C46.1852 13.5129 45.9345 12.8579 45.4149 12.3566C44.9136 11.836 44.2787 11.5863 43.5075 11.5863C42.7363 11.5863 42.1015 11.837 41.6002 12.3566C41.0988 12.8579 40.8491 13.5129 40.8491 14.3024C40.8491 15.0918 41.0998 15.7468 41.6002 16.2674C42.1005 16.7678 42.7363 17.0184 43.5075 17.0184Z" fill="white"></path>
          <path d="M56.8208 11.8744H54.6435V15.8813C54.6435 16.9214 55.3946 16.9406 56.8208 16.8638V19.1179C53.4104 19.503 52.158 18.5205 52.158 15.8813V11.8744H50.4821V9.48589H52.158V7.5401L54.6435 6.78906V9.48589H56.8208V11.8744Z" fill="white"></path>
          <path d="M12.0656 22.5708C13.3564 22.5708 14.4542 23.0135 15.3406 23.8808C16.2271 24.7481 16.6698 25.8266 16.6698 27.0982C16.6698 28.3698 16.2271 29.4483 15.3406 30.3156C14.4542 31.1828 13.3564 31.6256 12.0656 31.6256H9.6963V36.0569H7.03789V22.5708H12.0666H12.0656ZM12.0656 29.14C13.2018 29.14 14.0306 28.2535 14.0306 27.0982C14.0306 25.9428 13.2028 25.0563 12.0656 25.0563H9.6963V29.14H12.0656Z" fill="white"></path>
          <path d="M20.9667 22.6956H18.4811V36.0568H20.9667V22.6956Z" fill="white"></path>
          <path d="M30.9463 26.4237H33.4319V36.0556H30.9463V34.9185C30.1953 35.8626 29.1552 36.3245 27.8058 36.3245C26.4564 36.3245 25.4173 35.8424 24.4924 34.8609C23.5867 33.8784 23.1248 32.6644 23.1248 31.2392C23.1248 29.8139 23.5867 28.6192 24.4924 27.6367C25.4173 26.6542 26.515 26.1528 27.8058 26.1528C29.0966 26.1528 30.1943 26.6148 30.9463 27.5589V26.4227V26.4237ZM28.2687 33.9562C29.0399 33.9562 29.6748 33.7055 30.1761 33.2051C30.6957 32.6846 30.9463 32.0296 30.9463 31.2401C30.9463 30.4507 30.6957 29.7957 30.1761 29.2943C29.6748 28.7738 29.0399 28.5241 28.2687 28.5241C27.4975 28.5241 26.8627 28.7748 26.3613 29.2943C25.86 29.7957 25.6103 30.4507 25.6103 31.2401C25.6103 32.0296 25.861 32.6846 26.3613 33.2051C26.8617 33.7055 27.4985 33.9562 28.2687 33.9562Z" fill="white"></path>
          <path d="M37.0161 34.8619C36.0528 33.8794 35.5707 32.6846 35.5707 31.2402C35.5707 29.7957 36.0528 28.601 37.0161 27.6185C37.9986 26.636 39.2126 26.1548 40.657 26.1548C42.526 26.1548 44.1827 27.1181 44.9722 28.6403L42.8343 29.8927C42.4492 29.1032 41.6203 28.6019 40.6378 28.6019C39.155 28.6019 38.0563 29.6997 38.0563 31.2411C38.0563 31.9922 38.3069 32.628 38.7881 33.1293C39.2692 33.6105 39.8858 33.8611 40.6378 33.8611C41.6395 33.8611 42.4684 33.379 42.8535 32.5895L45.0115 33.8227C44.1645 35.345 42.526 36.3275 40.658 36.3275C39.2135 36.3275 37.9996 35.8453 37.0171 34.8628" fill="white"></path>
          <path d="M48.98 32.2611C49.3075 33.475 50.2132 34.0724 51.696 34.0724C52.6401 34.0724 53.3719 33.7449 53.8541 33.1091L55.8575 34.2645C54.9134 35.6321 53.5074 36.3255 51.6576 36.3255C50.0585 36.3255 48.7869 35.8434 47.8237 34.8811C46.8604 33.9178 46.3782 32.7038 46.3782 31.2401C46.3782 29.7765 46.8604 28.5817 47.8044 27.6184C48.7485 26.6359 49.9817 26.1538 51.4646 26.1538C52.8706 26.1538 54.0462 26.635 54.9518 27.6184C55.8767 28.6009 56.3387 29.7957 56.3387 31.2401C56.3387 31.5676 56.3002 31.8951 56.2426 32.2611H48.98ZM53.8541 30.3345C53.565 29.0245 52.6017 28.3887 51.4655 28.3887C50.1363 28.3887 49.2307 29.1013 48.9416 30.3345H53.8541Z" fill="white"></path>
          <path d="M15.186 40.1816V42.598H11.5451V52.9935H8.88668V42.598H5.26401V40.1816H15.186Z" fill="white"></path>
          <path d="M19.3273 53.2635C17.9021 53.2635 16.6881 52.7814 15.7056 51.7989C14.7231 50.8164 14.241 49.6024 14.241 48.1772C14.241 46.7519 14.7231 45.5572 15.7056 44.5747C16.6881 43.5922 17.9021 43.0908 19.3273 43.0908C20.7526 43.0908 21.9665 43.5912 22.949 44.5747C23.9315 45.5572 24.4328 46.7519 24.4328 48.1772C24.4328 49.6024 23.9325 50.8164 22.949 51.7989C21.9665 52.7814 20.7526 53.2635 19.3273 53.2635ZM19.3273 50.8356C20.0783 50.8356 20.6949 50.5849 21.1963 50.0845C21.6966 49.5832 21.9473 48.9474 21.9473 48.1772C21.9473 47.4069 21.6966 46.7711 21.1963 46.2698C20.6949 45.7694 20.0793 45.5187 19.3273 45.5187C18.5753 45.5187 17.9597 45.7694 17.4583 46.2698C16.9762 46.7711 16.7265 47.4059 16.7265 48.1772C16.7265 48.9484 16.9772 49.5832 17.4583 50.0845C17.9587 50.5849 18.5753 50.8356 19.3273 50.8356Z" fill="white"></path>
          <path d="M9.40529 70.7197L5.62895 57.2336H8.42183L11.0034 67.2325L13.8165 57.2336H16.0897L18.922 67.2325L21.5036 57.2336H24.2964L20.5211 70.7197H17.4958L14.9526 61.8186L12.4296 70.7197H9.40529Z" fill="white"></path>
          <path d="M29.1533 70.9898C27.728 70.9898 26.5141 70.5077 25.5316 69.5252C24.5491 68.5427 24.067 67.3287 24.067 65.9035C24.067 64.4782 24.5491 63.2643 25.5316 62.2818C26.5141 61.2993 27.728 60.8172 29.1533 60.8172C30.5785 60.8172 31.7925 61.2993 32.775 62.2818C33.7575 63.2643 34.2396 64.4782 34.2396 65.9035C34.2396 67.3287 33.7575 68.5427 32.775 69.5252C31.7925 70.5077 30.5785 70.9898 29.1533 70.9898ZM29.1533 68.581C29.9043 68.581 30.5209 68.3303 31.0222 67.8299C31.5226 67.3286 31.7733 66.6928 31.7733 65.9225C31.7733 65.1523 31.5226 64.5164 31.0222 64.0151C30.5209 63.5147 29.9053 63.264 29.1533 63.264C28.4013 63.264 27.7857 63.5147 27.2843 64.0151C26.8022 64.5164 26.5525 65.1513 26.5525 65.9225C26.5525 66.6938 26.8032 67.3286 27.2843 67.8299C27.7847 68.3303 28.4013 68.581 29.1533 68.581Z" fill="white"></path>
          <path d="M38.7293 70.9898C37.304 70.9898 36.0901 70.5077 35.1076 69.5252C34.1251 68.5427 33.643 67.3287 33.643 65.9035C33.643 64.4782 34.1251 63.2643 35.1076 62.2818C36.0901 61.2993 37.304 60.8172 38.7293 60.8172C40.1546 60.8172 41.3685 61.2993 42.351 62.2818C43.3335 63.2643 43.8156 64.4782 43.8156 65.9035C43.8156 67.3287 43.3335 68.5427 42.351 69.5252C41.3685 70.5077 40.1546 70.9898 38.7293 70.9898ZM38.7293 68.581C39.4803 68.581 40.0969 68.3303 40.5982 67.8299C41.0986 67.3286 41.3493 66.6928 41.3493 65.9225C41.3493 65.1523 41.0986 64.5164 40.5982 64.0151C40.0969 63.5147 39.4813 63.264 38.7293 63.264C37.9773 63.264 37.3617 63.5147 36.8603 64.0151C36.3782 64.5164 36.1285 65.1513 36.1285 65.9225C36.1285 66.6938 36.3792 67.3286 36.8603 67.8299C37.3607 68.3303 37.9773 68.581 38.7293 68.581Z" fill="white"></path>
          <path d="M56.3816 57.2336V70.7197H53.9161L47.5408 62.3588V70.7197H44.8824V57.2336H47.348L53.7229 65.6148V57.2336H56.3816Z" fill="white"></path>
          <path d="M60.6884 62.3564C61.4394 61.2212 62.6726 60.8172 63.9047 60.8172V63.8698C63.1293 63.7522 62.4007 63.9268 61.7705 64.3988C61.1597 64.8515 60.8225 65.5942 60.8225 66.6215V70.7197H58.1641V60.9622H60.6884V62.3564Z" fill="white"></path>
          <path d="M69.0606 67.7638C69.4088 69.1548 70.4127 69.828 72.0735 69.828C73.1192 69.828 73.9331 69.4556 74.4621 68.7512L76.6992 70.0258C75.6535 71.5453 74.0685 72.322 71.9447 72.322C70.154 72.322 68.7188 71.7767 67.6732 70.6861C66.6082 69.5761 66.0763 68.1867 66.0763 66.5378C66.0763 64.8889 66.6082 63.5175 67.6538 62.4075C68.6995 61.2975 70.0672 60.7338 71.7952 60.7338C73.2979 60.7338 74.6014 61.2975 75.647 62.4075C76.6732 63.5175 77.1863 64.8889 77.1863 66.5378C77.1863 66.8739 77.1476 67.2474 77.0901 67.6447L69.0606 67.7638ZM74.5277 65.518C74.2215 64.0483 73.1758 63.3431 71.9076 63.3431C70.4488 63.3431 69.4218 64.1241 69.1156 65.518H74.5277Z" fill="white"></path>
          <path d="M12.0656 83.4284C13.3564 83.4284 14.4542 83.8712 15.3406 84.7384C16.2271 85.6057 16.6698 86.6842 16.6698 87.9558C16.6698 89.2275 16.2271 90.306 15.3406 91.1732C14.4542 92.0405 13.3564 92.4832 12.0656 92.4832H9.6963V96.9145H7.03789V83.4284H12.0666H12.0656ZM12.0656 89.9976C13.2018 89.9976 14.0306 89.1111 14.0306 87.9558C14.0306 86.8004 13.2028 85.9139 12.0656 85.9139H9.6963V89.9976H12.0656Z" fill="white"></path>
          <path d="M20.9667 83.5532H18.4811V96.9144H20.9667V83.5532Z" fill="white"></path>
          <path d="M26.7049 80.4863H29.1905V96.9143H26.7049V95.7772C25.9539 96.7213 24.9138 97.1832 23.5644 97.1832C22.215 97.1832 21.1759 96.7011 20.251 95.7186C19.3453 94.7361 18.8834 93.5221 18.8834 92.0968C18.8834 90.6716 19.3453 89.4769 20.251 88.4944C21.1759 87.5119 22.2736 87.0105 23.5644 87.0105C24.8552 87.0105 25.9529 87.4725 26.7049 88.4166V87.2804V80.4863ZM24.0273 94.8138C24.7985 94.8138 25.4334 94.5632 25.9347 94.0628C26.4543 93.5423 26.7049 92.8872 26.7049 92.0978C26.7049 91.3084 26.4543 90.6534 25.9347 90.152C25.4334 89.6315 24.7985 89.3818 24.0273 89.3818C23.2561 89.3818 22.6213 89.6325 22.1199 90.152C21.6186 90.6534 21.3689 91.3084 21.3689 92.0978C21.3689 92.8872 21.6196 93.5423 22.1199 94.0628C22.6203 94.5632 23.2571 94.8138 24.0273 94.8138Z" fill="white"></path>
          <path d="M31.1499 96.9144V83.4283H33.7238C35.1271 83.4283 36.2441 83.7945 37.055 84.5455C37.866 85.2966 38.277 86.2824 38.277 87.5221C38.277 88.1243 38.1616 88.6489 37.9498 89.0948C37.738 89.5408 37.4126 89.9133 36.9735 90.212C37.8282 90.531 38.5156 91.0611 39.017 91.8122C39.5387 92.5632 39.8004 93.4659 39.8004 94.5206C39.8004 95.8056 39.3895 96.838 38.5676 97.6176C37.7458 98.3973 36.6624 98.7871 35.3172 98.7871H31.1499V96.9144ZM33.6355 91.1344H33.6723V94.9965H35.5112C36.1217 94.9965 36.601 94.8873 36.9682 94.6497C37.3354 94.4313 37.5289 94.069 37.5289 93.5625C37.5289 93.0559 37.3354 92.6843 36.9682 92.4468C36.6009 92.2093 36.1217 92.1001 35.5112 92.1001H33.6355V91.1344ZM35.1624 84.9672H33.6355V88.9975H35.1624C35.7537 88.9975 36.2529 88.869 36.6404 88.6122C37.0279 88.3747 37.2216 87.9791 37.2216 87.4257C37.2216 86.8723 37.0279 86.4729 36.6404 86.2353C36.2529 85.9785 35.7537 85.8501 35.1624 85.8501V84.9672Z" fill="white"></path>
          <path d="M44.2016 84.0884C44.9526 82.9532 46.1858 82.5492 47.4179 82.5492V85.6018C46.6425 85.4842 45.9139 85.6588 45.2837 86.1308C44.6729 86.5835 44.3357 87.3262 44.3357 88.3535V92.4517H41.6773V82.5492H44.2016V84.0884ZM47.6147 92.4517H45.0585V82.5492H47.6147V92.4517Z" fill="white"></path>
          <path d="M51.2256 84.0884C51.9766 82.9532 53.2098 82.5492 54.4419 82.5492V85.6018C53.6665 85.4842 52.9379 85.6588 52.3077 86.1308C51.6969 86.5835 51.3597 87.3262 51.3597 88.3535V92.4517H48.7013V82.5492H51.2256V84.0884ZM54.6387 92.4517H52.0825V82.5492H54.6387V92.4517Z" fill="white"></path>
          <path d="M58.402 92.4517V82.5493H60.8867V83.6864C61.6377 82.7423 62.6778 82.2803 64.0272 82.2803C65.3766 82.2803 66.4157 82.7624 67.3406 83.7449C68.2463 84.7274 68.7082 85.9414 68.7082 87.3666C68.7082 88.7919 68.2463 89.9866 67.3406 90.9691C66.4157 91.9516 65.318 92.453 64.0272 92.453C62.7364 92.453 61.6387 91.991 60.8867 91.0469V92.1831V92.4517H58.402ZM64.0798 90.1543C64.851 90.1543 65.4859 89.9036 65.9872 89.4032C66.5068 88.8827 66.7574 88.2277 66.7574 87.4382C66.7574 86.6488 66.5068 85.9938 65.9872 85.4924C65.4859 84.9719 64.851 84.7222 64.0798 84.7222C63.3086 84.7222 62.6738 84.9729 62.1724 85.4924C61.6711 85.9938 61.4214 86.6488 61.4214 87.4382C61.4214 88.2277 61.6721 88.8827 62.1724 89.4032C62.6728 89.9036 63.3096 90.1543 64.0798 90.1543Z" fill="white"></path>
          <path d="M8.22678 102.435C9.35995 102.435 10.3158 102.773 11.0753 103.449C11.8539 104.126 12.2432 105.02 12.2432 106.132C12.2432 107.243 11.8539 108.137 11.0753 108.814C10.3158 109.49 9.35995 109.829 8.22678 109.829H5.26401V113.424H2.6056V102.435H8.22678ZM8.14803 107.536C8.95777 107.536 9.57437 107.302 9.998 106.834C10.4216 106.347 10.6335 105.737 10.6335 105.004C10.6335 104.271 10.4216 103.67 9.998 103.202C9.57437 102.734 8.95777 102.5 8.14803 102.5H5.26401V107.536H8.14803Z" fill="white"></path>
          <path d="M16.0305 113.424H13.2456V102.435H16.0305V103.552C16.8402 102.548 17.8268 102.045 19.0106 102.045C20.1345 102.045 21.0225 102.443 21.6751 103.238C22.3277 104.033 22.6552 105.024 22.6552 106.212V113.424H19.8703V106.945C19.8703 106.192 19.6522 105.571 19.2161 105.083C18.7799 104.596 18.2238 104.352 17.5677 104.352C16.9117 104.352 16.3791 104.578 15.9699 105.03C15.5799 105.464 15.385 106.023 15.385 106.706V113.424H16.0305Z" fill="white"></path>
          <path d="M26.4631 99.6032H29.2674V113.424H26.4631V112.366C25.6534 113.349 24.6668 113.841 23.4831 113.841C22.3592 113.841 21.4902 113.443 20.8376 112.648C20.1851 111.852 19.8576 110.862 19.8576 109.674V102.403H22.6424V108.783C22.6424 109.536 22.8606 110.157 23.2967 110.645C23.7328 111.132 24.2889 111.376 24.945 111.376C25.601 111.376 26.1336 111.15 26.5429 110.698C26.9329 110.264 27.1278 109.705 27.1278 109.022V102.403H26.4631V99.6032Z" fill="white"></path>
          <path d="M34.9159 113.958C33.6749 113.958 32.6839 113.562 31.9431 112.77C31.2018 111.998 30.8305 110.957 30.8305 109.647C30.8305 108.337 31.2018 107.306 31.9431 106.533C32.6839 105.761 33.6749 105.385 34.9159 105.385C36.1569 105.385 37.148 105.761 37.8887 106.533C38.6299 107.306 39.0012 108.337 39.0012 109.647C39.0012 110.957 38.6299 111.998 37.8887 112.77C37.148 113.562 36.1569 113.958 34.9159 113.958ZM34.8958 111.526C35.568 111.526 36.0892 111.319 36.4582 110.905C36.8271 110.491 37.0117 109.965 37.0117 109.328C37.0117 108.69 36.8271 108.164 36.4582 107.75C36.0892 107.336 35.568 107.129 34.8958 107.129C34.2237 107.129 33.7025 107.336 33.3335 107.75C32.9645 108.164 32.7799 108.69 32.7799 109.328C32.7799 109.965 32.9645 110.491 33.3335 110.905C33.7025 111.319 34.2237 111.526 34.8958 111.526Z" fill="white"></path>
          <path d="M43.5624 113.424H40.7776V102.435H43.5624V103.552C44.3721 102.548 45.3587 102.045 46.5424 102.045C47.6663 102.045 48.5543 102.443 49.2069 103.238C49.8595 104.033 50.187 105.024 50.187 106.212V113.424H47.4021V106.945C47.4021 106.192 47.184 105.571 46.7479 105.083C46.3117 104.596 45.7556 104.352 45.0995 104.352C44.4435 104.352 43.9109 104.578 43.5017 105.03C43.1117 105.464 42.9168 106.023 42.9168 106.706V113.424H43.5624Z" fill="white"></path>
          <path d="M54.1199 113.424H51.335V102.435H54.1199V103.552C54.9296 102.548 55.9162 102.045 57.0999 102.045C58.2238 102.045 59.1118 102.443 59.7644 103.238C60.417 104.033 60.7445 105.024 60.7445 106.212V113.424H57.9596V106.945C57.9596 106.192 57.7415 105.571 57.3054 105.083C56.8692 104.596 56.3131 104.352 55.657 104.352C55.001 104.352 54.4684 104.578 54.0592 105.03C53.6692 105.464 53.4743 106.023 53.4743 106.706V113.424H54.1199Z" fill="white"></path>
          <path d="M68.4337 113.958C67.1927 113.958 66.2016 113.562 65.4609 112.77C64.7196 111.998 64.3483 110.957 64.3483 109.647C64.3483 108.337 64.7196 107.306 65.4609 106.533C66.2016 105.761 67.1927 105.385 68.4337 105.385C69.6747 105.385 70.6657 105.761 71.4065 106.533C72.1477 107.306 72.519 108.337 72.519 109.647C72.519 110.957 72.1477 111.998 71.4065 112.77C70.6657 113.562 69.6747 113.958 68.4337 113.958ZM68.4136 111.526C69.0858 111.526 69.607 111.319 69.976 110.905C70.3449 110.491 70.5295 109.965 70.5295 109.328C70.5295 108.69 70.3449 108.164 69.976 107.75C69.607 107.336 69.0858 107.129 68.4136 107.129C67.7415 107.129 67.2203 107.336 66.8513 107.75C66.4823 108.164 66.2977 108.69 66.2977 109.328C66.2977 109.965 66.4823 110.491 66.8513 110.905C67.2203 111.319 67.7415 111.526 68.4136 111.526Z" fill="white"></path>
        </svg>
      </a>
      <div className="award-bki">
        <div className="text">
          <a href="/about/our-awards/">100+Awards</a>
        </div>
        <div className="google">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Google">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
        </div>
        <div className="google-review">
          <div className="txt">4.7 </div>
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.15503 4.83041L1.50914 5.53539L1.42685 5.55292C1.30229 5.58753 1.18873 5.65612 1.09778 5.75169C1.00682 5.84726 0.941731 5.96637 0.90915 6.09688C0.87657 6.22739 0.877667 6.36461 0.912329 6.49452C0.946991 6.62444 1.01398 6.7424 1.10645 6.83636L4.47217 10.2652L3.67844 15.1086L3.66897 15.1925C3.66135 15.3273 3.6881 15.4618 3.74649 15.5823C3.80488 15.7028 3.89281 15.8048 4.00127 15.878C4.10974 15.9512 4.23484 15.9929 4.36378 15.9989C4.49271 16.0048 4.62084 15.9748 4.73505 15.9119L8.89014 13.6255L13.0358 15.9119L13.1086 15.947C13.2288 15.9965 13.3594 16.0117 13.4871 15.991C13.6147 15.9703 13.7348 15.9144 13.835 15.829C13.9352 15.7437 14.012 15.632 14.0573 15.5054C14.1027 15.3788 14.115 15.2419 14.0931 15.1086L13.2986 10.2652L16.6658 6.8356L16.7226 6.77082C16.8038 6.66623 16.857 6.541 16.8768 6.40789C16.8966 6.27477 16.8824 6.13853 16.8356 6.01305C16.7887 5.88756 16.7109 5.77732 16.6101 5.69355C16.5093 5.60977 16.3891 5.55547 16.2617 5.53616L11.6158 4.83041L9.53896 0.42525C9.47887 0.297618 9.38584 0.190142 9.2704 0.114987C9.15496 0.039832 9.02172 0 8.88577 0C8.74982 0 8.61659 0.039832 8.50115 0.114987C8.38571 0.190142 8.29267 0.297618 8.23258 0.42525L6.15503 4.83041Z" fill="#F89811" />
          </svg>
          <div className="txt-1">440+ Reviews</div>
        </div>
      </div>
    </>
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
              <span><CountryFlag /> +971 50 539 0249</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentAndStats({ m }: { m: any }) {
  return (
    <div className="content-and-stats-wrap section-m">
      <div className="content-and-stats-container container">
        {m.heading && <p className="heading">{m.heading}</p>}
        <div className="content-section">
          {m.title && <p className="main-content">{m.title}</p>}
          {m.description?.data?.description && (
            <div className="description">
              <Rich html={m.description.data.description} />
            </div>
          )}
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
        {m.heading && <p className="heading">{m.heading}</p>}
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
                    {s.description && <p className="description">{s.description}</p>}
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
  const offices = m.offices || [];
  if (!offices.length) return null;
  return (
    <div className="office-listing-wrap section-m">
      <div className="office-listing-container container">
        <div className="office-listing-section">
          {offices.map((o: any, i: number) => (
            <OfficeCard office={o} key={i} />
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
                  <CountryFlag /> +971 50 539 0249
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
    <div className="career-listing-wrap section-p" id="careers-listing">
      <div className="career-listing-container container">
        <h2 className="title">{m.title}</h2>
        <div className="career-listing-section">
          {(m.careers || []).map((c: any, i: number) => (
            <div className="career-item" key={i}>
              <p className="title">{c.title}</p>
              <div className="sub-section">
                <p className="location">{c.location}</p>
                <a className="career-link" href={`/careers/${c.slug}/`}>
                  <span>View Details</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="content-cta">
          <a className="cta" href="/contact/">
            <span>Nothing quite right for you?</span>
          </a>
          <p className="cta-text">
            <span>We&rsquo;re always on the lookout for standout individuals</span>
          </p>
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
  const members = teamMembers(1000);
  if (!members.length) return null;
  return <TeamListingClient members={members} />;
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



