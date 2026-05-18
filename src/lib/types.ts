import type { ChecklistState, StageKey, StageStatuses } from "./stages";

export type { ChecklistState, StageKey, StageStatuses } from "./stages";

export interface Student {
  id: string;
  name: string;
  academicYear: string;
  department: string | null;
  // ── Non-linear tracking ──
  representativeStage: StageKey;
  stageStatuses: StageStatuses;
  notesByStage: Partial<Record<StageKey, string>>;
  // ── Legacy (kept for migration compat, still used) ──
  currentStage: StageKey;
  completedStages: StageKey[];
  // ── Checklist ──
  checklistItems: ChecklistState;
  // ── Metadata ──
  progressNote: string;
  createdAt: string;
  lastUpdatedAt: string;
}
