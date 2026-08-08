import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { notFound, permanentRedirect } from "next/navigation";
import { getPageData, classify } from "@/lib/ref";
import { developerHubData, developerHits, typeHubData, routeFilters, matchHit } from "@/lib/store";
import { dbPropsToHits, dbPropertyByRoute } from "@/server/property-bridge";
import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";
import { HomePage } from "@/components/home";
import { ListingPage } from "@/components/listing";
import { PropertyDetailPage } from "@/components/property-detail";
import { ProjectPages } from "@/components/projects";
import { ContentPages } from "@/components/content-pages";
import { SitemapPage } from "@/components/sitemap";

function walk(dir: string, base: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const full = path.join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full, base));
    else if (e.endsWith(".json")) {
      const rel = path.relative(base, full).replace(/\.json$/, "");
      out.push("/" + rel.split(path.sep).join("/"));
    }
  }
  return out;
}

function routesFromRaw() {
  const raw = path.join(process.cwd(), "data", "raw");
  const routes = new Set<string>();
  for (const sub of ["pages", "listings", "projects", "properties"]) {
    const dir = path.join(raw, sub);
    try {
      for (const r of walk(dir, dir)) {
        if (r === "/index") routes.add("/");
        else routes.add(r);
      }
    } catch {}
  }
  return [...routes];
}

export const dynamicParams = true;
export const revalidate = 0;

const ALIASES: Record<string, string> = {
  "/buy": "/buy/properties-for-sale",
  "/let": "/let/properties-for-rent",
};

function allStaticRoutes() {
  const routes = new Set(routesFromRaw());
  for (const d of developerHits(200)) routes.add(`/new-projects/developed-by-${d.developer.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`);
  for (const t of ["apartment", "villa", "townhouse", "penthouse", "mansions", "duplex", "studio"]) routes.add(`/new-projects/type-${t}`);
  for (const r of paginatedRoutes()) routes.add(r);
  return routes;
}

function paginatedRoutes() {
  const out: string[] = [];
  for (const r of routesFromRaw()) {
    if (!r.startsWith("/buy") && !r.startsWith("/let")) continue;
    const pd = getPageData(r);
    const nb: number | undefined = pd?.result?.serverData?.data?.nbHits;
    const pages = Math.ceil((nb ?? 0) / 20);
    if (pages > 1) for (let p = 2; p <= pages; p++) out.push(`${r}/page/${p}`);
  }
  return out;
}

export function generateStaticParams() {
  const routes = allStaticRoutes();
  for (const a of Object.keys(ALIASES)) routes.add(a);
  return [...routes].map((r) => ({
    seg: r === "/" ? [] : r.split("/").filter(Boolean),
  }));
}

export default async function Page({ params, searchParams }: { params: Promise<{ seg?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { seg = [] } = await params;
  const sp = await searchParams;
  const route = "/" + seg.join("/");

  const pageMatch = route.match(/^(.*?)\/page\/(\d+)\/?$/);
  const routeBase = pageMatch ? pageMatch[1] : route;
  const pageNum = pageMatch ? parseInt(pageMatch[2], 10) : 1;

  const alias = ALIASES[route];
  if (alias) permanentRedirect(alias);

  if (route === "/sitemap") {
    return (
      <div className="page-layout">
        <SiteHeader transparent />
        <SitemapPage routes={[...allStaticRoutes()]} />
        <SiteFooter />
      </div>
    );
  }

  const devMatch = route.match(/^\/new-projects\/developed-by-([a-z0-9-]+)\/?$/);
  const typeMatch = route.match(/^\/new-projects\/type-([a-z0-9-]+)\/?$/);
  const hubMatch = devMatch || typeMatch;
  if (hubMatch) {
    const hub = devMatch ? developerHubData(devMatch[1]) : typeHubData(typeMatch![1]);
    if (!hub.hits.length) notFound();
    return (
      <div className="page-layout">
        <SiteHeader transparent={false} />
        <ProjectPages hub data={hub} route={route} />
        <SiteFooter />
      </div>
    );
  }

  const pd = getPageData(routeBase);
  let model = pd ? classify(pd, routeBase) : null;

  if (!model) {
    const dbp = dbPropertyByRoute(routeBase);
    if (dbp) model = { kind: "property" as const, data: dbp.data, route: routeBase };
  }
  if (!model) notFound();
  if (model.kind === "listing" && pageNum === 1) {
    const kind = route.startsWith("/let") ? "let" : "buy";
    const filters = routeFilters(route);
    const q = (x: string | string[] | undefined) => (Array.isArray(x) ? x[0] : x);
    const n = (v: string | undefined) => (v && !isNaN(Number(v)) ? parseInt(v, 10) : null);
    const f = sp ? {
      minBedroom: q(sp.minBedroom),
      maxBedroom: q(sp.maxBedroom),
      minPrice: q(sp.minPrice),
      maxPrice: q(sp.maxPrice),
      areas: q(sp.areas),
    } : {};
    if (f.minBedroom != null && filters.bedsMin == null) filters.bedsMin = n(f.minBedroom);
    if (f.maxBedroom != null && filters.bedsMax == null) filters.bedsMax = n(f.maxBedroom);
    if (f.minPrice != null && filters.priceMin == null) filters.priceMin = n(f.minPrice);
    if (f.maxPrice != null && filters.priceMax == null) filters.priceMax = n(f.maxPrice);
    if (f.areas && filters.area == null) filters.area = f.areas.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const dbHits = dbPropsToHits(kind);
    const merged = [...dbHits.filter((h) => matchHit(h, filters)), ...(model.data.hits || [])].filter((h) => matchHit(h, filters));
    model.data.hits = merged;
    model.data.nbHits = (model.data.nbHits ?? merged.length) + dbHits.length;
    model.data.nbPages = Math.max(1, Math.ceil((model.data.nbHits ?? 1) / (model.data.hitsPerPage || 20)));
  }

  const transparent = route === "/" || (route.startsWith("/new-projects/") && route !== "/new-projects/");

  let main: React.ReactNode;
  if (route === "/") {
    main = <HomePage page={pd.result?.data?.strapiPage || {}} />;
  } else
    switch (model.kind) {
    case "listing":
      main = <ListingPage data={model.data} route={route} page={pageNum} />;
      break;
    case "property":
      main = <PropertyDetailPage data={model.data} route={route} />;
      break;
    case "page":
      if ((model.data as any).strapi_component?.startsWith?.("modules.")) main = <ProjectPages data={model.data} route={route} />;
      else if (isProjectHub(pd)) main = <ProjectPages hub data={pd.result?.serverData?.data ?? model.data} route={route} />;
      else main = <ContentPages model={model} />;
      break;
    case "project":
      main = <ProjectPages data={model.data} route={route} />;
      break;
    default:
      main = <ContentPages model={model} />;
  }

  const cls =
    route === "/"
      ? "home_page page-layout home_page-layout"
      : model.kind === "listing"
        ? "search-results-page page-layout search-results-layout"
        : model.kind === "property"
          ? "property-detail-page page-layout property-detail-layout"
          : model.kind === "page" && (model.data as any)?.page_class
            ? `${(model.data as any).page_class} page-layout ${(model.data as any).layout || "landing_page"}-layout`
            : "page-layout";

  return (
    <div className={cls}>
      <SiteHeader transparent={transparent} />
      {main}
      <SiteFooter />
    </div>
  );
}

function isProjectHub(pd: any): boolean {
  const d = pd.result?.serverData?.data;
  return !!(d && Array.isArray(d.hits) && (d.hits[0]?.building_type || d.hits[0]?.min_bedrooms != null));
}
