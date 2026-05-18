import type { ChecklistState, StageKey } from "./stages";

export interface Student {
  id: string;
  name: string;
  academicYear: string;
  department: string | null;
  currentStage: StageKey;
  completedStages: StageKey[];
  checklistItems: ChecklistState;
  progressNote: string;
  createdAt: string;
  lastUpdatedAt: string;
}
