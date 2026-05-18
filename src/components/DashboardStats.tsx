import type { Student } from "@/lib/types";
import { overallProgress, countCompletedItems, TOTAL_CHECKLIST_ITEMS } from "@/lib/stages";

interface Props {
  students: Student[];
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function DashboardStats({ students }: Props) {
  const total = students.length;
  const avg =
    total === 0
      ? 0
      : Math.round(students.reduce((s, st) => s + overallProgress(st.checklistItems), 0) / total);
  const stage3plus = students.filter((s) => parseFloat(s.currentStage) >= 3).length;
  const stage4 = students.filter((s) => s.currentStage === "4").length;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Stat label="전체 학부연구생 수" value={`${total}`} hint="명" />
      <Stat label="평균 진행률" value={`${avg}%`} hint={`총 ${TOTAL_CHECKLIST_ITEMS}개 항목 기준`} />
      <Stat label="Stage 3 이상" value={`${stage3plus}`} hint="명" />
      <Stat label="Stage 4 달성" value={`${stage4}`} hint="명" />
    </div>
  );
}

// re-export so tree-shaking on dashboard is simple
export { countCompletedItems };
