import { chromium } from "playwright-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const url = process.argv[2];
const out = process.argv[3];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);
