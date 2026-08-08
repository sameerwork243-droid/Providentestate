import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import homeJson from "@/data/home.json";
import { cft } from "./image";

const RAW = path.join("data", "raw");
const cache = new Map<string, any>();

export function loadRel(rel: string): any | null {
  if (cache.has(rel)) return cache.get(rel);
  const file = path.join(RAW, rel);
  if (!existsSync(file)) {
    cache.set(rel, null);
    return null;
  }
  try {
    const content = readFileSync(file, "utf8");
    if (!content.trim()) {
      cache.set(rel, null);
      return null;
    }
    const j = JSON.parse(content);
    cache.set(rel, j);
    return j;
  } catch (e) {
    console.error(`Failed to load ${rel}:`, e);
    cache.set(rel, null);
    return null;
  }
}

export function existsRel(rel: string): boolean {
  return existsSync(path.join(RAW, rel));
}

const CF = "https://d3h330vgpwpjr8.cloudfront.net";

/** Listing page-data for a route (e.g. "/buy/properties-for-sale/in-dubai-marina"). */
export function getListing(route: string): any | null {
  const rel = route.replace(/^\//, "").replace(/\/$/, "");
  const j = loadRel(path.join("listings", rel) + ".json") ?? loadRel(path.join("listings", rel + ".json"));
  if (!j?.result?.serverData?.data) return null;
  const d = j.result.serverData.data;
  return { hits: d.hits || [], nbHits: d.nbHits ?? 0, nbPages: d.nbPages ?? 1, page: d.page ?? 0, hitsPerPage: d.hitsPerPage || 20, content: d.content || null, projects: d.projects || null };
}

/** Property detail (inner data) for a route like "/buy/slugid". */
export function getProperty(route: string): any | null {
  const rel = route.replace(/^\//, "").replace(/\/$/, "");
  const j = loadRel(path.join("properties", rel) + ".json") ?? loadRel(path.join("properties", rel + ".json"));
  const inner = j?.result?.serverData?.data;
  return inner?.status === true && inner?.data?.id ? inner.data : null;
}

/** Convert a property-detail object to a listing-hit shape (cloudfront image keys etc.). */
export function toHit(p: any): any {
  const images = (p.images || []).map((im: any) => {
    const src = im?.url || im?.srcUrl || null;
    return { "340x252": cft(src, 340, 252), "464x312": cft(src, 464, 312), "696x520": cft(src, 696, 520) };
  });
  const first = p.thumbnail?.url || p.images?.[0]?.url || null;
  return {
    ...p,
    images,
    imageCount: images.length,
    display_address: p.display_address || p.address || "",
    crm_negotiator_id: p.crm_negotiator_id || null,
    building: p.building ? (Array.isArray(p.building) ? p.building : [p.building]) : [],
    description: p.introtext || p.description || "",
    floorarea_min: p.floorarea_min ?? p.floorarea_max,
    floorarea_max: p.floorarea_max,
  };
}

/** Parse "/buy/...slug12345" -> { id, file } for the property detail corpus. */
export function propRouteParts(link: string): { id: string; file: string; kind: "buy" | "let" } {
  const clean = link.replace(/^\//, "").replace(/\/$/, "");
  const m = clean.match(/^(.*?)(\d+)$/);
  const id = m ? m[2] : "";
  const slug = m ? m[1] : clean;
  const kind = clean.startsWith("let") ? "let" : "buy";
  const slugBase = slug.startsWith(kind + "/") ? slug.slice(kind.length + 1) : slug;
  return { id, file: `${kind}/${slugBase}${id}.json`, kind };
}

/** Homepage slider / card lookups keyed by full property link. */
export function byLink(link: string): any | null {
  const { file } = propRouteParts(link);
  const j = loadRel(path.join("properties", file));
  const inner = j?.result?.serverData?.data;
  return inner?.status === true && inner?.data?.id ? toHit(inner.data) : null;
}

let corpusCache: Record<string, any[]> = {};
const PROPS_DIR: Record<"buy" | "let", string> = {
  buy: path.join(RAW, "properties", "buy"),
  let: path.join(RAW, "properties", "let"),
};
/** Full converted corpus for a kind (buy|let) — loaded lazily once. */
export function corpus(kind: "buy" | "let"): any[] {
  if (corpusCache[kind]) return corpusCache[kind];
  const dir = PROPS_DIR[kind];
  const out: any[] = [];
  try {
    for (const e of readdirSync(dir)) {
      const full = path.join(dir, e);
      if (!statSync(full).isFile() || !e.endsWith(".json")) continue;
      const j = loadRel(path.join("properties", kind, e));
      const inner = j?.result?.serverData?.data;
      if (inner?.status === true && inner?.data?.id) out.push(toHit(inner.data));
    }
  } catch {}
  corpusCache[kind] = out;
  return out;
}

/** Route constraints from a listing route: kind, type, area, price, bedrooms, size, completion, amenities. */
export function routeFilters(route: string) {
  const segs = route.split("/").filter(Boolean);
  const f: { rent: boolean; type: string | null; area: string | null; priceMin: number | null; priceMax: number | null; bedsMin: number | null; bedsMax: number | null; sizeMin: number | null; sizeMax: number | null; completion: string | null; furnished: boolean; amenities: string[] } = {
    rent: segs[0] === "let",
    type: null,
    area: null,
    priceMin: null,
    priceMax: null,
    bedsMin: null,
    bedsMax: null,
    sizeMin: null,
    sizeMax: null,
    completion: null,
    furnished: false,
    amenities: [],
  };
  for (const s of segs) {
    if (s.startsWith("in-")) f.area = s.slice(3);
    else if (/^above-\d+$/.test(s)) f.priceMin = parseInt(s.slice(6), 10);
    else if (/^under-(\d+)$/.test(s)) f.priceMax = parseInt(s.match(/^under-(\d+)$/)![1], 10);
    else if (/^under-(\d+)-bedrooms$/.test(s)) {
      const m = s.match(/^under-(\d+)-bedrooms$/);
      if (m) f.bedsMax = +m[1];
    } else if (/^with-(\d+)-to-(\d+)-bedrooms$/.test(s)) {
      const m = s.match(/^with-(\d+)-to-(\d+)-bedrooms$/);
      if (m) { f.bedsMin = +m[1]; f.bedsMax = +m[2]; }
    } else if (/^with-size-under-(\d+)$/.test(s)) {
      const m = s.match(/^with-size-under-(\d+)$/);
      if (m) f.sizeMax = +m[1];
    } else if (/^with-size-(\d+)-to-(\d+)$/.test(s)) {
      const m = s.match(/^with-size-(\d+)-to-(\d+)$/);
      if (m) { f.sizeMin = +m[1]; f.sizeMax = +m[2]; }
    } else if (/^with-size-above-(\d+)$/.test(s)) {
      const m = s.match(/^with-size-above-(\d+)$/);
      if (m) f.sizeMin = +m[1];
    } else if (s === "furnished") f.furnished = true;
    else if (s.startsWith("completion-")) f.completion = s.slice(11);
    else if (s.startsWith("with-amenities-")) f.amenities.push(s.slice(15));
    else if (/-for-sale$/.test(s)) f.type = s.replace(/-for-sale$/, "");
    else if (/-for-rent$/.test(s)) f.type = s.replace(/-for-rent$/, "");
  }
  return f;
}

export function matchHit(h: any, f: ReturnType<typeof routeFilters>): boolean {
  if (f.type && f.type !== "properties") {
    const ft = f.type.toLowerCase();
    if (
      h.department?.toLowerCase() !== ft &&
      !(h.building_type || "").toLowerCase().includes(ft) &&
      !(h.building || []).some((b: any) => String(b).toLowerCase().includes(ft))
    ) {
      if (!(ft === "commercial-properties" || ft === "whole-building" || ft === "plots" || ft === "short-term")) return false;
    }
  }
  if (f.area) {
    const hay = [h.address_full?.area, h.address_full?.address3, h.address_full?.address4, h.display_address].filter(Boolean).join(" ").toLowerCase().replace(/[^a-z0-9]+/g, " ");
    if (!hay.includes(f.area.toLowerCase().replace(/[^a-z0-9]+/g, " "))) return false;
  }
  if (f.priceMin != null && (h.price ?? 0) < f.priceMin) return false;
  if (f.priceMax != null && (h.price ?? 0) > f.priceMax) return false;
  if (f.bedsMin != null && (h.bedroom ?? 0) < f.bedsMin) return false;
  if (f.bedsMax != null && (h.bedroom ?? 0) > f.bedsMax) return false;
  if (f.sizeMin != null || f.sizeMax != null) {
    const sz = h.floorarea_min ?? h.floorarea_max ?? 0;
    if (f.sizeMin != null && sz < f.sizeMin) return false;
    if (f.sizeMax != null && sz > f.sizeMax) return false;
  }
  if (f.amenities.length) {
    const amens = [...(h.accommodation_summary || []), ...(h.amenities || [])].map((x: any) => String(x).toLowerCase());
    for (const a of f.amenities) {
      const want = a.replace(/-/g, " ");
      if (!amens.some((x) => x.includes(want))) return false;
    }
  }
  return true;
}

/** Nearest existing listing page-data file for a route, walking up filter/area segments. */
export function baseListingRel(route: string): string | null {
  let rel = route.replace(/^\//, "").replace(/\/page\/\d+$/, "").replace(/\/+$/, "");
  const parts = rel.split("/").filter(Boolean);
  while (parts.length) {
    const candidate = parts.join("/");
    if (candidate === "buy" || candidate === "let") {
      return candidate === "buy" ? "buy/properties-for-sale" : "let/properties-for-rent";
    }
    if (loadRel(path.join("listings", candidate) + ".json")) return candidate;
    parts.pop();
  }
  return null;
}

/** Synthesize a page of hits for routes we did not scrape (page > 1). */
export function synthHits(route: string, page: number, perPage = 20): any[] {
  const f = routeFilters(route);
  const src = corpus(f.rent ? "let" : "buy");
  const filtered = src.filter((h) => matchHit(h, f)).sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  const start = (page - 1) * perPage;
  return filtered.slice(start, start + perPage);
}

export function areaLabel(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Unique community list from the extracted homepage (label + slug). */
export const communities: { label: string; slug: string }[] = (() => {
  const seen = new Set<string>();
  const out: { label: string; slug: string }[] = [];
  for (const c of homeJson.communities as any[]) {
    const m = c.href.match(/in-([^/]+)\/$/);
    if (!m || seen.has(m[1])) continue;
    seen.add(m[1]);
    out.push({ label: c.label, slug: m[1] });
  }
  return out;
})();

export const areas: string[] = communities.map((c) => c.label);

/** First-page area-guide slugs in the exact reference order (page 1 of /area-guides). */
const AREA_GUIDE_PAGE1 = [
  "downtown-dubai",
  "palm-jumeirah",
  "dubai-marina",
  "business-bay",
  "emaar-beachfront",
  "bluewater-island-dubai",
  "jumeirah-lake-towers",
  "dubai-creek-harbour",
  "sobha-hartland",
  "dubai-hills-estate",
  "jumeirah-beach-residence",
  "jumeirah-village-circle",
  "dubai-south",
  "dubai-sports-city",
  "difc",
  "emaar-south",
  "jumeirah-bay-island",
  "damac-hills",
  "sobha-siniya-island",
  "al-marjan-island",
  "palm-jebel-ali",
  "dubai-islands",
  "jumeirah-golf-estates",
  "mina-al-arab",
];

/** All area guides as listing cards (page-1 areas first, rest alphabetical after). */
export function areaGuidesData(): any[] {
  const dir = path.join(RAW, "pages", "area-guides");
  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  } catch {
    files = [];
  }
  const rank = new Map(AREA_GUIDE_PAGE1.map((s, i) => [s, i]));
  const out: any[] = [];
  for (const f of files) {
    const slug = f.replace(/\.json$/, "");
    const j = loadRel(path.join("pages", "area-guides", f));
    const a = j?.result?.data?.strapiAreaGuide;
    if (!a?.title) continue;
    const img = a.tile_image?.url || a.banner_image?.url;
    out.push({
      slug: a.slug || slug,
      title: a.title,
      image: cft(img, 340, 212),
      image304: cft(img, 304, 300),
      desc: a.description?.data?.description || "",
      amenities: Array.isArray(a.amenities?.strapi_json_value) ? a.amenities.strapi_json_value : [],
      page1: rank.has(slug) ? rank.get(slug) : -1,
    });
  }
  out.sort(
    (a, b) =>
      (a.page1 === -1 ? 1e3 : a.page1) - (b.page1 === -1 ? 1e3 : b.page1) || a.title.localeCompare(b.title)
  );
  return out;
}

export const developers: string[] = [...new Set((homeJson.developers as string[]).filter((d) => d !== "icon"))];

/** Featured slider ids from the extracted homepage. */
export const featuredIds: string[] = (homeJson.featuredSliders[0]?.links || []).filter((l: string) => !l.endsWith("/properties-for-sale"));
export const signatureIds: string[] = (homeJson.featuredSliders[1]?.links || []).filter((l: string) => !l.endsWith("/properties-for-sale"));

/** Homepage developer slider: exact order, hub slugs, display names and CDN logo files from the reference. */
export const devLogos: { slug: string; name: string; file: string }[] = [
  { slug: "damac-properties", name: "Damac Properties", file: "Damac_c63829f7d0.webp" },
  { slug: "emaar-properties", name: "Emaar Properties", file: "Emaar_f229e25788.webp" },
  { slug: "meraas", name: "Meraas", file: "Meraas_logo_58aa6236ab.webp" },
  { slug: "sobha-realty", name: "Sobha Realty", file: "logo_01_4fd8dc607d.webp" },
  { slug: "nakheel", name: "Nakheel", file: "logo_02_1_666ef04015.webp" },
  { slug: "binghatti", name: "Binghatti", file: "binghatti_7c9b5b6084.webp" },
  { slug: "select-group", name: "Select Group", file: "Select_Group_be8d857695.webp" },
  { slug: "city-view-developments", name: "City View Developments", file: "city_view_logo_cd13ea3726.webp" },
  { slug: "ellington-properties", name: "Ellington Properties", file: "Ellington_58133c54d4.webp" },
  { slug: "majid-al-futtaim", name: "Majid Al Futtaim", file: "Majid_Al_Futtaim_b3d70262eb.webp" },
];

/** Latest blog posts (title, slug, date, image, category) from the saved blog corpus. */
export function blogPosts(limit = 4): any[] {
  const dir = path.join(RAW, "pages", "blog");
  const posts: any[] = [];
  try {
    for (const e of readdirSync(dir)) {
      if (!e.endsWith(".json")) continue;
      try {
        const j = loadRel(path.join("pages", "blog", e));
        const b = j?.result?.data?.strapiBlog;
        if (!b) continue;
        posts.push({
          slug: b.slug || "",
          title: b.title || "",
          date: b.date || "",
          category: Array.isArray(b.category?.strapi_json_value) ? b.category.strapi_json_value.join(", ") : b.category || "",
          image: b.tile_image?.url || b.banner_image?.url || null,
          description: b.short_description || "",
        });
      } catch (e) {
        console.error(`Failed to load blog post ${e}:`, e);
      }
    }
  } catch {}
  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return posts.slice(0, limit);
}

export function rentals(): any[] {
  const l = getListing("/let/properties-for-rent");
  return l?.hits || [];
}

export function salesHits(): any[] {
  const l = getListing("/buy/properties-for-sale");
  return l?.hits || [];
}

/** Team member summaries (name, slug, designation, image) from the saved team corpus. */
export function teamMembers(limit = 100): any[] {
  const dir = path.join(RAW, "pages", "team");
  const out: any[] = [];
  try {
    for (const e of readdirSync(dir)) {
      if (!e.endsWith(".json")) continue;
      const j = loadRel(path.join("pages", "team", e));
      const t = j?.result?.data?.strapiTeam;
      if (!t) continue;
      out.push({
        slug: t.slug,
        name: t.name,
        designation: t.designation,
        image: t.extra?.profile_image || t.image?.url || null,
        phone: t.phone || t.office_phone || "",
        email: t.email || "",
      });
    }
  } catch {}
  return out.slice(0, limit);
}

/** Developer names present in the project corpus (for the developers listing page). */
export function developerHits(limit = 40): any[] {
  const dir = path.join(RAW, "projects");
  const seen = new Map<string, number>();
  try {
    for (const e of readdirSync(dir)) {
      if (!statSync(path.join(dir, e)).isDirectory()) continue;
      for (const f of readdirSync(path.join(dir, e))) {
        if (!f.endsWith(".json")) continue;
        const j = loadRel(path.join("projects", e, f));
        const d = j?.result?.serverData?.data;
        for (const h of d?.hits || []) {
          if (h.developer) seen.set(h.developer, (seen.get(h.developer) || 0) + 1);
        }
        if (seen.size >= limit) return [...seen.entries()].map(([developer, count]) => ({ developer, count }));
      }
    }
  } catch {}
  return [...seen.entries()].map(([developer, count]) => ({ developer, count })).slice(0, limit);
}

/** Developer corpus (slug, name, logo, description, background) from the saved developers list. */
export function developersList(): any[] {
  const j = loadRel("developers.json");
  const list = j && Array.isArray(j) ? j : [];
  return list.map((d: any) => ({
    slug: d.slug || "",
    name: d.name || "",
    logo: d.logo ? `https://d3h330vgpwpjr8.cloudfront.net/x/296x/${d.logo}` : "https://d3h330vgpwpjr8.cloudfront.net/x/296x/placeholder.jpg",
    background: "https://d3h330vgpwpjr8.cloudfront.net/x/600x400/developer-bg-placeholder.jpg", // Placeholder background
    description: d.description || "",
  }));
}

/** A few project hits (off-plan slider). */
export function projectHits(limit = 6): any[] {
  const dir = path.join(RAW, "projects");
  const out: any[] = [];
  try {
    for (const e of readdirSync(dir)) {
      if (!statSync(path.join(dir, e)).isDirectory()) continue;
      for (const f of readdirSync(path.join(dir, e))) {
        if (!f.endsWith(".json")) continue;
        const j = loadRel(path.join("projects", e, f));
        const d = j?.result?.serverData?.data;
        if (d?.hits?.length) {
          out.push(...d.hits.filter((h: any) => h.publish !== false));
          if (out.length >= limit) return out.slice(0, limit);
        }
      }
    }
  } catch {}
  return out.slice(0, limit);
}

/** Project hit by slug (detail files live flat in `projects/new-projects/`). */
export function projectBySlug(slug: string): any | null {
  const j = loadRel(path.join("projects", "new-projects", slug + ".json"));
  const d = j?.result?.serverData?.data;
  return d?.hits?.[0] || null;
}

let projCorpusCache: any[] | null = null;
/** Lazy full project-hit corpus (1399 detail files, parsed once). */
export function projectCorpus(): any[] {
  if (projCorpusCache) return projCorpusCache;
  const out: any[] = [];
  try {
    for (const f of readdirSync(path.join(RAW, "projects", "new-projects"))) {
      if (!f.endsWith(".json")) continue;
      const j = loadRel(path.join("projects", "new-projects", f));
      const d = j?.result?.serverData?.data;
      if (d?.hits?.length) out.push(...d.hits.filter((h: any) => h.publish !== false));
    }
  } catch {}
  projCorpusCache = out;
  return out;
}

/** Project hits whose community / address matches an area (label or slug). */
export function projectsByArea(area: string): any[] {
  const key = area.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return projectCorpus().filter((h) => {
    const hay = [h.community, h.display_address, ...(h.search_areas || [])].filter(Boolean).join(" ").toLowerCase();
    return hay.includes(key) || hay.includes(area.toLowerCase());
  });
}

/** Project hits for a developer slug (e.g. "deniz-properties"). */
export function projectsByDeveloper(dev: string): any[] {
  const key = dev.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  return projectCorpus().filter((h) => (h.developer || "").toLowerCase().replace(/[^a-z0-9-]+/g, "-") === key);
}

/** Synthetic hub envelope (same shape as a scraped project-hub file) for developer-filtered routes. */
export function developerHubData(dev: string): any {
  const hits = projectsByDeveloper(dev);
  return {
    hits,
    nbHits: hits.length,
    page: 0,
    nbPages: 1,
    hitsPerPage: hits.length || 1,
    content: { title: `Projects by ${dev.replace(/-/g, " ")}` },
  };
}

/** Project hits whose building types include the given type slug (e.g. "apartment"). */
export function projectsByType(t: string): any[] {
  const key = t.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return projectCorpus().filter((h) =>
    (Array.isArray(h.building_type) ? h.building_type : h.building_type ? [h.building_type] : []).some(
      (b: any) => String(b || "").toLowerCase().replace(/[^a-z0-9]+/g, "") === key
    )
  );
}

/** Synthetic hub envelope for type-filtered routes (`/new-projects/type-apartment/`). */
export function typeHubData(t: string): any {
  const hits = projectsByType(t);
  return {
    hits,
    nbHits: hits.length,
    page: 0,
    nbPages: 1,
    hitsPerPage: hits.length || 1,
    content: { title: `Off-Plan ${t[0]?.toUpperCase() || ""}${t.slice(1).replace(/-/g, " ")} Projects in Dubai` },
  };
}

export { cft, cfw } from "./image";
