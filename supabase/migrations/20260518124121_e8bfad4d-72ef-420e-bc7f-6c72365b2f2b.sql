
-- Use security_invoker view + column-level grants so RLS is enforced as caller
-- and pin_code cannot be selected from either the view or the underlying table.
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
  progress_note,
  created_at,
  last_updated_at
FROM public.students;

GRANT SELECT ON public.students_public TO anon, authenticated;

-- Column-level grants on the base table: explicitly exclude pin_code
GRANT SELECT (
  id,
  name,
  academic_year,
  department,
  current_stage,
  completed_stages,
  checklist_items,
  progress_note,
  created_at,
  last_updated_at
) ON public.students TO anon, authenticated;

-- RLS policy enabling the SELECT above to actually return rows
CREATE POLICY "Public can read non-pin student columns"
  ON public.students
  FOR SELECT
  TO anon, authenticated
  USING (true);
