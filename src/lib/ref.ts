import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const RAW = path.join("data", "raw");

function load(rel: string) {
  const file = path.join(RAW, rel);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as any;
  } catch {
    return null;
  }
}

/** Load page-data for a route. Returns raw Gatsby page-data JSON or null. */
export function getPageData(route: string): any {
  const rel = route === "/" ? "index" : route.replace(/^\//, "").replace(/\/$/, "");
  const candidates = [
    path.join("pages", rel + ".json"),
    path.join("listings", rel + ".json"),
    path.join("listings", rel) + ".json",
    path.join("projects", rel + ".json"),
    path.join("projects", rel) + ".json",
    path.join("properties", rel + ".json"),
    path.join("properties", rel) + ".json",
  ];
  for (const c of candidates) {
    const j = load(c);
    if (j) return j;
  }
  return null;
}

export interface PageModel {
  kind: "page" | "listing" | "property" | "project";
  data: any;
  route: string;
}

/** Classify a page-data payload by template. */
export function classify(j: any, route: string): PageModel | null {
  if (!j?.result) return null;
  const res = j.result;
  const data = res.data ?? {};
  const keys = Object.keys(data);
  if (res.serverData && typeof res.serverData === "object") {
    const sd = res.serverData as any;
    const inner = sd.data ?? sd;
    if (inner && typeof inner === "object" && inner.status === true && "hits" in inner) {
      const kind = (inner.hits?.[0]?.building_type || inner.hits?.[0]?.search_type) ? "project" : "listing";
      return { kind: inner.hits?.[0]?.slug?.startsWith?.("") ? (route.startsWith("/new-projects") ? "project" : "listing") : kind, data: inner, route };
    }
    if (inner && inner.status === true && inner.data && inner.message) {
      const isProject = inner.data?.department === "new_developments" || (typeof inner.data?.building_type === "string" && inner.data?.completion_year != null);
      if (isProject) return { kind: "project", data: { hits: [inner.data] }, route };
      return { kind: "property", data: inner.data, route };
    }
  }
  if (keys.includes("strapiPage")) return { kind: "page", data: data.strapiPage, route };
  if (keys.includes("strapiBlog")) return { kind: "page", data: data.strapiBlog, route };
  if (keys.includes("strapiTeam")) return { kind: "page", data: data.strapiTeam, route };
  if (keys.includes("strapiAreaGuide")) return { kind: "page", data: data.strapiAreaGuide, route };
  if (keys.includes("strapiCareer")) return { kind: "page", data: data.strapiCareer, route };
  if (keys.includes("strapiEvent")) return { kind: "page", data: data.strapiEvent, route };
  if (keys.includes("strapiDeveloper")) return { kind: "page", data: data.strapiDeveloper, route };
  return null;
}

/** Image URL helper matching the reference cloudfront pattern. */
export function cf(url: string | null | undefined, width = 340): string | null {
  if (!url) return null;
  if (url.startsWith("http") && url.includes("d3h330vgpwpjr8.cloudfront.net/x/")) return url;
  if (url.startsWith("http")) return url;
  return url;
}

export function priceFmt(n: number | null | undefined): string {
  if (n == null) return "";
  return "AED " + n.toLocaleString("en-US");
}

export function fmtDate(s: string | null | undefined): string {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
