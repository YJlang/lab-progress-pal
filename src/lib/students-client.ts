// Client-side read helpers — public data only (PIN excluded via the view).
import { supabase } from "@/integrations/supabase/client";
import type { ChecklistState, StageKey } from "./stages";
import { isStageKey } from "./stages";
import type { Student } from "./types";

type Row = {
  id: string | null;
  name: string | null;
  academic_year: string | null;
  department: string | null;
  current_stage: string | null;
  completed_stages: string[] | null;
  checklist_items: unknown;
  progress_note: string | null;
  created_at: string | null;
  last_updated_at: string | null;
};

function mapRow(r: Row): Student {
  const stage = r.current_stage && isStageKey(r.current_stage) ? (r.current_stage as StageKey) : "1";
  const completed = (r.completed_stages ?? []).filter(isStageKey) as StageKey[];
  return {
    id: r.id ?? "",
    name: r.name ?? "",
    academicYear: r.academic_year ?? "",
    department: r.department,
    currentStage: stage,
    completedStages: completed,
    checklistItems: (r.checklist_items as ChecklistState) ?? {},
    progressNote: r.progress_note ?? "",
    createdAt: r.created_at ?? "",
    lastUpdatedAt: r.last_updated_at ?? "",
  };
}

export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from("students_public")
    .select("*")
    .order("last_updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function fetchStudent(id: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students_public")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapRow(data) : null;
}
