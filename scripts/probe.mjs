import { chromium } from "playwright-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] || "http://localhost:3120";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 900 } });
page.on("console", (m) => {
  const t = m.text();
  if (t.includes("hydration") || t.includes("Hydration") || t.includes("418")) console.log("CONSOLE:", t.slice(0, 1200));
});
page.on("pageerror", (e) => console.log("PAGEERROR:", String(e).slice(0, 1200)));
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await browser.close();