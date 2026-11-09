// Lance le site DGN Cars sur cet ordinateur, avec une base PostgreSQL intégrée.
// Prérequis : Node.js 20+. Usage : npm run local  (puis http://localhost:3000)
import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const dataDir = path.join(root, ".local-db");
const PORT = 54329;
const DB = "dgncars";
const isWin = process.platform === "win32";
const npx = isWin ? "npx.cmd" : "npx";

const firstRun = !fs.existsSync(path.join(dataDir, "PG_VERSION"));
const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "dgn-local",
  port: PORT,
  persistent: true,
  createPostgresUser: typeof process.getuid === "function" && process.getuid() === 0,
  onLog: () => {},
});

const step = (s) => console.log(`\n▸ ${s}`);
const run = (cmd, args, env) => {
  const r = spawnSync(cmd, args, { cwd: root, stdio: "inherit", env, shell: isWin });
  if (r.status !== 0) throw new Error(`Échec : ${cmd} ${args.join(" ")}`);
};

try {
  step(firstRun ? "Création de la base de données locale (première fois)…" : "Démarrage de la base de données locale…");
  if (firstRun) await pg.initialise();
  await pg.start();
  if (firstRun) await pg.createDatabase(DB);

  const secretFile = path.join(dataDir, ".secret");
  if (!fs.existsSync(secretFile)) fs.writeFileSync(secretFile, crypto.randomBytes(32).toString("base64"));
  const url = `postgresql://postgres:dgn-local@localhost:${PORT}/${DB}`;
  const env = { ...process.env, DATABASE_URL: url, DIRECT_URL: url, NEXTAUTH_SECRET: fs.readFileSync(secretFile, "utf8"), NEXTAUTH_URL: "http://localhost:3000", NEXT_TELEMETRY_DISABLED: "1" };

  step("Mise à jour des tables…");
  run(npx, ["prisma", "migrate", "deploy"], env);
  if (firstRun) {
    step("Chargement du stock et du compte admin…");
    run(npx, ["tsx", "prisma/seed.ts"], env);
  }
  if (!fs.existsSync(path.join(root, ".next", "BUILD_ID")) || process.argv.includes("--rebuild")) {
    step("Préparation du site (1 à 2 minutes la première fois)…");
    run(npx, ["next", "build"], env);
  }

  step("Site prêt : http://localhost:3000   (admin : http://localhost:3000/admin — admin@dgncars.be / Admin123!)");
  console.log("  Laissez cette fenêtre ouverte. Ctrl+C pour arrêter.\n");
  const server = spawn(npx, ["next", "start", "-p", "3000"], { cwd: root, stdio: "inherit", env, shell: isWin });
  setTimeout(() => {
    const open = isWin ? ["cmd", ["/c", "start", "", "http://localhost:3000"]] : process.platform === "darwin" ? ["open", ["http://localhost:3000"]] : ["xdg-open", ["http://localhost:3000"]];
    spawn(open[0], open[1], { stdio: "ignore", detached: true }).on("error", () => {});
  }, 4000);

  const stop = async () => {
    server.kill();
    await pg.stop().catch(() => {});
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  server.on("exit", async () => {
    await pg.stop().catch(() => {});
    process.exit(0);
  });
} catch (e) {
  console.error(`\n✖ ${e instanceof Error ? e.message : e}`);
  await pg.stop().catch(() => {});
  process.exit(1);
}
