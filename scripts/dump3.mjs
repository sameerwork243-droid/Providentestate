import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] || "http://localhost:3000";
const OUT = process.argv[3] || "dump";

const ROUTES = [
  { path: "/developers/", name: "developers" },
  { path: "/property-services/", name: "services" },
  { path: "/blog/", name: "blog" },
];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const r of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 300)));
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 300)));
  try {
    await page.goto(BASE + r.path, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => {
      const d = document.documentElement;
      const header = document.querySelector(".header-wrap");
      const wrap = document.querySelector(".listing-page-wrap") || document.querySelector(".banner-wrap");
      const foot = document.querySelector(".footer-wrap");
      const hTop = header ? header.getBoundingClientRect().top : null;
      const body = document.body;
      const firstCard = document.querySelector(".developer-card, .news-card-wrapper, .service-item, .partner-item");
      const seR = document.querySelector(".listing-page-wrap");
      return {
        docH: d.scrollHeight,
        bodyScrollW: body.scrollWidth,
        docClientW: d.clientWidth,
        overflow: body.scrollWidth > d.clientWidth + 1,
        headerH: header ? header.getBoundingClientRect().height : null,
        headerTop: hTop,
        headerBg: header ? getComputedStyle(header.querySelector(".nav-menu-section") || header).backgroundColor : null,
        seRTop: seR ? seR.getBoundingClientRect().top : null,
        seRH: seR ? seR.getBoundingClientRect().height : null,
        firstCardTop: firstCard ? firstCard.getBoundingClientRect().top : null,
        footTop: foot ? foot.getBoundingClientRect().top : null,
        h1: document.querySelector("h1") ? document.querySelector("h1").textContent.trim().slice(0, 80) : null,
        cards: document.querySelectorAll(".developer-card").length,
        newsCards: document.querySelectorAll(".news-card").length,
        pagination: document.querySelectorAll(".pagination-container").length,
        mobileBanner: document.querySelector(".mobile-banner-menu") ? document.querySelector(".mobile-banner-menu").getAttribute("class") : null,
        breadcrumbs: document.querySelector(".breadcrumb") ? document.querySelector(".breadcrumb").textContent.replace(/\s+/g, " ").trim() : null,
      };
    });
    console.log(`\n=== ${r.name} (${r.path}) ===`);
    console.log(JSON.stringify(info, null, 1));
    writeFileSync(`${OUT}-${r.name}.html`, await page.content());
  } catch (e) {
    console.log(`\n=== ${r.name} FAILED: ${String(e).slice(0, 200)}`);
  }
  await ctx.close();
}
await browser.close();
