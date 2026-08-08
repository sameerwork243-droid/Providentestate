"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WHITE_LOGO, BLUE_LOGO } from "./logo-data";
import { HeaderAccountButton } from "@/components/account/header-account-button";

const CF = "https://d3h330vgpwpjr8.cloudfront.net/x/16x16/";

interface MenuLink {
  label: string;
  href: string;
  icon?: string;
}

interface MenuColumn {
  heading: string;
  links: MenuLink[];
  off?: boolean;
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
        heading: "Tenant Resources",
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
    intro: "Off Plan Projects in Dubai",
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
        heading: "Guide to Buying Off Plan",
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
    intro: "Top Developers in Dubai",
    columns: [
      {
        heading: "",
        links: [
          { label: "Emaar Properties", href: "/new-projects/developed-by-emaar-properties/" },
          { label: "Damac Properties", href: "/new-projects/developed-by-damac-properties/" },
          { label: "Sobha Realty", href: "/new-projects/developed-by-sobha-realty/" },
          { label: "Nakheel Properties", href: "/new-projects/developed-by-nakheel/" },
          { label: "Binghatti Properties", href: "/new-projects/developed-by-binghatti/" },
          { label: "Meraas", href: "/new-projects/developed-by-meraas/" },
          { label: "Danube Properties", href: "/new-projects/developed-by-danube-properties/" },
          { label: "Aldar Properties", href: "/new-projects/developed-by-aldar-properties/" },
          { label: "Iman Developers", href: "/new-projects/developed-by-iman-developers/" },
          { label: "H&H Development", href: "/new-projects/developed-by-hh-development/" },
          { label: "BEYOND", href: "/new-projects/developed-by-beyond/" },
          { label: "LEOS Developments", href: "/new-projects/developed-by-leos-developments/" },
          { label: "All Developers", href: "/developers/" },
        ],
      },
    ],
    cta: { title: "Emaar Properties", label: "View All Projects", href: "/new-projects/developed-by-emaar-properties/", image: "emaar_properties_f2c4d0a72c.webp" },
  },
  {
    label: "Areas",
    href: "/area-guides/",
    intro: "Top Areas in Dubai",
    columns: [
      {
        heading: "",
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
        heading: "",
        off: false,
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
      {m.href ? (
        <a className="main-menu" href={m.href}>
          <span>{m.label}</span>
        </a>
      ) : (
        <button className="main-menu">
          <span>{m.label}</span>
        </button>
      )}
      <div className="sub-menu-wrap">
        <div className="sub-menu-section">
          <div className="menu-section-only">
            {m.intro && <p className="h4">{m.intro}</p>}
            {m.columns.map((c, ci) => (
              <div key={ci} className={"sub-menu" + (c.off !== false ? " offplan" : "") + (ci > 0 ? " bt" : "")}>
                {c.heading && <p className="heading">{c.heading}</p>}
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

const LOGO_PREFIX = "data:image/svg+xml;base64,";

function Logo({ white }: { white?: boolean }) {
  return (
    <Link href="/" className="logo">
      <img draggable="false" src={LOGO_PREFIX + (white ? WHITE_LOGO : BLUE_LOGO)} alt="Provident Estate" />
    </Link>
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
  const btn = t ? "button-white-outline" : "button-white";

  return (
    <div className={t ? "header-wrap header-transparent" : "header-wrap"}>
      <div className="header container">
        <Logo white={t} />
        <div className="nav-menu-section">
          {MENUS.map((m, i) => (
            <MegaMenu key={i} m={m} />
          ))}
          <div className="dev-to d-none d-md-block">
            <div className="dev-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M17.4107 11.1607L16.4652 10.2152C16.3226 10.0726 16.2041 9.90811 16.1139 9.72785L15.2139 7.92775C15.1087 7.71732 14.8282 7.6718 14.6618 7.83817C14.4848 8.0152 14.2257 8.08234 13.985 8.01356L12.9242 7.71049C12.5214 7.59539 12.1033 7.83687 12.0017 8.24333C11.9257 8.54718 12.049 8.86597 12.3095 9.0397L12.7985 9.36566C13.2907 9.69383 13.3597 10.3903 12.9414 10.8086L12.7746 10.9754C12.5988 11.1512 12.5 11.3897 12.5 11.6383V11.9807C12.5 12.3205 12.4076 12.6539 12.2328 12.9453L11.1373 14.7712C10.8195 15.3009 10.247 15.625 9.6293 15.625C9.14368 15.625 8.75 15.2313 8.75 14.7457V13.7694C8.75 13.0027 8.28322 12.3133 7.57136 12.0285L7.02624 11.8105C6.20812 11.4832 5.72825 10.6305 5.87311 9.76135L5.87897 9.72616C5.91765 9.49413 5.99964 9.27144 6.12066 9.06973L6.19517 8.94555C6.60286 8.26607 7.39368 7.91624 8.17069 8.07164L9.15223 8.26795C9.63113 8.36373 10.1033 8.0758 10.2375 7.6062L10.4113 6.99812C10.5352 6.56434 10.3326 6.1038 9.92909 5.90204L9.375 5.625L9.29917 5.70083C8.94754 6.05246 8.47063 6.25 7.97335 6.25H7.82258C7.61603 6.25 7.41746 6.33254 7.27141 6.47859C7.03519 6.71481 6.67345 6.77423 6.37465 6.62483C5.97027 6.42264 5.82361 5.91899 6.05622 5.53131L7.2328 3.57033C7.3502 3.37467 7.43041 3.16006 7.47044 2.93728M17.4107 11.1607C17.4695 10.7824 17.5 10.3948 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C9.11236 2.5 8.26073 2.6542 7.47044 2.93728M17.4107 11.1607C16.8528 14.7517 13.7474 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 6.74551 4.57291 3.97517 7.47044 2.93728"
                  stroke="#9399A4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="">AED</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 5.5L8 10.5L3 5.5" stroke="#9399A4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="d-none d-xl-flex log-in-btn">
            <HeaderAccountButton className={btn} />
          </div>
          <div className="nav-menu d-xl-flex d-md-none nav-menu-property-list-button">
            <a className={"button list-prop-btn " + btn} href="/list-your-property/">
              List Your Property
            </a>
          </div>
          <a
            href={WA_LINK}
            className="nav-menu nav-menu-icon-wrap"
            aria-label="WhatsApp Us"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="whatsapp-icon menu-icon"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.9971 0C4.48428 0 0 4.48553 0 9.99991C0 12.1868 0.705268 14.215 1.90417 15.8612L0.658162 19.5766L4.50185 18.3481C6.08275 19.3946 7.96934 20 10.0029 20C15.5157 20 20 15.5143 20 10.0001C20 4.48571 15.5157 0.000165304 10.0029 0.000165304L9.9971 0ZM7.20535 5.07951C7.01145 4.61511 6.86449 4.59753 6.57074 4.58558C6.47072 4.57978 6.35925 4.57397 6.23568 4.57397C5.85352 4.57397 5.45394 4.68564 5.21294 4.93252C4.91918 5.23233 4.19034 5.93182 4.19034 7.36633C4.19034 8.80084 5.23649 10.1882 5.37748 10.3823C5.52444 10.5761 7.41699 13.5626 10.3555 14.7798C12.6535 15.7321 13.3354 15.6439 13.8584 15.5322C14.6224 15.3676 15.5804 14.803 15.8214 14.1213C16.0624 13.4392 16.0624 12.8572 15.9918 12.7337C15.9213 12.6103 15.7272 12.5399 15.4335 12.3928C15.1397 12.2458 13.7114 11.5403 13.441 11.4462C13.1765 11.3463 12.9239 11.3817 12.7242 11.6639C12.442 12.0578 12.1658 12.4576 11.9424 12.6985C11.7661 12.8867 11.478 12.9102 11.2371 12.8102C10.9139 12.6751 10.0089 12.3574 8.89208 11.3639C8.02807 10.5939 7.4404 9.63573 7.27005 9.3477C7.09954 9.05386 7.25245 8.88313 7.38747 8.72452C7.53443 8.54218 7.67543 8.41293 7.82239 8.24236C7.96935 8.07197 8.05163 7.9837 8.14568 7.78378C8.24569 7.58982 8.17502 7.38989 8.10453 7.24289C8.03403 7.09589 7.44636 5.66138 7.20535 5.07951Z"
                fill="#67C15E"
              />
            </svg>
          </a>
          <a href="tel:+971 50 539 0249" className="nav-menu nav-menu-icon-wrap" aria-label="Call Us">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mobile-icon menu-icon"
            >
              <path
                d="M10.5 1.5H8.25C7.00736 1.5 6 2.50736 6 3.75V20.25C6 21.4926 7.00736 22.5 8.25 22.5H15.75C16.9926 22.5 18 21.4926 18 20.25V3.75C18 2.50736 16.9926 1.5 15.75 1.5H13.5M10.5 1.5V3H13.5V1.5M10.5 1.5H13.5M10.5 20.25H13.5"
                stroke={t ? "#fff" : "#07234B"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a className="nav-menu nav-menu-icon-wrap" aria-label="Search Properties" href="/buy/properties-for-sale/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              className="search-icon menu-icon"
            >
              <path
                d="M14.5 14L11.0355 10.5355M11.0355 10.5355C11.9404 9.63071 12.5 8.38071 12.5 7C12.5 4.23858 10.2614 2 7.5 2C4.73858 2 2.5 4.23858 2.5 7C2.5 9.76142 4.73858 12 7.5 12C8.88071 12 10.1307 11.4404 11.0355 10.5355Z"
                stroke={t ? "#fff" : "#07234B"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <button className="nav-menu nav-menu-icon-wrap" onClick={() => setDrawer(true)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="bars-icon menu-icon"
            >
              <path
                d="M3.75 6.75H20.25M3.75 12H20.25M3.75 17.25H20.25"
                stroke={t ? "#fff" : "#07234B"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
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
          <Logo />
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
