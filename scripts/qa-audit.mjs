/**
 * Responsive QA audit harness (uses system Chrome via playwright-core).
 * Checks per width: JS console errors, runtime page errors, horizontal overflow,
 * key element presence/overflow, and captures screenshots.
 * Run: node scripts/qa-audit.mjs <url> <outdir>
 */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] || "http://localhost:3110";
const OUT = process.argv[3] || "qa-out";

const WIDTHS = [320, 360, 400, 480, 600, 744, 768, 1024, 1200, 1440, 1600];

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/buy", name: "buy" },
  { path: "/buy/apartments-for-sale", name: "buy-apartments" },
  { path: "/buy/marina-gate-2-bedroom-apartment-101", name: "property-detail" },
  { path: "/new-projects", name: "projects" },
  { path: "/new-projects/marina-vista-towers-201", name: "project-detail" },
  { path: "/area-guides", name: "areas" },
  { path: "/blog", name: "blog" },
  { path: "/team", name: "team" },
  { path: "/contact", name: "contact" },
  { path: "/about", name: "about" },
  { path: "/services", name: "services" },
];

const CHECK_ELEMENTS = [
  { sel: "header", label: "header" },
  { sel: "footer", label: "footer" },
  { sel: "nav[aria-label='Primary']", label: "desktop-nav", min: 1280 },
  { sel: "#main", label: "main" },
];

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const report = { widths: WIDTHS, results: [] };

  for (const w of WIDTHS) {
    for (const route of ROUTES) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
      page.on("pageerror", (e) => pageErrors.push(String(e)));

      const url = `${BASE}${route.path}`;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      } catch {
        report.results.push({ width: w, route: route.name, fatal: "navigation-failed", consoleErrors, pageErrors });
        await ctx.close();
        continue;
      }

      // allow framer-motion reveals to settle
      await page.waitForTimeout(1200);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const causes = [];
        if (doc.scrollWidth > doc.clientWidth + 1) {
          document.querySelectorAll("body *").forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.right > doc.clientWidth + 4 && r.width > 20) {
              const cls = (el.getAttribute?.("class") || "").slice(0, 60);
              const tag = el.tagName.toLowerCase();
              if (!causes.some((c) => c.includes(`${tag}.${cls}`)))
                causes.push(`${tag}.${cls} right=${Math.round(r.right)}`);
            }
          });
        }
        return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, causes: causes.slice(0, 6) };
      });

      const presence = {};
      for (const c of CHECK_ELEMENTS) {
        if (c.min && w < c.min) continue;
        const found = await page.locator(c.sel).count();
        const vis = found ? await page.locator(c.sel).first().isVisible() : false;
        presence[c.label] = found > 0 && vis;
      }

      const shotDir = `${OUT}/w${w}`;
      mkdirSync(shotDir, { recursive: true });
      await page.screenshot({ path: `${shotDir}/${route.name}.png`, fullPage: true });

      report.results.push({
        width: w,
        route: route.name,
        overflow: overflow.scrollW > overflow.clientW + 1,
        overflowCause: overflow.causes,
        consoleErrors,
        pageErrors,
        presence,
      });
      await ctx.close();
    }
  }

  writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();

  // summary
  let issues = 0;
  for (const r of report.results) {
    const problems = [];
    if (r.fatal) problems.push(r.fatal);
    if (r.overflow) problems.push(`overflow: ${r.overflowCause.join(", ")}`);
    if (r.consoleErrors?.length) problems.push(`console(${r.consoleErrors.length})`);
    if (r.pageErrors?.length) problems.push(`pageerror(${r.pageErrors.length})`);
    if (r.presence) {
      for (const [k, v] of Object.entries(r.presence)) if (!v) problems.push(`missing:${k}`);
    }
    if (problems.length) {
      issues++;
      writeFileSync(`${OUT}/issue-${r.width}-${r.route}.json`, { problems, ...r } && JSON.stringify({ problems, ...r }, null, 2));
      console.log(`✗ w${r.width} ${r.route}: ${problems.join(" | ")}`);
    }
  }
  console.log(`\nRows checked: ${report.results.length}, rows with issues: ${issues}`);
  console.log(`Report: ${OUT}/report.json ; screenshots under ${OUT}/w*/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});