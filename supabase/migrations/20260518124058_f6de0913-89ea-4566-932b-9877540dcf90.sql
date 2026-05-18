
-- Recreate the view without security_invoker so it runs as owner and bypasses RLS,
-- then lock down direct table access from anon/authenticated.
DROP VIEW IF EXISTS public.students_public;

CREATE VIEW public.students_public AS
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

-- Drop the permissive table-level read policy that would expose pin_code
DROP POLICY IF EXISTS "Public can read student progress" ON public.students;

-- Ensure no direct table privileges for browser clients
REVOKE ALL ON public.students FROM anon, authenticated;
