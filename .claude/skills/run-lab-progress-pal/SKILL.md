---
name: run-lab-progress-pal
description: Run, start, build, preview, or screenshot the lab-progress-pal INC Lab dashboard. TanStack Start + React + Cloudflare Workers + Supabase, driven by .claude/skills/run-lab-progress-pal/driver.mjs on Windows.
---

INC Lab 학부연구생 progress tracker. TanStack Start (React 19 + Vite) with a
Cloudflare Workers production target and a Node fallback server
(`deploy-server.mjs`). Data lives in Supabase — the `.env` file at the repo
root supplies the keys.

The agent path is **`driver.mjs`**: it launches the server, polls the port
until it answers, and shoots one PNG per route with headless Chrome. All
paths below are relative to the repo root (`c:/lab-progress-pal`).

## Prerequisites

This skill was authored on Windows with PowerShell / git bash. All commands
work in either.

- **Node 24+** — already on PATH (`node --version` → v24.14.1 tested).
- **Bun 1.3+** — at `C:\Users\303\.bun\bin\bun.exe`. The driver invokes
  `bun.exe` directly (not `bun.cmd`) because Node 20.12+ refuses to spawn
  `.cmd` files without `shell: true`, and the shell path adds a deprecation
  warning + PATH issues.
- **Google Chrome** — `C:\Program Files\Google\Chrome\Application\chrome.exe`.
  The driver also falls back to Edge at
  `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.
- **`.env`** at repo root with `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` /
  `SUPABASE_SERVICE_ROLE_KEY` / `VITE_SUPABASE_*`. Without these the dashboard
  loads but stays stuck on "불러오는 중...". The committed `.env` already has
  working keys.

Install deps once:

```bash
bun install
```

## Build (production only)

Dev mode does not require a build. For the `prod` driver path:

```bash
bun run build
```

Produces three trees: `dist/client/` (browser bundle), `dist/server/`
(`server.js` for the Node HTTP fallback), `dist/tanstack_start_app/` (the
Cloudflare Workers bundle). The driver's `prod` mode reads `dist/server/`
through `deploy-server.mjs`.

## Run (agent path)

```bash
node .claude/skills/run-lab-progress-pal/driver.mjs [dev|prod] [route ...]
```

Defaults: `dev` mode, route `/`. Screenshots land in
`.claude/skills/run-lab-progress-pal/__screenshots__/<slug>.png` (the
directory is wiped on each run).

What it does:

1. Spawns the dev server (`bun.exe run dev`, port 5173) or the prod server
   (`node deploy-server.mjs`, port 8085).
2. Polls `GET /` until it returns 200 (60-second timeout).
3. Runs `chrome.exe --headless=new --screenshot=<absolute-path>` for each
   route at 1280×900.
4. Kills the server tree via `taskkill /F /T` so vite's child processes die
   too — plain `SIGTERM` leaks on Windows.

Verified invocations (this session):

```bash
# Dashboard via vite dev server
node .claude/skills/run-lab-progress-pal/driver.mjs dev /
# → __screenshots__/root.png (101 KB, dashboard with 2 students)

# Dashboard + a non-existent student detail route (renders loading state, no crash)
node .claude/skills/run-lab-progress-pal/driver.mjs dev / /students/abc

# Same dashboard via the production Node server
node .claude/skills/run-lab-progress-pal/driver.mjs prod /
```

## Run (human path)

For interactive development:

```bash
bun run dev          # vite at http://localhost:5173
bun run build        # production build into dist/
node deploy-server.mjs   # Node HTTP server at http://127.0.0.1:8085 (reads .env)
```

Press Ctrl-C to stop. Useless if you can't open a browser — use the driver
when headless.

## Direct invocation

The data layer is in `src/lib/students-client.ts` (`fetchStudents`) and
`src/integrations/supabase/`. To call into it without booting the full app:

```bash
node --experimental-strip-types -e "
  process.env.VITE_SUPABASE_URL ??= process.env.SUPABASE_URL;
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??= process.env.SUPABASE_PUBLISHABLE_KEY;
  const { fetchStudents } = await import('./src/lib/students-client.ts');
  console.log(await fetchStudents());
"
```

(Requires `.env` exported into the shell first — `set -a; source .env; set +a`
in bash, or read it explicitly.)

## Gotchas

- **git bash mangles leading `/` arguments.** `node driver.mjs dev /` ends
  up with `argv[3] === "C:/Program Files/Git/"` because MSYS auto-converts
  POSIX paths. The driver defensively strips that prefix, so the documented
  invocations work as-is. If you bypass the driver and call something else,
  prefix with `MSYS_NO_PATHCONV=1` or use PowerShell.
- **`bun.cmd` won't spawn from Node.** Use `bun.exe` (the real binary in
  `~/.bun/bin/`). The driver does this.
- **Chrome `--screenshot=<relative-path>` returns "액세스가 거부되었습니다"
  (access denied).** Pass the full Windows-style absolute path
  (`C:\path\to\out.png`). The driver builds one with `path.join`.
- **`SIGTERM` does not kill the vite tree on Windows.** Bun spawns vite,
  vite spawns esbuild, and signals don't propagate. The driver shells out
  to `taskkill /F /T /PID <pid>`.
- **The `[server] exited 1` line at the end is expected** — that's `taskkill`
  doing its job, not a failure. The driver's own exit code reflects whether
  screenshots succeeded.
- **Student detail route `/students/<id>` always returns 200** even for
  non-existent IDs; the page shell renders and the data fetch resolves to
  empty. The screenshot will show the header + "불러오는 중..." (loading).
  Use a real ID from the dashboard for a meaningful screenshot.
- **Cloudflare bundle has huge chunks** (`router-*.js` ~1.5 MB) — vite
  warns but the build still succeeds. Ignore unless tuning bundle size.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `spawn EINVAL` from driver | You changed the driver to use `.cmd`. Switch back to `bun.exe` and remove `shell: true`. |
| `Timeout waiting for http://localhost:5173` | Port 5173 already in use. `netstat -ano \| findstr :5173` then `taskkill /F /PID <pid>`. |
| Screenshot is tiny (~10 KB) and blank | Route not loaded yet. Increase `--virtual-time-budget=8000` in `driver.mjs` (currently 8s). |
| Dashboard shows "불러오는 중..." forever | `.env` missing or Supabase keys wrong. Confirm `SUPABASE_URL` resolves and the publishable key still works at the dashboard. |
| `dist/ missing — run \`bun run build\` first` | The `prod` mode needs the build output. Run `bun run build`. |
| Korean characters mojibake in screenshots | Should not happen on Windows + Chrome. If it does, run `chcp 65001` in cmd before launching. |
