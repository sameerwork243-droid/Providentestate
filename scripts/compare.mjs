import { chromium } from "playwright-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGETS = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: CHROME, headless: true });

const PROBES = [
  ["layout-grid", ".new-layout-with-sidebar", (e) => getComputedStyle(e).gridTemplateColumns],
  ["results-col", "#property-page-1", (e) => e.getBoundingClientRect().width.toFixed(1)],
  ["sidebar", ".side-bar-listing-page", (e) => `${e.getBoundingClientRect().left.toFixed(0)},${e.getBoundingClientRect().width.toFixed(0)}`],
  ["filter-desktop", ".search-filters-section .filters-section", (e) => getComputedStyle(e).display],
  ["filter-mobile", ".search-filters-container.mobile-toggle-filter", (e) => getComputedStyle(e).display],
  ["tog-btns", ".tog-btn", (e) => document.querySelectorAll(".tog-btn").length],
  ["price-dd", ".price-filter-dropdown .custom-dropdown-toggle", (e) => { const t = document.querySelector(".price-filter-dropdown .custom-dropdown-toggle"); return t ? `${t.getBoundingClientRect().width.toFixed(0)}x${t.getBoundingClientRect().height.toFixed(0)}` : "missing"; }],
  ["bed-dd", ".bedroom-filter-dropdown .custom-dropdown-toggle", (e) => { const t = document.querySelector(".bedroom-filter-dropdown .custom-dropdown-toggle"); return t ? `${t.getBoundingClientRect().width.toFixed(0)}x${t.getBoundingClientRect().height.toFixed(0)}` : "missing"; }],
  ["card", ".property-card.list-view", (e) => { const c = document.querySelector(".property-card.list-view"); return c ? `${c.getBoundingClientRect().width.toFixed(0)}x${c.getBoundingClientRect().height.toFixed(0)}` : "missing"; }],
  ["card-img", ".property-card .listview-img-section", (e) => { const c = document.querySelector(".property-card .listview-img-section"); return c ? `${c.getBoundingClientRect().width.toFixed(0)}x${c.getBoundingClientRect().height.toFixed(0)}` : "missing"; }],
  ["info-map", ".info-map-sort-section", (e) => { const c = document.querySelector(".info-map-sort-section"); return c ? `${c.getBoundingClientRect().width.toFixed(0)}x${c.getBoundingClientRect().height.toFixed(0)}` : "missing"; }],
  ["pagination", ".pagination-container", (e) => e ? "present" : "missing"],
  ["calc", ".results-calculator", (e) => e ? "present" : "missing"],
  ["qes", ".qes-bk", (e) => e ? "present" : "missing"],
  ["copy", ".text-copy-wrap", (e) => e ? "present" : "missing"],
  ["sticky-top", ".sticky-container", (e) => { const s = document.querySelector(".side-bar-listing-page .sticky-container"); return s ? getComputedStyle(s).position : "missing"; }],
  ["expert-card", ".property-nego-card-wrap.sr", (e) => e ? "present" : "missing"],
  ["spotlight", ".spotlight", (e) => e ? "present" : "missing"],
  ["mortgage", ".side-bar-listing-page .card-view", (e) => e ? "present" : "missing"],
  ["breadcrumb", ".property-breadcrumb-wrap", (e) => e ? "present" : "missing"],
  ["sort-dd", ".sort-filter-dropdown .custom-dropdown-toggle", (e) => { const t = document.querySelector(".sort-filter-dropdown .custom-dropdown-toggle"); return t ? `w${t.getBoundingClientRect().width.toFixed(0)}` : "missing"; }],
  ["card-type", ".property-card .info-section .type", (e) => { const t = document.querySelector(".property-card .info-section .type"); return t ? t.textContent.trim().slice(0, 40) : "missing"; }],
  ["card-address", ".property-card .address", (e) => { const t = document.querySelector(".property-card .address"); return t ? t.textContent.trim().slice(0, 60) : "missing"; }],
  ["cta-btns", ".property-card .cta-section .button", (e) => [...document.querySelectorAll(".property-card .cta-section .button")].map((b) => b.textContent.trim()).slice(0, 4).join(" | ")],
  ["card-title", ".property-card .card-link h3, .property-card h3", (e) => { const t = document.querySelector(".property-card h3, .property-card .pr-bk h3"); return t ? t.textContent.trim().slice(0, 50) : "missing"; }],
  ["price", ".property-card .pr-bk .price, .property-card .price", (e) => { const t = document.querySelector(".property-card .price"); return t ? t.textContent.trim().slice(0, 30) : "missing"; }],
];

for (const target of TARGETS) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  try {
    await page.goto(target, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(4000);
    const out = {};
    for (const [name, sel, fn] of PROBES) {
      try { out[name] = await page.$eval(sel, fn); }
      catch { out[name] = "MISSING"; }
    }
    console.log(`== ${target}`);
    for (const [k, v] of Object.entries(out)) console.log(`   ${k.padEnd(14)} ${v}`);
  } catch (e) {
    console.log(`== ${target} FAILED: ${String(e).slice(0, 150)}`);
  }
  await ctx.close();
}
await browser.close();
