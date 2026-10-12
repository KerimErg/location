// Generates original 3D model (public/models/car.glb) and studio renders (public/vehicles/*.png)
// Usage: node scripts/generate-assets.mjs   (requires a Chromium binary; set CHROMIUM_PATH if needed)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const types = { ".js": "text/javascript", ".html": "text/html", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": types[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage();
page.on("console", (m) => m.type() === "error" && console.error(m.text()));
page.on("pageerror", (e) => console.error(e));
await page.goto(`http://localhost:${port}/scripts/render.html`);
await page.waitForFunction("window.ready === true");

const write = (file, dataUrl) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(dataUrl.split(",")[1], "base64"));
  console.log("✓", path.relative(root, file));
};

const vehicles = JSON.parse(fs.readFileSync(path.join(root, "prisma/data/vehicles.json"), "utf8"));
const only = process.argv[2];
for (const v of vehicles) {
  if (only && only !== v.slug && only !== "vehicles") continue;
  for (const view of ["front34", "side", "rear34"]) {
    const url = await page.evaluate((o) => window.renderCar(o), { type: v.type, color: v.color, view, w: 1200, h: 750 });
    write(path.join(root, `public/vehicles/${v.slug}-${view}.png`), url);
  }
}
if (!only || only === "extras") {
  const cats = { citadine: "#FF5F00", berline: "#1F2937", suv: "#F3F4F6", utilitaire: "#FFFFFF", premium: "#0F0F10", electrique: "#1E3A8A" };
  for (const [type, color] of Object.entries(cats)) {
    const url = await page.evaluate((o) => window.renderCar(o), { type, color, view: "front34", w: 900, h: 600 });
    write(path.join(root, `public/categories/${type}.png`), url);
  }
  const hero = await page.evaluate((o) => window.renderCar(o), { type: "premium", color: "#FF5F00", view: "hero", w: 1600, h: 900 });
  write(path.join(root, "public/images/hero-fallback.png"), hero);
  const glb = await page.evaluate((o) => window.exportGLB(o), { type: "premium", color: "#FF5F00" });
  fs.mkdirSync(path.join(root, "public/models"), { recursive: true });
  fs.writeFileSync(path.join(root, "public/models/car.glb"), Buffer.from(glb, "base64"));
  console.log("✓ public/models/car.glb");
}
await browser.close();
server.close();
