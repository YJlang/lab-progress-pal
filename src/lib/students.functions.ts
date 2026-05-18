import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  createStudentSchema,
  updateStudentSchema,
  verifyPinSchema,
  deleteStudentSchema,
} from "./schemas";
import { hashPin, verifyPin } from "./pin";
import { DEFAULT_STAGE_STATUSES } from "./stages";

async function loadPin(id: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("students")
    .select("pin_code")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.pin_code ?? null;
}

export const createStudent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createStudentSchema.parse(input))
  .handler(async ({ data }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row: Record<string, any> = {
      name: data.name,
      academic_year: data.academicYear,
      department: data.department?.trim() ? data.department.trim() : null,
      current_stage: data.representativeStage,
      completed_stages: [],
      checklist_items: {},
      stage_statuses: DEFAULT_STAGE_STATUSES,
      representative_stage: data.representativeStage,
      notes_by_stage: {},
      progress_note: data.progressNote ?? "",
      pin_code: hashPin(data.pin),
    };
    const { error } = await supabaseAdmin.from("students").insert(row);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const verifyStudentPin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => verifyPinSchema.parse(input))
  .handler(async ({ data }) => {
    const stored = await loadPin(data.id);
    if (!stored) return { ok: false as const };
    return { ok: verifyPin(stored, data.pin) };
  });

export const updateStudent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => updateStudentSchema.parse(input))
  .handler(async ({ data }) => {
    const stored = await loadPin(data.id);
    if (!stored || !verifyPin(stored, data.pin)) {
      throw new Error("PIN이 올바르지 않습니다.");
    }
    const patch = data.patch;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row: Record<string, any> = { last_updated_at: new Date().toISOString() };
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.academicYear !== undefined) row.academic_year = patch.academicYear;
    if (patch.department !== undefined) {
      row.department = patch.department && patch.department.trim() ? patch.department.trim() : null;
    }
    if (patch.currentStage !== undefined) row.current_stage = patch.currentStage;
    if (patch.completedStages !== undefined) row.completed_stages = patch.completedStages;
    if (patch.checklistItems !== undefined) row.checklist_items = patch.checklistItems;
    if (patch.stageStatuses !== undefined) row.stage_statuses = patch.stageStatuses;
    if (patch.representativeStage !== undefined)
      row.representative_stage = patch.representativeStage;
    if (patch.notesByStage !== undefined) row.notes_by_stage = patch.notesByStage;
    if (patch.progressNote !== undefined) row.progress_note = patch.progressNote;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin.from("students") as any).update(row).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteStudent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => deleteStudentSchema.parse(input))
  .handler(async ({ data }) => {
    const stored = await loadPin(data.id);
    if (!stored || !verifyPin(stored, data.pin)) {
      throw new Error("PIN이 올바르지 않습니다.");
    }
    const { error } = await supabaseAdmin.from("students").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
