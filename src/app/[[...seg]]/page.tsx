import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { getPageData, classify } from "@/lib/ref";
import { developerHubData, developerHits, typeHubData } from "@/lib/store";
import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";
import { HomePage } from "@/components/home";
import { ListingPage } from "@/components/listing";
import { PropertyDetailPage } from "@/components/property-detail";
import { ProjectPages } from "@/components/projects";
import { ContentPages } from "@/components/content-pages";

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

export const dynamicParams = false;

export function generateStaticParams() {
  const routes = new Set(routesFromRaw());
  for (const d of developerHits(200)) routes.add(`/new-projects/developed-by-${d.developer.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`);
  for (const t of ["apartment", "villa", "townhouse", "penthouse", "mansions", "duplex", "studio"]) routes.add(`/new-projects/type-${t}`);
  return [...routes].map((r) => ({
    seg: r === "/" ? [] : r.split("/").filter(Boolean),
  }));
}

const TRANSPARENT_PREFIXES = ["/buy", "/let", "/new-projects"];

export default async function Page({ params }: { params: Promise<{ seg?: string[] }> }) {
  const { seg = [] } = await params;
  const route = "/" + seg.join("/");

  const devMatch = route.match(/^\/new-projects\/developed-by-([a-z0-9-]+)\/?$/);
  const typeMatch = route.match(/^\/new-projects\/type-([a-z0-9-]+)\/?$/);
  const hubMatch = devMatch || typeMatch;
  if (hubMatch) {
    const hub = devMatch ? developerHubData(devMatch[1]) : typeHubData(typeMatch![1]);
    if (!hub.hits.length) notFound();
    return (
      <div className="page-layout">
        <SiteHeader transparent />
        <ProjectPages hub data={hub} route={route} />
        <SiteFooter />
      </div>
    );
  }

  const pd = getPageData(route);
  if (!pd) notFound();
  const model = classify(pd, route);
  if (!model) notFound();

  const transparent = route === "/" || TRANSPARENT_PREFIXES.some((p) => route.startsWith(p));

  let main: React.ReactNode;
  if (route === "/") {
    main = <HomePage page={pd.result?.data?.strapiPage || {}} />;
  } else
    switch (model.kind) {
    case "listing":
      main = <ListingPage data={model.data} route={route} />;
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
