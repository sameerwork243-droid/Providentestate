import { chromium } from "playwright-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGETS = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: CHROME, headless: true, ignoreHTTPSErrors: true });
for (const t of TARGETS) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  try {
    await page.goto(t, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(3500);
    const out = await page.evaluate(() => {
      const all = [];
      const grab = (sel, label) => {
        const n = document.querySelectorAll(sel).length;
        const el = document.querySelector(sel);
        all.push(`${label}: count=${n}${el ? " first=" + el.textContent.trim().replace(/\s+/g, " ").slice(0, 60) : ""}`);
      };
      const r = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return `${Math.round(b.width)}x${Math.round(b.height)}`;
      };
      return {
        probes: all,
        header: document.querySelector(".header-wrap")?.className,
        mainSections: [...document.querySelectorAll("#main > div, main > div, .page-layout > div")].map((d) => (d.className || "").toString().slice(0, 40)).filter(Boolean).slice(0, 30),
        docH: document.documentElement.scrollHeight,
        "all-card-classes": r(".property-card, .developer-card, .blog-card, .card"),
      };
    });
    console.log(`== ${t} docH=${out.docH}`);
    out.mainSections.forEach((s) => console.log("   section:", s));
  } catch (e) { console.log(`== ${t} FAILED ${String(e).slice(0, 150)}`); }
  await ctx.close();
}
await browser.close();