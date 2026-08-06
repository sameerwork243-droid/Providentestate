import { chromium } from "playwright-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] || "http://localhost:3000";
const OUT = process.argv[3] || "qa-buy";
import { mkdirSync } from "node:fs";

const ROUTES = [
  { path: "/buy/properties-for-sale/", name: "buy-page" },
];

const WIDTHS = [1024, 1440, 1600];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  for (const w of WIDTHS) {
    for (const r of ROUTES) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 300)));
    page.on("pageerror", (e) => errs.push(String(e).slice(0, 300)));
    try {
      await page.goto(BASE + r.path, { waitUntil: "networkidle", timeout: 40000 });
      await page.waitForTimeout(1500);
      const overflow = await page.evaluate(() => {
        const d = document.documentElement;
        const causes = [];
        if (d.scrollWidth > d.clientWidth + 1) {
          document.querySelectorAll("body *").forEach((el) => {
            const b = el.getBoundingClientRect();
            if (b.right > d.clientWidth + 4 && b.width > 20) {
              const cls = (el.getAttribute?.("class") || "").slice(0, 60);
              if (!causes.some((c) => c.includes(`${el.tagName}.${cls}`))) causes.push(`${el.tagName}.${cls} right=${Math.round(b.right)}`);
            }
          });
        }
        return { sw: d.scrollWidth, cw: d.clientWidth, causes: causes.slice(0, 8) };
      });
      const cards = await page.locator(".property-card").count();
      const imgs = await page.locator(".property-card .img-section img").count();
      const broken = await page.locator(".property-card img").evaluateAll((imgs) => imgs.filter((i) => !(i.naturalWidth > 0)).length);
      await page.screenshot({ path: `${OUT}/w${w}-${r.name}.png`, fullPage: true });
      console.log(`w${w}: cards=${cards} cardImgs=${imgs} brokenImgs=${broken} overflow=${JSON.stringify(overflow)} errs=${errs.length}`);
      errs.forEach((e) => console.log("   ERR:", e));
    } catch (e) {
      console.log(`w${w} ${r.path} FAILED: ${String(e).slice(0, 200)}`);
    }
    await ctx.close();
  }
}
await browser.close();
console.log("done");
