export type Transaction = "buy" | "rent" | "offplan";

export type PropertyType =
  | "apartment"
  | "villa"
  | "townhouse"
  | "penthouse"
  | "office"
  | "retail";

export interface Property {
  id: number;
  slug: string;
  title: string;
  transaction: Transaction[];
  type: PropertyType;
  area: string;
  price: number;
  pricePerYear?: number;
  beds: number;
  baths: number;
  sqm: number;
  thumb: string;
  gallery: string[];
  coordinates: { lat: number; lng: number };
  description: string;
  amenities: string[];
  maplink: string;
  timeout?: boolean;
  dateAdded: string;
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  developer: string;
  type: PropertyType[];
  status: "ready" | "under-construction" | "launching" | "completed";
  handover: string;
  minPrice: number;
  fromSqm: number;
  beds: string;
  area: string;
  thumb: string;
  gallery: string[];
  maplink: string;
  description: string;
  plans: string[];
  paymentPlan: { title: string; value: string }[];
  amenities: string[];
}

export interface Area {
  id: number;
  slug: string;
  name: string;
  region: string;
  avgPriceApartment: number;
  avgPriceVilla: number;
  yield: number;
  img: string;
  description: string;
  highlights: string[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  img: string;
  excerpt: string;
  body: string[];
  related: string[];
}

export interface TeamMember {
  id: number;
  slug: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  languages: string[];
  specialties: string[];
  type: "agent" | "advisory" | "leadership";
  img: string;
  bio: string;
}

export interface Developer {
  id: number;
  slug: string;
  name: string;
  region: string;
  founded: number;
  deliveries: number;
  img: string;
  description: string;
  projects: string[];
}

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string; note?: string }[];
}

export interface ToastMsg {
  id: number;
  title: string;
  body?: string;
}