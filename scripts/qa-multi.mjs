import { chromium } from "playwright-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROUTES = [
  "/buy/properties-for-sale/",
  "/buy/properties-for-sale/page/2/",
  "/buy/apartment-for-sale/",
  "/let/properties-for-rent/page/3/",
];
const browser = await chromium.launch({ executablePath: CHROME, headless: true, ignoreHTTPSErrors: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
for (const r of ROUTES) {
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && !m.text().includes("tracking.providentestate") && errs.push(m.text().slice(0, 120)));
  await page.goto("http://localhost:3000" + r, { waitUntil: "networkidle", timeout: 40000 });
  await page.waitForTimeout(1200);
  const o = await page.evaluate(() => {
    const d = document.documentElement;
    return {
      cards: document.querySelectorAll(".property-card.list-view").length,
      overflow: d.scrollWidth > d.clientWidth + 1,
      active: document.querySelector(".pagination-number.active")?.textContent || null,
      listingTxt: document.querySelector(".info p span")?.textContent || null,
      typeInCard: document.querySelector(".property-card .info-section .type")?.textContent?.trim() || null,
      errs: [],
    };
  });
  console.log(r, JSON.stringify(o), errs.length ? "ERR " + errs.join(" | ") : "no-console-errors");
  await page.close();
}
await browser.close();