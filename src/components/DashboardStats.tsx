import type { Student } from "@/lib/types";
import { overallProgress } from "@/lib/stages";

interface Props {
  students: Student[];
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 rounded-md border px-3 py-2 min-w-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-base font-semibold tabular-nums text-foreground truncate">
        {value}
      </span>
    </div>
  );
}

export function DashboardStats({ students }: Props) {
  const total = students.length;
  const avg =
    total === 0
      ? 0
      : Math.round(
          students.reduce(
            (s, st) => s + overallProgress(st.stageStatuses, st.checklistItems),
            0,
          ) / total,
        );
  const stage3plus = students.filter(
    (s) =>
      ["달성", "부분 달성", "진행 중"].includes(s.stageStatuses["3"] ?? "미시작") ||
      ["달성", "부분 달성", "진행 중"].includes(s.stageStatuses["3.5"] ?? "미시작"),
  ).length;
  const paperExp = students.filter((s) =>
    ["달성", "부분 달성"].includes(s.stageStatuses["4"] ?? "미시작"),
  ).length;

  return (
    <div className="flex flex-wrap gap-2">
      <Stat label="전체 인원" value={`${total}명`} />
      <Stat label="평균 진행률" value={`${avg}%`} />
      <Stat label="Stage 3+ 역량" value={`${stage3plus}명`} />
      <Stat label="논문/포스터 경험" value={`${paperExp}명`} />
    </div>
  );
}
