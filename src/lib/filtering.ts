import { AREAS } from "./data";
import { PROPERTIES } from "./data";
import type { Property } from "./types";

export const PER_PAGE = 9;

export type FilterState = {
  qtype: string;
  area: string;
  beds: string;
  price: string;
  sort: string;
};

export const TYPE_MAP: Record<string, string> = {
  apartments: "apartment",
  villas: "villa",
  townhouses: "townhouse",
  penthouses: "penthouse",
  offices: "office",
  retail: "retail",
};

export function parseSegments(seg: string[]) {
  const f: FilterState = { qtype: "", area: "", beds: "", price: "", sort: "newest" };
  for (const s of seg) {
    if (s.startsWith("in-")) f.area = s.slice(3);
    else if (s.endsWith("-for-sale")) f.qtype = TYPE_MAP[s.replace("-for-sale", "")] ?? s;
    else if (s.endsWith("-for-rent")) f.qtype = TYPE_MAP[s.replace("-for-rent", "")] ?? s;
  }
  return f;
}

export function filterProperties(f: FilterState, rent: boolean) {
  return PROPERTIES.filter((p) => {
    const matchTx = rent ? p.transaction.includes("rent") : p.transaction.includes("buy");
    if (!matchTx) return false;
    if (f.qtype && p.type !== f.qtype) return false;
    if (f.area) {
      const a = AREAS.find((x) => x.slug === f.area);
      if (a && !p.area.includes(a.name)) return false;
    }
    if (f.beds) {
      const min = parseInt(f.beds, 10);
      if (min && p.beds < min) return false;
    }
    if (f.price) {
      const limit = parseInt(f.price, 10);
      const actual = rent ? p.pricePerYear ?? 0 : p.price;
      if (actual > limit) return false;
    }
    return true;
  });
}

export function sortProps(list: Property[], sort: string) {
  const arr = [...list];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "beds":
      return arr.sort((a, b) => b.beds - a.beds);
    default:
      return arr.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  }
}