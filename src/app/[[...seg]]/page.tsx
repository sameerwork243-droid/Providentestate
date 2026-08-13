import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { notFound, permanentRedirect } from "next/navigation";
import { getPageData, classify } from "@/lib/ref";
import { developerHubData, developerHits, typeHubData, routeFilters, matchHit, baseListingRel, corpus } from "@/lib/store";
import { dbPropsToHits, dbPropertyByRoute, dbPropertyByRef } from "@/server/property-bridge";
import { dbPageContent, dbTeamBySlug, dbJobBySlug, dbJobs, dbProjects, dbProjectBySlug, dbDevelopersTable, dbCommunitiesTable } from "@/server/content-bridge";
import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";
import { legalModule } from "@/lib/legal-content";
import { HomePage } from "@/components/home";
import { ListingPage } from "@/components/listing";
import { PropertyDetailPage } from "@/components/property-detail";
import { ProjectPages } from "@/components/projects";
import { ContentPages } from "@/components/content-pages";
import { BookViewingPage } from "@/components/book-viewing-page";
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
  const raw = path.join("data", "raw");
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

function dedupeBySlug(list: any[]): any[] {
  const seen = new Set<string>();
  return list.filter((h) => {
    const k = String(h?.slug || "");
    if (!k) return true;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const devSlugKey = (s: any) => String(s || "").toLowerCase().replace(/[^a-z0-9-]+/g, "-");
const typeSlugKey = (s: any) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

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

  if (routeBase === "/book-a-viewing") {
    const q = (x: string | string[] | undefined) => (Array.isArray(x) ? x[0] : x);
    const ref = q(sp?.id) || q(sp?.slug) || q(sp?.property) || null;
    let property: any = null;
    if (ref) {
      const dbp = await dbPropertyByRef(ref);
      if (dbp) property = dbp.data;
      else {
        property =
          [...corpus("buy"), ...corpus("let")].find((h: any) => String(h.crm_id) === ref || String(h.id) === ref) || null;
      }
    }
    return (
      <div className="page-layout">
        <SiteHeader transparent={false} />
        <BookViewingPage property={property} route="/book-a-viewing" />
        <SiteFooter />
      </div>
    );
  }

  const devMatch = route.match(/^\/new-projects\/developed-by-([a-z0-9-]+)\/?$/);
  const typeMatch = route.match(/^\/new-projects\/type-([a-z0-9-]+)\/?$/);
  const hubMatch = devMatch || typeMatch;
  if (hubMatch) {
    const hub = devMatch ? developerHubData(devMatch[1]) : typeHubData(typeMatch![1]);
    const db = await dbProjects();
    if (db.length) {
      const extra = devMatch
        ? db.filter((h) => devSlugKey(h.developer) === devMatch[1])
        : db.filter((h) => (Array.isArray(h.building_type) ? h.building_type : []).some((b: any) => typeSlugKey(b) === typeMatch![1]));
      if (extra.length) {
        hub.hits = dedupeBySlug([...hub.hits, ...extra]);
        hub.nbHits = hub.hits.length;
        hub.nbPages = Math.max(1, Math.ceil(hub.hits.length / (hub.hitsPerPage || 20)));
      }
    }
    if (devMatch) {
      const { rows: devRows } = await dbDevelopersTable();
      if (devRows.length) {
        const dev = devRows.find((d: any) => d.slug === devMatch[1]);
        if (!dev) notFound();
        else if (String(dev.name) !== hub.hits[0]?.developer) hub.hits = hub.hits.map((h: any) => ({ ...h, developer: String(dev.name) }));
      }
    }
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
    const dbp = await dbPropertyByRoute(routeBase);
    if (dbp) model = { kind: "property" as const, data: dbp.data, route: routeBase };
  }
  if (!model && (routeBase === "/buy" || routeBase === "/let" || routeBase.startsWith("/buy/") || routeBase.startsWith("/let/"))) {
    const base = baseListingRel(routeBase);
    if (base) {
      const basePd = getPageData("/" + base);
      if (basePd) model = classify(basePd, "/" + base);
    }
  }
  if (model?.kind === "listing") {
    const area = routeFilters(routeBase).area;
    if (area) {
      const { rows: comRows } = await dbCommunitiesTable();
      if (comRows.length && !comRows.some((c: any) => c.slug === area)) notFound();
    }
  }
  if (!model && /^\/team\/[a-z0-9-]+$/.test(routeBase)) {
    const member = await dbTeamBySlug(routeBase.split("/").filter(Boolean).pop()!);
    if (member) model = { kind: "page", data: member, route: routeBase };
  }
  if (!model && /^\/careers\/[a-z0-9-]+$/.test(routeBase)) {
    const job = await dbJobBySlug(routeBase.split("/").filter(Boolean).pop()!);
    if (job) model = { kind: "page", data: { id: job.id, slug: job.slug, title: job.title, location: job.location, job_details: { data: { job_details: job.job_details } }, page_name: "careers" }, route: routeBase };
  }
  if (!model && /^\/new-projects\/[a-z0-9-]+$/.test(routeBase)) {
    const project = await dbProjectBySlug(routeBase.split("/").filter(Boolean).pop()!);
    if (project) model = { kind: "project", data: { hits: [project], nbHits: 1, page: 0, nbPages: 1, hitsPerPage: 1, content: null }, route: routeBase };
  }
  if (!model) notFound();
  if (model.kind === "listing") {
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
    const seen = new Set<string>();
    const merged: any[] = [];
    const push = (h: any) => {
      const key = h.crm_id ?? h.id ?? h.slug;
      if (key != null) {
        if (seen.has(String(key))) return;
        seen.add(String(key));
      }
      merged.push(h);
    };
    for (const h of corpus(kind)) if (matchHit(h, filters)) push(h);
    for (const h of await dbPropsToHits(kind)) if (matchHit(h, filters)) push(h);
    for (const h of model.data.hits || []) if (matchHit(h, filters)) push(h);
    model.data.hits = merged;
    model.data.nbHits = merged.length;
    model.data.nbPages = Math.max(1, Math.ceil(merged.length / (model.data.hitsPerPage || 20)));
  }

  if (model.kind === "page" && routeBase === "/about") {
    const kv = await dbPageContent();
    if (Array.isArray(model.data?.modules)) {
      for (const mod of model.data.modules) {
        if (mod?.strapi_component === "modules.content-and-stats") {
          if (kv.hero_title) mod.title = kv.hero_title;
          if (kv.intro) mod.description = { data: { description: kv.intro } };
        }
      }
    }
  }

  if (model.kind === "page" && routeBase === "/careers") {
    const jobs = await dbJobs();
    if (jobs.length && Array.isArray(model.data?.modules)) {
      const cm = model.data.modules.find((mod: any) => mod?.strapi_component === "modules.career-listing");
      if (cm) {
        const dbCareers = jobs.map((j: any) => ({ id: j.id, title: j.title, location: j.location, slug: j.slug, job_details: { data: { job_details: j.job_details } } }));
        cm.careers = [...dbCareers, ...(cm.careers || [])];
      }
    }
  }

  if (model.kind === "page" && (routeBase === "/privacy-policy" || routeBase === "/terms-and-conditions")) {
    const mods = Array.isArray(model.data?.modules) ? model.data.modules : [];
    if (!mods.length) {
      const legal = legalModule(routeBase);
      if (legal) model.data.modules = [legal];
    }
  }

  if (model.kind === "project" && Array.isArray(model.data?.hits) && model.data.hits.length > 1) {
    const db = await dbProjects();
    if (db.length) {
      const before = model.data.hits.length;
      model.data.hits = dedupeBySlug([...model.data.hits, ...db]);
      if (model.data.hits.length > before) {
        model.data.nbHits = model.data.hits.length;
        model.data.nbPages = Math.max(1, Math.ceil(model.data.hits.length / (model.data.hitsPerPage || 20)));
      }
    }
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
