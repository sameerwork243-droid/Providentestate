/**
 * Extract per-section data from the homepage SSR HTML: property card ids per
 * slider, developer logos order, review list order. Outputs src/data/home.json.
 */
import fs from "node:fs";
import path from "node:path";

const htmlPath = process.argv[2];
if (!htmlPath) {
  console.error("usage: node scripts/extract-home.mjs <home-html-file>");
  process.exit(1);
}
const html = fs.readFileSync(htmlPath, "utf8");
const out = { featuredSliders: [], developers: [], reviews: [], communities: [] };

// Split html by major section headings to attribute cards
const markers = [
  ["featured", 'Explore Property in Dubai.'],
  ["signature", 'id="singnature"'],
  ["market", "Dubai&#x27;s Premier Property Marketplace"],
  ["news", "Latest News &amp; Insights"],
  ["tree", "A Home for You, A Tree for the Planet"],
  ["reviews", "Why Our Clients Trust Us"],
  ["quiz", "question-banner-wrap"],
  ["communities", "Popular Properties in Dubai Communities"],
];
const positions = markers.map(([name, needle]) => [name, html.indexOf(needle)]).filter(([, i]) => i >= 0);
positions.sort((a, b) => a[1] - b[1]);
const segments = positions.map(([name, start], i) => ({
  name,
  start,
  end: i + 1 < positions.length ? positions[i + 1][1] : html.length,
}));

const linkRe = /href="(\/(?:buy|let)\/[^"]+?\/)"/g;
for (const seg of segments) {
  if (seg.name !== "featured" && seg.name !== "signature") continue;
  const chunk = html.slice(seg.start, seg.end);
  const links = [];
  let m;
  while ((m = linkRe.exec(chunk))) {
    const p = m[1];
    if (/for-(sale|rent)(-in|-)[^"]*$/.test(p) || /-for-(sale|rent)\//.test(p)) links.push(p.slice(0, -1));
  }
  out.featuredSliders.push({ name: seg.name, links: [...new Set(links)] });
}

// developer logos in order
const devIdx = html.indexOf("Partners with Dubai");
const devChunk = html.slice(Math.max(0, devIdx - 200), positions.find(([n]) => n === "featured")[1]);
const devRe = /alt="([^"]+) - Provident Estate"/g;
const devs = [];
let m;
while ((m = devRe.exec(devChunk))) devs.push(m[1]);
out.developers = devs;

// reviews: names + titles
const revChunk = html.slice(html.indexOf("Why Our Clients Trust Us"));
const nameRe = /<p class="name">([^<]+)<\/p>[\s\S]*?<p class="date">([^<]*)<\/p>/g;
const titleRe = /<p class="title-review">([^<]+)<\/p>/g;
const names = [...revChunk.matchAll(nameRe)].map((mm) => [mm[1], mm[2]]);
const titles = [...revChunk.matchAll(titleRe)].map((mm) => mm[1]);
out.reviews = names.map(([name, date], i) => ({ name, date, title: titles[i] || "" }));

// communities links
const comChunk = html.slice(html.indexOf("Popular Properties in Dubai Communities"));
const comRe = /href="(\/(?:buy|let)\/properties-for-(?:sale|rent)\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
const coms = [];
while ((m = comRe.exec(comChunk))) coms.push({ href: m[1], label: m[2].trim() });
out.communities = coms;

const dest = path.join(process.cwd(), "src", "data", "home.json");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out, null, 2));
console.log("written", dest);
console.log(JSON.stringify(out, null, 1).slice(0, 2200));
