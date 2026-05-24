-- Extend stage_statuses to include stages "5" (국제 학회 발표) and "6" (SCIE 논문 제출).

-- 1. Update the column DEFAULT so newly inserted rows include the new stages.
ALTER TABLE public.students
  ALTER COLUMN stage_statuses SET DEFAULT
    '{"1":"미시작","1.5":"미시작","2":"미시작","2.5":"미시작","3":"미시작","3.5":"미시작","4":"미시작","5":"미시작","6":"미시작"}'::jsonb;

-- 2. Backfill existing rows that are missing "5" or "6".
-- Using `||` preserves any pre-existing values on the left-hand side for keys
-- that already exist; the WHERE guard makes this migration idempotent.
UPDATE public.students
SET stage_statuses = stage_statuses || '{"5":"미시작","6":"미시작"}'::jsonb
WHERE NOT (stage_statuses ? '5') OR NOT (stage_statuses ? '6');
