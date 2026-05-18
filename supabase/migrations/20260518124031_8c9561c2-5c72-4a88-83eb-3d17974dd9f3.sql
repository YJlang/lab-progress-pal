
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  academic_year text NOT NULL,
  department text,
  current_stage text NOT NULL DEFAULT '1',
  completed_stages text[] NOT NULL DEFAULT '{}',
  checklist_items jsonb NOT NULL DEFAULT '{}'::jsonb,
  progress_note text NOT NULL DEFAULT '',
  pin_code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- No client-side policies: all writes go through server functions
-- using the service role; reads happen through the students_public view.

CREATE OR REPLACE VIEW public.students_public
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

-- Public read on the view: explicitly safe (no pin_code column exposed)
GRANT SELECT ON public.students_public TO anon, authenticated;

-- Add a permissive SELECT policy so the security_invoker view can read rows
-- when queried by anon/authenticated. The view itself omits pin_code.
CREATE POLICY "Public can read student progress"
  ON public.students
  FOR SELECT
  TO anon, authenticated
  USING (true);
