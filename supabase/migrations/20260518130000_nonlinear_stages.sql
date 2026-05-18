
-- Add non-linear stage tracking columns to students table.
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS stage_statuses jsonb NOT NULL DEFAULT '{
    "1": "미시작",
    "1.5": "미시작",
    "2": "미시작",
    "2.5": "미시작",
    "3": "미시작",
    "3.5": "미시작",
    "4": "미시작"
  }'::jsonb,
  ADD COLUMN IF NOT EXISTS representative_stage text NOT NULL DEFAULT '1',
  ADD COLUMN IF NOT EXISTS notes_by_stage jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Rebuild the public view to include new columns (still no pin_code).
DROP VIEW IF EXISTS public.students_public;
CREATE VIEW public.students_public
WITH (security_invoker = true) AS
SELECT
  id,
  name,
  academic_year,
  department,
  current_stage,
  completed_stages,
  checklist_items,
  stage_statuses,
  representative_stage,
  notes_by_stage,
  progress_note,
  created_at,
  last_updated_at
FROM public.students;

GRANT SELECT ON public.students_public TO anon, authenticated;

-- Update column-level grants on the base table.
GRANT SELECT (
  id,
  name,
  academic_year,
  department,
  current_stage,
  completed_stages,
  checklist_items,
  stage_statuses,
  representative_stage,
  notes_by_stage,
  progress_note,
  created_at,
  last_updated_at
) ON public.students TO anon, authenticated;
