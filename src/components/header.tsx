"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CF = "https://d3h330vgpwpjr8.cloudfront.net/x/16x16/";

interface MenuLink {
  label: string;
  href: string;
  icon?: string;
}

interface MenuColumn {
  heading: string;
  links: MenuLink[];
}

interface MenuDef {
  label: string;
  href?: string;
  intro?: string;
  columns: MenuColumn[];
  cta?: { title: string; subtitle?: string; label: string; href: string; image?: string };
  plain?: boolean;
}

const MENUS: MenuDef[] = [
  {
    label: "Buy",
    href: "/buy/properties-for-sale/",
    intro: "Properties for Sale in Dubai",
    columns: [
      {
        heading: "Properties by Type",
        links: [
          { label: "Apartments", href: "/buy/apartment-for-sale/", icon: "apartment_navbar_a62fb5b437.webp" },
          { label: "Villas", href: "/buy/villa-for-sale/", icon: "villa_navbar_b49863c21e.webp" },
          { label: "Townhouses", href: "/buy/townhouse-for-sale/", icon: "navbar_townhouse_de60dd8da9.webp" },
          { label: "Penthouses", href: "/buy/penthouse-for-sale/", icon: "navbar_penthouse_5550318b46.webp" },
          { label: "Commercial", href: "/buy/commercial-properties-for-sale/", icon: "commercial_navbar_c346b05385.webp" },
          { label: "See All Properties", href: "/buy/properties-for-sale/", icon: "grid_01_50def6e330.webp" },
        ],
      },
      {
        heading: "Buyer Resources",
        links: [
          { label: "Buyer's Guide", href: "/property-buying-dubai-guide/" },
          { label: "Mortgage", href: "/property-services/mortgages/" },
          { label: "Signature by Provident", href: "/signature/" },
          { label: "Snagging & Inspection", href: "/property-services/property-snagging/" },
        ],
      },
    ],
    cta: { title: "Signature Collection", label: "Explore Signature", href: "/signature/", image: "signature_property_47dbd09aff.webp" },
  },
  {
    label: "Rent",
    href: "/let/properties-for-rent/",
    intro: "Properties for Rent in Dubai",
    columns: [
      {
        heading: "Properties by Type",
        links: [
          { label: "Apartments", href: "/let/apartment-for-rent/", icon: "apartment_navbar_a62fb5b437.webp" },
          { label: "Villas", href: "/let/villa-for-rent/", icon: "villa_navbar_b49863c21e.webp" },
          { label: "Townhouses", href: "/let/townhouse-for-rent/", icon: "navbar_townhouse_de60dd8da9.webp" },
          { label: "Penthouses", href: "/let/penthouse-for-rent/", icon: "navbar_penthouse_5550318b46.webp" },
          { label: "Commercial", href: "/let/commercial-properties-for-rent/", icon: "commercial_navbar_c346b05385.webp" },
          { label: "See All Properties", href: "/let/properties-for-rent/", icon: "grid_01_50def6e330.webp" },
        ],
      },
      {
        heading: "Tenant's Guide",
        links: [
          { label: "Tenant's Guide", href: "/property-renting-dubai-guide/" },
          { label: "Property Management", href: "/property-services/property-management/" },
          { label: "Short Term Rentals", href: "/property-services/short-term-rentals/" },
        ],
      },
    ],
    cta: { title: "Hot Properties", subtitle: "in Downtown", label: "Explore Now", href: "/let/properties-for-rent/in-downtown-dubai/", image: "downtown_img_d032cd58af.webp" },
  },
  {
    label: "Projects",
    href: "/new-projects/",
    intro: "New Projects in Dubai",
    columns: [
      {
        heading: "Projects by Type",
        links: [
          { label: "Apartments", href: "/new-projects/type-apartment/", icon: "apartment_navbar_a62fb5b437.webp" },
          { label: "Villas", href: "/new-projects/type-villa/", icon: "villa_navbar_b49863c21e.webp" },
          { label: "Townhouses", href: "/new-projects/type-townhouse/", icon: "navbar_townhouse_de60dd8da9.webp" },
          { label: "Commercial", href: "/commercial-new-projects/", icon: "commercial_navbar_c346b05385_1a44a09441.webp" },
          { label: "Penthouses", href: "/new-projects/type-penthouse/", icon: "navbar_penthouse_5550318b46.webp" },
          { label: "Mansions", href: "/new-projects/type-mansions/", icon: "villa_navbar_b49863c21e.webp" },
          { label: "See All New Projects", href: "/new-projects/", icon: "grid_01_50def6e330.webp" },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Off Plan Guide", href: "/offplan-property-buying-dubai-guide/" },
          { label: "Best Dubai Communities", href: "/area-guides/" },
          { label: "Upcoming Roadshows", href: "/roadshow/" },
          { label: "Branded Residences", href: "/branded-residences-in-dubai/" },
        ],
      },
    ],
    cta: { title: "Tilal Binghatti", subtitle: "By Binghatti", label: "View Project", href: "", image: "tilal_binghatii_feature_cf7cf5fbcd.webp" },
  },
  {
    label: "Developers",
    href: "/developers/",
    intro: "Top Dubai Developers",
    columns: [
      {
        heading: "Developers",
        links: [
          { label: "Emaar", href: "/new-projects/developed-by-emaar-properties/" },
          { label: "Damac", href: "/new-projects/developed-by-damac-properties/" },
          { label: "Sobha Realty", href: "/new-projects/developed-by-sobha-realty/" },
          { label: "Nakheel", href: "/new-projects/developed-by-nakheel/" },
          { label: "Binghatti", href: "/new-projects/developed-by-binghatti/" },
          { label: "Meraas", href: "/new-projects/developed-by-meraas/" },
          { label: "Danube", href: "/new-projects/developed-by-danube-properties/" },
          { label: "Aldar", href: "/new-projects/developed-by-aldar-properties/" },
          { label: "Iman Developers", href: "/new-projects/developed-by-iman-developers/" },
          { label: "H&H Development", href: "/new-projects/developed-by-hh-development/" },
          { label: "BEYOND", href: "/new-projects/developed-by-beyond/" },
          { label: "LEOS", href: "/new-projects/developed-by-leos-developments/" },
          { label: "All Developers", href: "/developers/" },
        ],
      },
    ],
    cta: { title: "Emaar Properties", label: "View All Projects", href: "/new-projects/developed-by-emaar-properties/", image: "emaar_properties_f2c4d0a72c.webp" },
  },
  {
    label: "Areas",
    href: "/area-guides/",
    intro: "Best Areas in Dubai",
    columns: [
      {
        heading: "Popular Areas",
        links: [
          { label: "Dubai Creek Harbour", href: "/area-guides/dubai-creek-harbour/" },
          { label: "Business Bay", href: "/area-guides/business-bay/" },
          { label: "Dubai Marina", href: "/area-guides/dubai-marina/" },
          { label: "Palm Jumeirah", href: "/area-guides/palm-jumeirah/" },
          { label: "Downtown Dubai", href: "/area-guides/downtown-dubai/" },
          { label: "Jumeirah Village Circle", href: "/area-guides/jumeirah-village-circle/" },
          { label: "EMAAR Beachfront", href: "/area-guides/emaar-beachfront/" },
          { label: "Sobha Hartland", href: "/area-guides/sobha-hartland/" },
          { label: "Expo City", href: "/area-guides/expo-city/" },
          { label: "Dubai Hills Estate", href: "/area-guides/dubai-hills-estate/" },
          { label: "Dubai Islands", href: "/area-guides/dubai-islands/" },
          { label: "Palm Jebel Ali", href: "/area-guides/palm-jebel-ali/" },
          { label: "DAMAC Islands", href: "/area-guides/damac-islands/" },
          { label: "The Oasis", href: "/area-guides/the-oasis-by-emaar/" },
          { label: "All Areas in Dubai", href: "/area-guides/" },
        ],
      },
    ],
    cta: { title: "Best Dubai Communities", label: "Explore Now", href: "/area-guides/", image: "area_beachfront_4e41f7a01a.webp" },
  },
  {
    label: "Services",
    href: "/property-services/",
    columns: [
      {
        heading: "Our Services",
        links: [
          { label: "Property Management", href: "/property-services/property-management/", icon: "property_management_b164aaddda.webp" },
          { label: "List Your Property", href: "/list-your-property/", icon: "list_your_property_c93b24a87b.webp" },
          { label: "Mortgages", href: "/property-services/mortgages/", icon: "mortgage_6c1a1f2967.webp" },
          { label: "Conveyancing", href: "/property-services/conveyancing/", icon: "convancying_9336e8a2bc.webp" },
          { label: "Short Term Rentals", href: "/property-services/short-term-rentals/", icon: "short_term_rentals_0b6826eaba.webp" },
          { label: "Property Snagging", href: "/property-services/property-snagging/", icon: "property_snagging_029ca1dcc2.webp" },
          { label: "Partner Program", href: "/property-services/partner-program/", icon: "partner_program_d717d0cfd9.webp" },
          { label: "Currency Exchange", href: "/ifx-dubai/", icon: "currency_exchange_2f26732e5f.webp" },
          { label: "PRYPCO", href: "/property-services/prypco/", icon: "prypco_b6f3bcb341.webp" },
          { label: "Ethnovate", href: "/property-services/ethnovate/", icon: "ethnovate_bcb86c20fc.webp" },
          { label: "Plots", href: "/property-services/plots/", icon: "plot_1_02_035f1e1bd0.webp" },
        ],
      },
    ],
  },
  { label: "Blogs", href: "/blog/", columns: [], plain: true },
  {
    label: "More",
    columns: [
      {
        heading: "Company",
        links: [
          { label: "About us", href: "/about/" },
          { label: "Meet the Team", href: "/team/" },
          { label: "Careers", href: "/careers/" },
          { label: "Our Awards", href: "/about/our-awards/" },
          { label: "Contact Us", href: "/contact/" },
          { label: "Real Estate Guides", href: "/real-estate-guides/" },
          { label: "Complaints Procedure", href: "/complaints-procedure/" },
          { label: "Philanthropy", href: "/about/philanthropy/" },
          { label: "Testimonials", href: "/about/reviews/" },
          { label: "Sustainability Initiative", href: "/about/sustainability-initiative/" },
        ],
      },
    ],
  },
];

function SubMenuLink({ l }: { l: MenuLink }) {
  return (
    <a className="sub-menu-link" href={l.href}>
      {l.icon && (
        <img
          loading="eager"
          draggable="false"
          src={CF + l.icon}
          srcSet={`${CF + l.icon} 16w`}
          sizes="(min-width: 100px) 16px"
          alt="banner-bg - Provident Estate"
        />
      )}
      {l.label}
    </a>
  );
}

function MegaMenu({ m }: { m: MenuDef }) {
  if (m.plain)
    return (
      <div className="nav-menu nav-menu-list">
        <a className="main-menu" href={m.href}>
          <span>{m.label}</span>
        </a>
      </div>
    );
  return (
    <div className="nav-menu nav-menu-list">
      <a className="main-menu" href={m.href || "#"}>
        <span>{m.label}</span>
      </a>
      <div className="sub-menu-wrap">
        <div className="sub-menu-section">
          <div className="menu-section-only">
            {m.intro && <p className="h4">{m.intro}</p>}
            {m.columns.map((c, ci) => (
              <div key={ci} className={"sub-menu offplan" + (ci > 0 ? " bt" : "")}>
                <p className="heading">{c.heading}</p>
                <div className="sub-menu-list">
                  {c.links.map((l, li) => (
                    <SubMenuLink key={li} l={l} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {m.cta && (
            <>
              <div className="divider"></div>
              <div className="content-cta-section sub-menu offplan">
                <div className="image-bg">
                  {m.cta.image && (
                    <img
                      loading="eager"
                      draggable="false"
                      src={"https://d3h330vgpwpjr8.cloudfront.net/x/340x270/" + m.cta.image}
                      srcSet={`https://d3h330vgpwpjr8.cloudfront.net/x/340x270/${m.cta.image} 340w, `}
                      sizes="(min-width: 100px) 340px, "
                      alt="banner-bg - Provident Estate"
                    />
                  )}
                  <div className="content">
                    <p className="heading">{m.cta.title}</p>
                    {m.cta.subtitle && <p className="description">{m.cta.subtitle}</p>}
                    <a className="button button-orange" href={m.cta.href}>
                      <span>{m.cta.label}</span>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Logo({ white }: { white: boolean }) {
  return (
    <a aria-current="page" className="logo" href="/">
      {white ? (
        <svg width="128" height="20" viewBox="0 0 128 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#provlogo)">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.4824 6.38326C11.4824 4.56186 10.1389 3.36698 8.25249 3.36698H3.65103V9.37116H8.25249C10.1389 9.37116 11.4824 8.17581 11.4824 6.38326ZM0.307617 19.4158V0.435814H8.70984C12.7115 0.435814 14.9118 3.13953 14.9118 6.38326C14.9118 9.5986 12.6825 12.3023 8.70984 12.3023H3.65103V19.4158H0.307617Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M17.626 19.4163V5.67256H20.627V7.66418C21.6841 6.35535 23.3416 5.3307 25.1135 5.3307V8.29023C24.8566 8.23349 24.5707 8.20465 24.1988 8.20465C22.9128 8.20465 21.2268 9.0586 20.627 10.0544V19.4163H17.626Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M37.7742 12.5298C37.7742 10.1112 36.3741 7.97721 33.8015 7.97721C31.2583 7.97721 29.8288 10.1112 29.8288 12.5298C29.8288 14.9772 31.2583 17.1112 33.8015 17.1112C36.3741 17.1112 37.7742 14.9772 37.7742 12.5298ZM26.7139 12.5298C26.7139 8.57488 29.4005 5.3307 33.8015 5.3307C38.203 5.3307 40.8896 8.57488 40.8896 12.5298C40.8896 16.4567 38.203 19.7577 33.8015 19.7577C29.4005 19.7577 26.7139 16.4567 26.7139 12.5298Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M47.5769 19.4163L41.9463 5.67256H45.1762L49.2058 15.9735L53.2355 5.67256H56.4364L50.8063 19.4163H47.5769Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M58.3229 19.4158H61.3238V5.67209H58.3229V19.4158ZM57.9795 2.14372C57.9795 1.11953 58.8087 0.294418 59.8374 0.294418C60.866 0.294418 61.6948 1.11953 61.6948 2.14372C61.6948 3.16791 60.866 3.99302 59.8374 3.99302C58.8087 3.99302 57.9795 3.16791 57.9795 2.14372Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M74.9268 15.2614V9.82651C74.2696 8.80186 72.7835 7.97674 71.383 7.97674C68.9823 7.97674 67.4673 9.88326 67.4673 12.5293C67.4673 15.2042 68.9823 17.1112 71.383 17.1112C72.7835 17.1112 74.2696 16.2856 74.9268 15.2614ZM74.9268 19.4158V17.5377C73.8692 18.9037 72.2977 19.7572 70.4973 19.7572C66.9815 19.7572 64.3809 17.0828 64.3809 12.5293C64.3809 8.0907 66.9535 5.33023 70.4973 5.33023C72.2407 5.33023 73.8412 6.09861 74.9268 7.57861V0.435814H77.9278V19.4158H74.9268Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M87.959 7.77767C85.4154 7.77767 84.2148 9.74139 84.1003 11.3916H91.8742C91.7883 9.76977 90.6741 7.77767 87.959 7.77767ZM80.9854 12.5298C80.9854 8.54605 83.9004 5.3307 87.988 5.3307C92.1316 5.3307 94.7612 8.46093 94.7612 12.786V13.5256H84.1293C84.3582 15.5744 85.9012 17.3102 88.5018 17.3102C89.8739 17.3102 91.4458 16.7698 92.4456 15.7735L93.8176 17.7372C92.4175 19.0465 90.3882 19.7572 88.2159 19.7572C84.0433 19.7572 80.9854 16.8837 80.9854 12.5298Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M107.078 19.4163V10.8228C107.078 8.66046 105.963 7.97721 104.277 7.97721C102.763 7.97721 101.448 8.88791 100.733 9.7986V19.4163H97.7324V5.67256H100.733V7.52186C101.648 6.44046 103.448 5.3307 105.621 5.3307C108.593 5.3307 110.079 6.92465 110.079 9.74139V19.4163H107.078Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M114.594 16.2005V8.26139H112.308V5.67209H114.594V1.91628H117.595V5.67209H120.395V8.26139H117.595V15.4609C117.595 16.4 118.052 17.1112 118.909 17.1112C119.481 17.1112 119.996 16.8549 120.224 16.5991L120.939 18.8753C120.395 19.3591 119.51 19.7572 118.138 19.7572C115.794 19.7572 114.594 18.5056 114.594 16.2005Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M127.832 17.8214C127.832 18.7772 127.054 19.5516 126.094 19.5516C125.134 19.5516 124.356 18.7772 124.356 17.8214C124.356 16.8656 125.134 16.0912 126.094 16.0912C127.054 16.0912 127.832 16.8656 127.832 17.8214Z" fill="white" />
          </g>
          <defs>
            <clipPath id="provlogo">
              <rect width="128" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <img draggable="false" src="/images/logo.png" alt="Provident Estate" style={{ maxHeight: 40 }} />
      )}
    </a>
  );
}

const WA_LINK =
  "https://wa.provident.ae/inquire?phone=971505423503&text=Hello%20Provident%2C%0A%0AI%20would%20like%20to%20know%20more%20about%20this%20page%3A%0A%0A%E2%80%A2%20Page%20Name%3A%20%0A%E2%80%A2%20Link%3A%20%0A%0AModifying%20this%20message%20will%20prevent%20it%20from%20being%20sent%20to%20the%20agent.&utm_source=Browser%20Direct&gclid=%22%22&event_type=Whatsapp%20Click&utm_platform=%22%22";

export function SiteHeader({ transparent }: { transparent: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const t = transparent && !scrolled;

  return (
    <div className={t ? "header-wrap header-transparent" : "header-wrap"}>
      <div className="header container">
        <Logo white={t} />
        <div className="nav-menu-section">
          {MENUS.map((m, i) => (
            <MegaMenu key={i} m={m} />
          ))}
        </div>
        <div className="dev-to d-none d-md-block">
          <div className="dev-toggle">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#9399A4" strokeWidth="1.2" />
              <path d="M2.5 10h15M10 2.5c2 2 2.9 5 2.9 7.5S12 15.5 10 17.5c-2-2-2.9-5-2.9-7.5S8 4.5 10 2.5Z" stroke="#9399A4" strokeWidth="1.2" />
            </svg>
            <span className="">AED</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 5.5L8 10.5L3 5.5" stroke="#9399A4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="d-none  d-xl-flex log-in-btn">
          <a href="https://myaccount.providentestate.com/" className="button list-prop-btn button-white-outline">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3" stroke={t ? "#fff" : "#07234B"} strokeWidth="1.2" />
              <path d="M4 17c1-3 3-4.5 6-4.5s5 1.5 6 4.5" stroke={t ? "#fff" : "#07234B"} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Login
          </a>
        </div>
        <div className="nav-menu d-xl-flex d-md-none nav-menu-property-list-button">
          <a className="button list-prop-btn button-white-outline" href="/list-your-property/">
            List Your Property
          </a>
        </div>
        <a href={WA_LINK} className="nav-menu nav-menu-icon-wrap" aria-label="WhatsApp Us" target="_blank" rel="noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" className="whatsapp-icon menu-icon">
            <path fill="#67C15E" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-1.5-.5 10.6 10.6 0 0 1-4.6-4.6c-.4-.7-.6-1.2-.7-1.7-.1-.5 0-1.5.6-2 .3-.3.6-.3.9-.3h.6c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6-.2.3-.4.5-.5.6-.2.2-.3.4-.2.6.3.6 1.3 2 2.5 2.6.2.1.4.1.5 0 .2-.1.6-.6.9-1 .2-.2.4-.2.6-.1l1.8.9c.3.1.5.2.5.3 0 .1 0 .5-.1.7Z" />
          </svg>
        </a>
        <a href="tel:+971 50 539 0249" className="nav-menu nav-menu-icon-wrap" aria-label="Call Us">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mobile-icon menu-icon">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 2.1Z" stroke={t ? "#fff" : "#07234B"} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </a>
        <a className="nav-menu nav-menu-icon-wrap" aria-label="Search Properties" href="/buy/properties-for-sale/">
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" className="search-icon menu-icon">
            <circle cx="7" cy="7" r="5.25" stroke={t ? "#fff" : "#07234B"} strokeWidth="1.2" />
            <path d="m11 11 4.5 4.5" stroke={t ? "#fff" : "#07234B"} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </a>
        <button className="nav-menu nav-menu-icon-wrap" onClick={() => setDrawer(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="bars-icon menu-icon">
            <path d="M3 6h18M3 12h18M3 18h18" stroke={t ? "#fff" : "#07234B"} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {drawer && <MobileDrawer onClose={() => setDrawer(false)} />}
    </div>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mobile-drawer-overlay" onClick={onClose}>
      <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-drawer-header">
          <Logo white={false} />
          <button className="mobile-drawer-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5 5 15" stroke="#35373C" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="mobile-drawer-body">
          {MENUS.map((m, i) =>
            m.plain ? (
              <a key={i} className="mobile-nav-item" href={m.href} onClick={onClose}>
                {m.label}
              </a>
            ) : (
              <div key={i} className={"accordion-item" + (open === i ? " open" : "")}>
                <p className="title accordion-header">
                  <button
                    type="button"
                    aria-expanded={open === i}
                    className={"accordion-button" + (open === i ? "" : " collapsed")}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    {m.label}
                  </button>
                </p>
                <div className="accordion-collapse" style={{ display: open === i ? "block" : "none" }}>
                  <div className="cta-section accordion-body">
                    {m.columns.flatMap((c) =>
                      c.links.map((l, li) => (
                        <a key={li} className="cta" href={l.href} onClick={onClose}>
                          <span>{l.label}</span>
                        </a>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        <div className="mobile-drawer-footer">
          <a className="button list-prop-btn button-white-outline" href="/list-your-property/" onClick={onClose}>
            List Your Property
          </a>
        </div>
      </div>
    </div>
  );
}
