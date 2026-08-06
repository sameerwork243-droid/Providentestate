/**
 * Scrape the reference site's Gatsby page-data JSONs for the rebuild.
 * Usage: node scripts/scrape-ref.mjs <outDir>
 */
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] || path.join(process.cwd(), "data", "raw");
const TMP = process.env.TEMP || ".";
const CONCURRENCY = 8;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

fs.mkdirSync(path.join(OUT, "pages"), { recursive: true });
fs.mkdirSync(path.join(OUT, "listings"), { recursive: true });
fs.mkdirSync(path.join(OUT, "projects"), { recursive: true });
fs.mkdirSync(path.join(OUT, "properties"), { recursive: true });
fs.mkdirSync(path.join(OUT, "html"), { recursive: true });

function readList(file) {
  try {
    return fs
      .readFileSync(path.join(TMP, file), "utf8")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((u) => new URL(u).pathname.replace(/\/$/, ""));
  } catch {
    return [];
  }
}

const pages = readList("ps-sitemap-pages.txt");
const offplans = readList("ps-offplans.txt");
const props = readList("ps-properties.txt"); // listing combos
const propDetails = readList("ps-property_sitemap.txt"); // property detail URLs

const projectDetails = [
  ...new Set([
    ...pages.filter((p) => /^\/new-projects\/[^/]+$/.test(p)),
    ...offplans.filter((p) => /^\/new-projects\/[^/]+$/.test(p) && !/^(in-|type-)/.test(p.split("/").pop())),
  ]),
];
console.log("project details:", projectDetails.length);

// page-data path for a route: strip leading slash, append page-data.json
const pdUrl = (route) =>
  "https://providentestate.com/page-data" + (route === "/" ? "/index" : route) + "/page-data.json";
const base = (route) =>
  route === "/" ? "/" : route + "/";

// Which page-data files to fetch
const coreListings = [
  "/buy/properties-for-sale", "/buy/apartment-for-sale", "/buy/villa-for-sale",
  "/buy/townhouse-for-sale", "/buy/penthouse-for-sale", "/buy/commercial-properties-for-sale",
  "/buy/short-term-for-sale", "/buy/duplex-for-sale", "/buy/whole-building-for-sale",
  "/buy/plots-for-sale",
  "/let/properties-for-rent", "/let/apartment-for-rent", "/let/villa-for-rent",
  "/let/townhouse-for-rent", "/let/penthouse-for-rent", "/let/commercial-properties-for-rent",
  "/let/short-term-for-rent", "/let/duplex-for-rent", "/let/whole-building-for-rent",
  "/buy/properties-for-sale/above-20000000",
  // top communities (from homepage chips)
  "/buy/properties-for-sale/in-dubai-marina", "/buy/properties-for-sale/in-downtown-dubai",
  "/buy/properties-for-sale/in-jumeirah-beach-residence", "/buy/properties-for-sale/in-sobha-hartland-mohammed-bin-rashid-city",
  "/buy/properties-for-sale/in-palm-jumeirah", "/buy/properties-for-sale/in-dubai-hills-estate",
  "/buy/properties-for-sale/in-damac-lagoons", "/buy/properties-for-sale/in-the-springs",
  "/buy/properties-for-sale/in-dubai-creek-harbour-the-lagoons", "/buy/properties-for-sale/in-emaar-beachfront-dubai-harbour",
  "/buy/properties-for-sale/in-damac-hills", "/buy/properties-for-sale/in-jumeirah-village-triangle",
  "/buy/properties-for-sale/in-jumeirah-village-circle", "/buy/properties-for-sale/in-jumeirah-golf-estates",
  "/buy/properties-for-sale/in-jumeirah", "/buy/properties-for-sale/in-al-habtoor-city-business-bay",
  "/buy/properties-for-sale/in-al-habtoor-polo-resort-club-the-residences",
  "/let/properties-for-rent/in-downtown-dubai",
];

// Files to scrape: (route, subdir)
const jobs = [];
for (const p of pages) {
  if (/^\/buy\//.test(p) || /^\/let\//.test(p) || /^\/new-projects\//.test(p)) continue;
  if (p.startsWith("/team/") && p.endsWith("/contact")) continue;
  jobs.push([p, "pages"]);
}
for (const l of coreListings) jobs.push([l, "listings"]);
for (const p of projectDetails) jobs.push([p, "projects"]);
for (const p of propDetails) jobs.push([p, "properties"]);
console.log("total page-data jobs:", jobs.length);

// HTML snapshots for template reference
const htmlSnaps = [
  "/buy/properties-for-sale", "/buy/apartment-for-sale/in-dubai-marina",
  "/let/properties-for-rent", "/buy/properties-for-sale/above-20000000",
  propDetails[0] || "/buy/4-bedroom-villa-for-sale-in-al-habtoor-polo-resort-club-the-residences-dubai-land-dubai31311",
  projectDetails[0] || "/new-projects/tilal-binghatti-binghatti-dubailand",
  "/new-projects/", "/developers/", "/area-guides/dubai-marina", "/blog/",
  "/blog/how-to-sell-property-in-dubai-guide", "/team/loai-al-fakir", "/team/",
  "/property-services/", "/property-services/mortgages", "/about/", "/careers/",
  "/careers/property-consultant", "/contact/", "/contact/general-enquiry",
  "/roadshow/", "/roadshow/dubai-property-roadshow-in-monte-carlo",
  "/sell/", "/sell/sell-your-property", "/off-plan/", "/list-your-property",
  "/book-a-viewing", "/area-guides/", "/real-estate-guides/", "/signature/",
  "/branded-residences-in-dubai", "/open-houses", "/about/reviews/",
];

// queue with concurrency
let done = 0;
const failures = [];
async function worker(queue) {
  while (queue.length) {
    const [route, sub] = queue.shift();
    const rel = (route === "/" ? "index" : route.slice(1)).replace(/\/$/, "");
    const file = path.join(OUT, sub, rel + ".json");
    if (fs.existsSync(file)) {
      done++;
      continue;
    }
    try {
      const r = await fetch(pdUrl(route), {
        headers: { "user-agent": UA, accept: "application/json" },
        signal: AbortSignal.timeout(30000),
      });
      if (r.status !== 200) {
        failures.push([route, r.status]);
        continue;
      }
      const t = await r.text();
      if (!t.trim().startsWith("{")) {
        failures.push([route, "not-json"]);
        continue;
      }
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, t);
    } catch (e) {
      failures.push([route, "err:" + e.message.slice(0, 60)]);
    }
    done++;
    if (done % 200 === 0) console.log("progress:", done, "/", jobs.length, "fails:", failures.length);
  }
}

const queue = [...jobs];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

// HTML snapshots (concurrency 3)
let hd = 0;
async function snapWorker(snaps) {
  while (snaps.length) {
    const route = snaps.shift();
    const rel = (route === "/" ? "index" : route.slice(1)).replace(/\/$/, "");
    const file = path.join(OUT, "html", rel.replace(/\//g, "__") + ".html");
    if (fs.existsSync(file)) continue;
    try {
      const r = await fetch("https://providentestate.com" + base(route), {
        headers: { "user-agent": UA },
        signal: AbortSignal.timeout(30000),
      });
      const t = await r.text();
      if (r.status === 200 && t.includes("___gatsby")) fs.writeFileSync(file, t);
      else failures.push(["html:" + route, r.status]);
    } catch (e) {
      failures.push(["html:" + route, "err:" + e.message.slice(0, 60)]);
    }
    hd++;
    if (hd % 5 === 0) console.log("html snaps:", hd);
  }
}
const snapQueue = [...new Set(htmlSnaps)];
await Promise.all(Array.from({ length: 3 }, () => snapWorker(snapQueue)));

console.log("SCRAPE DONE. done:", done, "html:", hd, "failures:", failures.length);
fs.writeFileSync(path.join(OUT, "failures.json"), JSON.stringify(failures, null, 2));
const bad = failures.slice(0, 60);
console.log(bad.map((f) => f.join(" ")).join("\n"));
