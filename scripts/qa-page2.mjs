import { chromium } from "playwright-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME, headless: true, ignoreHTTPSErrors: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/buy/properties-for-sale/page/2/", { waitUntil: "networkidle", timeout: 40000 });
const out = await page.evaluate(() => ({
  cards: document.querySelectorAll(".property-card.list-view").length,
  activePage: document.querySelector(".pagination-number.active")?.textContent,
  numBtns: document.querySelectorAll(".pagination-numbers a").length,
  h1: document.querySelector(".h1-section h1")?.textContent,
  count: document.querySelector(".info p span")?.textContent,
  firstCard: document.querySelector(".property-card .amenities")?.textContent?.trim().slice(0, 60),
  prevDisabled: !!document.querySelector(".pagination-button.button-back.button-disabled"),
}));
console.log(JSON.stringify(out, null, 2));
await browser.close();
