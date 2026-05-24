#!/usr/bin/env node
// Drive lab-progress-pal end-to-end: launch the server, wait for the port,
// take screenshots, then stop cleanly. Works on Windows.
//
//   node .claude/skills/run-lab-progress-pal/driver.mjs [dev|prod] [route ...]
//
// Routes default to "/". Screenshots land in
// .claude/skills/run-lab-progress-pal/__screenshots__/<slug>.png .
// Run from the repo root.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..", "..");
const screenshotDir = join(__dirname, "__screenshots__");

const [, , modeArg = "dev", ...routeArgs] = process.argv;
const mode = modeArg === "prod" ? "prod" : "dev";

// git bash on Windows converts leading "/" args to "C:/Program Files/Git/...".
// Strip that prefix so `node driver.mjs dev /` works without MSYS_NO_PATHCONV.
function normalizeRoute(r) {
  const stripped = r.replace(/^[A-Za-z]:[\\/]Program Files[\\/]Git/i, "");
  return stripped.startsWith("/") ? stripped : "/" + stripped;
}
const routes = (routeArgs.length ? routeArgs : ["/"]).map(normalizeRoute);

const config = {
  dev: {
    cmd: process.platform === "win32" ? "bun.exe" : "bun",
    args: ["run", "dev"],
    port: 5173,
    host: "localhost",
  },
  prod: {
    cmd: process.execPath,
    args: ["deploy-server.mjs"],
    port: 8085,
    host: "127.0.0.1",
  },
}[mode];

function findChrome() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  for (const p of candidates) if (existsSync(p)) return p;
  throw new Error("No Chrome or Edge found. Install Chrome or set the path manually.");
}

async function waitForHttp(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return;
    } catch {}
    await delay(500);
  }
  throw new Error(`Timeout waiting for ${url}`);
}

function shot(chrome, url, outPath) {
  return new Promise((res, rej) => {
    const p = spawn(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--no-sandbox",
        "--virtual-time-budget=8000",
        "--window-size=1280,900",
        `--screenshot=${outPath}`,
        url,
      ],
      { stdio: "inherit" },
    );
    p.on("exit", (code) => (code === 0 ? res() : rej(new Error(`chrome exit ${code}`))));
  });
}

function slug(route) {
  const s = route.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return s || "root";
}

let server;
function killServer() {
  if (!server || server.killed) return;
  if (process.platform === "win32") {
    // Kill the whole tree — bun/vite spawn children that survive SIGTERM on Windows.
    spawn("taskkill", ["/F", "/T", "/PID", String(server.pid)], { stdio: "ignore" });
  } else {
    server.kill("SIGTERM");
  }
}

process.on("SIGINT", () => { killServer(); process.exit(130); });
process.on("SIGTERM", () => { killServer(); process.exit(143); });

async function main() {
  if (mode === "prod" && !existsSync(join(repoRoot, "dist", "server", "server.js"))) {
    throw new Error("dist/ missing — run `bun run build` first.");
  }

  rmSync(screenshotDir, { recursive: true, force: true });
  mkdirSync(screenshotDir, { recursive: true });

  console.log(`[driver] launching ${mode} (${config.cmd} ${config.args.join(" ")})`);
  server = spawn(config.cmd, config.args, {
    cwd: repoRoot,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (b) => process.stdout.write(`[server] ${b}`));
  server.stderr.on("data", (b) => process.stderr.write(`[server!] ${b}`));
  server.on("exit", (code) => console.log(`[driver] server exited ${code}`));

  const base = `http://${config.host}:${config.port}`;
  await waitForHttp(base);
  console.log(`[driver] server ready at ${base}`);

  const chrome = findChrome();
  for (const route of routes) {
    const out = join(screenshotDir, `${slug(route)}.png`);
    console.log(`[driver] shot ${base}${route} -> ${out}`);
    await shot(chrome, `${base}${route}`, out);
  }
  console.log(`[driver] done. Screenshots in ${screenshotDir}`);
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(() => killServer());
