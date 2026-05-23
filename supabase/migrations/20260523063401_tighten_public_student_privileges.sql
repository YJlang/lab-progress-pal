-- Restrict browser roles to the read-only surface used by the app.
REVOKE ALL ON TABLE public.students FROM anon, authenticated;
REVOKE ALL ON TABLE public.students_public FROM anon, authenticated;

GRANT SELECT ON public.students_public TO anon, authenticated;

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
