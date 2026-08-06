import { chromium } from "playwright-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGETS = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const SEL = {
  card: ".property-card.list-view",
  imgSec: ".property-card.list-view .img-section",
  content: ".property-card.list-view .content-section",
  prbk: ".property-card.list-view .pr-bk",
  amm: ".property-card.list-view .ammenities",
  addr: ".property-card.list-view .address",
  info: ".property-card.list-view .info-section",
  longdesc: ".property-card.list-view .long-description",
  cta: ".property-card.list-view .cta-section",
};
for (const target of TARGETS) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  try {
    await page.goto(target, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(4000);
    const out = await page.evaluate((sel) => {
      const r = {};
      for (const [k, s] of Object.entries(sel)) {
        const el = document.querySelector(s);
        r[k] = el ? `${el.getBoundingClientRect().height.toFixed(0)}x${el.getBoundingClientRect().width.toFixed(0)}` : "MISSING";
      }
      const card = document.querySelector(".property-card.list-view");
      const info = document.querySelector(".property-card.list-view .info-section");
      r["infoCount"] = info ? info.querySelectorAll("p").length : 0;
      const amm = document.querySelector(".property-card.list-view .ammenities");
      r["ammTextLen"] = amm ? amm.textContent.trim().length : 0;
      const ld = document.querySelector(".property-card.list-view .long-description");
      r["longdescText"] = ld ? ld.textContent.trim().replace(/\s+/g, " ").slice(0, 140) : "MISSING";
      const cta = document.querySelector(".property-card.list-view .cta-section");
      r["ctaBtns"] = cta ? [...cta.querySelectorAll("a")].map((a) => a.className).join("|") : "none";
      const p = document.querySelector(".property-card.list-view .p-hypen");
      r["phypen"] = p ? p.offsetHeight : -1;
      r["cardH"] = card ? card.getBoundingClientRect().height : 0;
      return r;
    }, SEL);
    console.log(`== ${target}`);
    for (const [k, v] of Object.entries(out)) console.log(`   ${k.padEnd(14)} ${v}`);
  } catch (e) {
    console.log(`== ${target} FAILED: ${String(e).slice(0, 200)}`);
  }
  await ctx.close();
}
await browser.close();
