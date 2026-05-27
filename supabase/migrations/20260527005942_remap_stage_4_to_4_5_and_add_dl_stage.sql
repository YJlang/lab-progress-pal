-- Remap stage key "4" (국내 학회 발표) → "4.5", and introduce a brand-new
-- stage "4" (딥러닝 기초) initialized to "미시작" for every student.
--
-- Why: the lab needs a 딥러닝 기초 checkpoint between the algorithm-solving
-- stage (3.5) and the domestic conference stage. Slotting the new stage at
-- key "4" keeps the natural reading order "4 → 4.5 → 5 → 6" instead of an
-- out-of-order "3.7 → 4" workaround.
--
-- Affects six surfaces on public.students:
--   * stage_statuses  (jsonb)   — rename key "4" → "4.5", add new "4" = "미시작"
--   * notes_by_stage  (jsonb)   — rename key "4" → "4.5"
--   * checklist_items (jsonb)   — rename key "4" → "4.5" (paper_* sub-keys follow)
--   * representative_stage (text) — value '4' → '4.5'
--   * current_stage   (text)   — value '4' → '4.5'
--   * completed_stages (text[]) — array element '4' → '4.5'
--
-- Idempotency: the JSONB rename is guarded by `WHERE (... ? '4') AND NOT (... ? '4.5')`
-- so re-runs after success are no-ops. Supabase wraps each migration in its
-- own transaction, so explicit BEGIN/COMMIT are intentionally omitted to match
-- the project's existing migration style (see 20260524093353).

-- 1. Rename JSONB key "4" → "4.5" across the three jsonb columns.
UPDATE public.students
SET
  stage_statuses = (stage_statuses - '4') || jsonb_build_object('4.5', stage_statuses -> '4'),
  checklist_items = CASE
    WHEN checklist_items ? '4'
      THEN (checklist_items - '4') || jsonb_build_object('4.5', checklist_items -> '4')
    ELSE checklist_items
  END,
  notes_by_stage = CASE
    WHEN notes_by_stage ? '4'
      THEN (notes_by_stage - '4') || jsonb_build_object('4.5', notes_by_stage -> '4')
    ELSE notes_by_stage
  END
WHERE (stage_statuses ? '4') AND NOT (stage_statuses ? '4.5');

-- 2. Text columns that may carry the literal value '4'.
UPDATE public.students
SET representative_stage = '4.5'
WHERE representative_stage = '4';

UPDATE public.students
SET current_stage = '4.5'
WHERE current_stage = '4';

-- 3. Replace '4' with '4.5' inside the completed_stages text[] array.
UPDATE public.students
SET completed_stages = array_replace(completed_stages, '4', '4.5')
WHERE '4' = ANY (completed_stages);

-- 4. Backfill the new stage "4" (딥러닝 기초) as "미시작" for every row.
--    Step 1 dropped the old "4" key from stage_statuses, so this re-adds it
--    with the new meaning. Idempotent via the `?` guard.
UPDATE public.students
SET stage_statuses = stage_statuses || '{"4":"미시작"}'::jsonb
WHERE NOT (stage_statuses ? '4');

-- 5. Update the column DEFAULT so newly inserted students get both keys.
ALTER TABLE public.students
  ALTER COLUMN stage_statuses SET DEFAULT
    '{"1":"미시작","1.5":"미시작","2":"미시작","2.5":"미시작","3":"미시작","3.5":"미시작","4":"미시작","4.5":"미시작","5":"미시작","6":"미시작"}'::jsonb;
