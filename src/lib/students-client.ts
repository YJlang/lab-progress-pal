import { supabase } from "@/integrations/supabase/client";
import { isStageKey, DEFAULT_STAGE_STATUSES } from "./stages";
import type { ChecklistState, StageKey, StageStatuses } from "./stages";
import type { Student } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawRow = Record<string, any>;

function mapRow(r: RawRow): Student {
  const _defaultStage: StageKey = "1";
  const currentStage =
    r.current_stage && isStageKey(r.current_stage) ? (r.current_stage as StageKey) : _defaultStage;
  const completed = ((r.completed_stages as string[]) ?? []).filter(isStageKey) as StageKey[];
  const representativeStage =
    r.representative_stage && isStageKey(r.representative_stage)
      ? (r.representative_stage as StageKey)
      : currentStage;

  const rawStatuses = r.stage_statuses as Record<string, string> | null;
  const stageStatuses: StageStatuses = { ...DEFAULT_STAGE_STATUSES };
  if (rawStatuses) {
    for (const key of Object.keys(DEFAULT_STAGE_STATUSES)) {
      const v = rawStatuses[key];
      if (v && ["미시작", "진행 중", "부분 달성", "달성"].includes(v)) {
        (stageStatuses as Record<string, string>)[key] = v;
      }
    }
  }

  return {
    id: r.id ?? "",
    name: r.name ?? "",
    academicYear: r.academic_year ?? "",
    department: r.department,
    currentStage,
    completedStages: completed,
    representativeStage,
    stageStatuses,
    notesByStage: (r.notes_by_stage as Record<string, string>) ?? {},
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
