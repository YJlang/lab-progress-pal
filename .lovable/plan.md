# Lab Progress Board — Implementation Plan

A minimal, Notion-style internal lab dashboard for tracking undergraduate researchers' learning stages. Public read, PIN-gated edit. Korean UI.

## Backend (Lovable Cloud)

Enable Lovable Cloud and create one table `students`:

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | default `gen_random_uuid()` |
| name | text | required |
| academic_year | text | e.g. "2024" |
| department | text | nullable |
| current_stage | text | one of stage keys: `1`,`1.5`,`2`,`2.5`,`3`,`3.5`,`4` |
| completed_stages | text[] | derived/stored |
| checklist_items | jsonb | `{ "1": { "python_vars": true, ... }, ... }` |
| progress_note | text | short markdown-free notes |
| pin_code | text | 4 digits, stored as-is for MVP (see security) |
| created_at | timestamptz | default `now()` |
| last_updated_at | timestamptz | default `now()`, bumped on update |

**RLS policies** (intentional public-read, no-auth model):
- `SELECT`: allow to `anon` and `authenticated`, **excluding `pin_code`** via a view `students_public` that omits the PIN. Components read from the view; PIN check goes through a server function.
- `INSERT`/`UPDATE`/`DELETE`: denied to clients. All writes go through TanStack `createServerFn` handlers that use `supabaseAdmin` after PIN verification.

**Security abstraction:** create `src/lib/pin.ts` with `verifyPin(stored, provided)` and `hashPin(plain)`. MVP implementation = plain compare; swap to bcrypt later without touching call sites. PIN is never sent to the client and never selected by client queries.

## Server functions (`src/lib/students.functions.ts`)

- `listStudents()` — returns rows from `students_public` view
- `getStudent(id)` — single row, no PIN
- `createStudent(input)` — validates with Zod, inserts (PIN required)
- `verifyStudentPin({ id, pin })` — returns `{ ok: boolean }`
- `updateStudent({ id, pin, patch })` — re-verifies PIN server-side, updates, bumps `last_updated_at`
- `deleteStudent({ id, pin })` — re-verifies PIN, deletes

All mutation handlers re-verify the PIN server-side (never trust the client's "I verified earlier" claim).

## Routes (TanStack Start, file-based)

- `src/routes/__root.tsx` — shared shell: top nav with "Lab Progress Board" wordmark, QueryClientProvider, Toaster
- `src/routes/index.tsx` — Dashboard (summary cards + filter bar + student list)
- `src/routes/students.$id.tsx` — Student detail with stage timeline + checklist (read-only view)

Add/Edit/PIN/Delete are **modals** rendered on the current route, not separate pages — matches the "internal tool" feel and keeps URLs clean.

## Stage configuration (`src/lib/stages.ts`)

Single source of truth — typed object with all 7 stages (1, 1.5, 2, 2.5, 3, 3.5, 4), each with: `key`, `title`, `description`, `checklist: { key, label }[]`. All UI iterates this — no hardcoding.

## Components (`src/components/`)

- `DashboardStats` — 4 compact cards: 전체 학부연구생 수 / 평균 진행률 / Stage 3 이상 / Stage 4 달성
- `FilterBar` — search input + academic-year select + stage select
- `StudentTable` — desktop dense table
- `StudentCard` — mobile card (swap via `useIsMobile`)
- `StageBadge` — subtle colored label per stage
- `ProgressBar` — calm bar, percent = completed checklist items / total
- `StageTimeline` — vertical Stage 1 → 4 timeline on detail view
- `ChecklistSection` — per-stage checkbox group (read-only or editable)
- `PinModal` — 4-digit numeric input, calls `verifyStudentPin`, then opens edit form on success
- `StudentForm` — used by both Add and Edit modals
- `ConfirmDialog` — for delete

All built on existing shadcn primitives. No new heavy deps.

## Design tokens (`src/styles.css`)

Replace defaults with a calm academic palette:
- Background: `oklch(0.99 0 0)` near-white
- Foreground: `oklch(0.25 0.01 250)` dark slate
- Primary: muted indigo `oklch(0.45 0.08 260)`
- Borders: soft gray `oklch(0.92 0.005 250)`
- Stage badge colors: 7 muted tints (slate, sage, sand, sky, lavender, amber, deep-indigo) — defined as semantic tokens, no neon
- Radius: `0.5rem`, subtle shadows only on modals
- Typography: system UI stack + Pretendard fallback for Korean (`-apple-system, "Pretendard", "Noto Sans KR", sans-serif`)

## Data flow

TanStack Query for caching: `useQuery(['students'])` on dashboard, `useQuery(['students', id])` on detail. Mutations invalidate the relevant keys. Toast via `sonner` for save success/failure (Korean messages from spec).

## Validation (Zod)

Centralized schemas in `src/lib/schemas.ts`:
- `pin`: `/^\d{4}$/`
- `name`: 1–60 chars
- `academicYear`: 1–10 chars
- `currentStage`: enum of 7 stage keys
- `progressNote`: max 500 chars

Used by both server-fn `inputValidator` and react-hook-form resolver on the client.

## Out of scope (MVP)

- PIN reset / change PIN flow
- Audit log of edits
- Hashed PIN storage (interface is ready; switch later)
- Image/file uploads

## Open question

Only one thing worth confirming before I build: **delete behavior on the student row** — spec says delete lives inside the edit screen. I'll put a red "삭제" button at the bottom of the edit modal that opens a confirm dialog requiring the PIN to already be verified (since edit is gated by PIN). Sound good?

Once approved I'll enable Lovable Cloud, create the table + view + RLS, scaffold all routes/components, and ship the full working MVP in one pass.
