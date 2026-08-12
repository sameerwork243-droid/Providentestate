import type { NavLink } from "./types";

export const SITE = {
  name: "Zoya Ventures Real Estate",
  domain: "provident.ae",
  phone: "+971 568 308 221",
  phoneLink: "+971568308221",
  waNumber: "971568308221",
  email: "zoyaventure15@gmail.com",
  mapQuery: "Dubai Marina",
  social: ["instagram", "facebook", "linkedin", "x", "youtube"],
};

export const NAV_LINKS = [
  {
    label: "Buy",
    href: "/buy",
    children: [
      { label: "Apartments for sale", href: "/buy/apartments-for-sale" },
      { label: "Villas for sale", href: "/buy/villas-for-sale" },
      { label: "Townhouses for sale", href: "/buy/townhouses-for-sale" },
      { label: "Penthouse for sale", href: "/buy/penthouses-for-sale" },
      { label: "All properties for sale", href: "/buy" },
    ],
  },
  {
    label: "Rent",
    href: "/let",
    children: [
      { label: "Apartments for rent", href: "/let/apartments-for-rent" },
      { label: "Villas for rent", href: "/let/villas-for-rent" },
      { label: "All properties to rent", href: "/let" },
    ],
  },
  {
    label: "New Projects",
    href: "/new-projects",
    children: [
      { label: "All new projects", href: "/new-projects" },
      { label: "Under construction", href: "/new-projects/type-under-construction" },
      { label: "Ready to move in", href: "/new-projects/type-ready" },
      { label: "Across all developers", href: "/developers" },
    ],
  },
  { label: "Area Guides", href: "/area-guides" },
  { label: "Blog", href: "/blog" },
  { label: "Team", href: "/team" },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About us", href: "/about" },
      { label: "Our team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Services", href: "/services" },
      { label: "Roadshow & events", href: "/roadshow" },
      { label: "Contact", href: "/contact" },
    ],
  },
] satisfies NavLink[];

export const SETTINGS = {
  currencies: ["AED", "USD", "EUR", "GBP", "INR"] as const,
  units: ["Sqft", "Sqm"] as const,
  rates: { AED: 1, USD: 0.273, EUR: 0.252, GBP: 0.216, INR: 22.6 } as Record<string, number>,
  perSqmFromUnit: (unit: string) => (unit === "Sqft" ? 10.764 : 1),
};