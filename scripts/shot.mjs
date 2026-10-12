// Dev helper: node scripts/shot.mjs <url> <out.png> [width] [height] [fullPage] [dark]
import { chromium } from "playwright-core";
const [url, out, w = "1440", h = "900", full = "0", dark = "0"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, colorScheme: dark === "1" ? "dark" : "light" });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(url, { waitUntil: "networkidle", timeout: 120000 }).catch((e) => errors.push(String(e)));
await page.waitForTimeout(4000);
if (full === "1") {
  // trigger whileInView reveals
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(800);
}
await page.screenshot({ path: out, fullPage: full === "1" });
console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "no errors");
await browser.close();
