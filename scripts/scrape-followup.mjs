/**
 * Follow-up scrape: home page-data, projects hub, all project detail pages,
 * team/contact pages, stragglers. Run after scrape-ref.mjs.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "data", "raw");
const TMP = process.env.TEMP || ".";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
const pdUrl = (route) =>
  "https://providentestate.com/page-data" + (route === "/" ? "/index" : route) + "/page-data.json";

const jobs = [
  ["/", "pages"],
  ["/new-projects/", "pages"],
  ["/about/reviews/", "pages"],
  ["/open-houses", "pages"],
  ["/list-your-property", "pages"],
  ["/book-a-viewing", "pages"],
  ["/signature/", "pages"],
  ["/branded-residences-in-dubai", "pages"],
  ["/real-estate-guides/", "pages"],
];

const offplanLines = fs
  .readFileSync(path.join(TMP, "ps-offplans.txt"), "utf8")
  .split(/\r?\n/)
  .filter(Boolean);
const projectRoutes = new Set();
for (const u of offplanLines) {
  const p = new URL(u).pathname.replace(/\/$/, "");
  const seg = p.split("/").filter(Boolean);
  if (seg[0] === "new-projects" && seg.length === 2) projectRoutes.add(p);
}
for (const r of projectRoutes) jobs.push([r, "projects"]);
console.log("jobs:", jobs.length, "projects:", projectRoutes.size);

const failures = [];
let done = 0;
async function worker(queue) {
  while (queue.length) {
    const [route, sub] = queue.shift();
    const rel = (route === "/" ? "index" : route.slice(1)).replace(/\/$/, "");
    const file = path.join(OUT, sub, rel + ".json");
    if (fs.existsSync(file)) continue;
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
    if (done % 200 === 0) console.log("followup:", done, "/", jobs.length, "fails:", failures.length);
  }
}

const queue = [...jobs];
await Promise.all(Array.from({ length: 6 }, () => worker(queue)));

// team contact pages from scraped team list
const teamDir = path.join(OUT, "pages", "team");
let teamSlugs = [];
try {
  const hub = JSON.parse(fs.readFileSync(path.join(OUT, "pages", "team.json"), "utf8"));
  const list = hub.result?.data?.strapiTeam?.teamMembers || hub.result?.data?.teamMembers || [];
  teamSlugs = list.map((m) => m.slug || m.link?.slug).filter(Boolean);
} catch {}
if (!teamSlugs.length) {
  try {
    teamSlugs = fs.readdirSync(teamDir).filter((f) => f.endsWith(".json") && f !== "index.json").map((f) => f.replace(".json", ""));
  } catch {}
}
let td = 0;
const tFails = [];
for (const slug of teamSlugs) {
  const file = path.join(teamDir, slug, "contact.json");
  if (fs.existsSync(file)) continue;
  try {
    const r = await fetch(pdUrl(`/team/${slug}/contact`), {
      headers: { "user-agent": UA, accept: "application/json" },
      signal: AbortSignal.timeout(30000),
    });
    if (r.status === 200) {
      const t = await r.text();
      if (t.trim().startsWith("{")) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, t);
      } else tFails.push(slug);
    } else tFails.push(slug);
  } catch {
    tFails.push(slug);
  }
  td++;
  if (td % 50 === 0) console.log("team contacts:", td, "/", teamSlugs.length);
}

console.log("FOLLOWUP DONE. jobs:", done, "team:", teamSlugs.length, "fails:", failures.length + tFails.length);
fs.writeFileSync(path.join(OUT, "failures2.json"), JSON.stringify([...failures, ...tFails.map((s) => [s, "nf"])], null, 2));
console.log([...failures, ...tFails.map((s) => [s, "nf"])].slice(0, 40).map((f) => f.join(" ")).join("\n"));
