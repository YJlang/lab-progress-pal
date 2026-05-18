import { Link } from "@tanstack/react-router";
import type { Student } from "@/lib/types";
import { overallProgress } from "@/lib/stages";
import { StageBadge } from "./StageBadge";
import { ProgressBar } from "./ProgressBar";

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

interface RowProps {
  student: Student;
  onEdit: (s: Student) => void;
}

export function StudentTable({
  students,
  onEdit,
}: {
  students: Student[];
  onEdit: (s: Student) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
          <tr>
            <th className="px-3 py-2.5 text-left font-medium">이름</th>
            <th className="px-3 py-2.5 text-left font-medium hidden sm:table-cell">
              학년도
            </th>
            <th className="px-3 py-2.5 text-left font-medium hidden md:table-cell">
              학과
            </th>
            <th className="px-3 py-2.5 text-left font-medium">대표 단계</th>
            <th className="px-3 py-2.5 text-left font-medium hidden lg:table-cell">
              진행률
            </th>
            <th className="px-3 py-2.5 text-left font-medium hidden xl:table-cell">
              단계 현황
            </th>
            <th className="px-3 py-2.5 text-left font-medium hidden lg:table-cell">
              수정일
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {students.map((s) => (
            <TableRow key={s.id} student={s} onEdit={onEdit} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ student, onEdit }: RowProps) {
  const pct = overallProgress(student.stageStatuses, student.checklistItems);

  const compactStatuses = ["1", "1.5", "2", "2.5", "3", "3.5", "4"] as const;
  const statusLabel: Record<string, string> = {
    미시작: "—",
    "진행 중": "△",
    "부분 달성": "◑",
    달성: "●",
  };
  const statusColor: Record<string, string> = {
    미시작: "text-muted-foreground/30",
    "진행 중": "text-amber-500",
    "부분 달성": "text-blue-500",
    달성: "text-emerald-500",
  };

  return (
    <tr
      className="hover:bg-muted/20 cursor-pointer"
      onClick={() => {
        const el = document.querySelector<HTMLAnchorElement>(
          `a[data-student-link="${student.id}"]`,
        );
        el?.click();
      }}
    >
      <td className="px-3 py-2.5">
        <Link
          to="/students/$id"
          params={{ id: student.id }}
          className="font-medium text-foreground hover:underline"
          data-student-link={student.id}
          onClick={(e) => e.stopPropagation()}
        >
          {student.name}
        </Link>
      </td>
      <td className="px-3 py-2.5 text-muted-foreground tabular-nums hidden sm:table-cell">
        {student.academicYear}
      </td>
      <td className="px-3 py-2.5 text-muted-foreground text-xs hidden md:table-cell">
        {student.department || "—"}
      </td>
      <td className="px-3 py-2.5">
        <StageBadge stage={student.representativeStage} />
      </td>
      <td className="px-3 py-2.5 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <ProgressBar value={pct} className="w-20" />
          <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
        </div>
      </td>
      <td className="px-3 py-2.5 hidden xl:table-cell">
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {compactStatuses.map((k) => {
            const s = student.stageStatuses[k] ?? "미시작";
            return (
              <span key={k} className={statusColor[s]} title={`S${k}: ${s}`}>
                {statusLabel[s]}
              </span>
            );
          })}
        </div>
      </td>
      <td className="px-3 py-2.5 text-xs text-muted-foreground tabular-nums hidden lg:table-cell">
        {formatDate(student.lastUpdatedAt)}
      </td>
    </tr>
  );
}

export function StudentCard({ student, onEdit }: RowProps) {
  const pct = overallProgress(student.stageStatuses, student.checklistItems);

  const compactStatuses = ["1", "1.5", "2", "2.5", "3", "3.5", "4"] as const;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            to="/students/$id"
            params={{ id: student.id }}
            className="text-sm font-medium text-foreground hover:underline"
          >
            {student.name}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {student.academicYear}
            {student.department ? ` · ${student.department}` : ""}
          </p>
        </div>
        <StageBadge stage={student.representativeStage} />
      </div>
      <div className="mt-3">
        <ProgressBar value={pct} />
        <span className="mt-1 block text-xs tabular-nums text-muted-foreground">
          {pct}%
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        {compactStatuses.map((k) => {
          const s = student.stageStatuses[k] ?? "미시작";
          const cls =
            s === "달성"
              ? "text-emerald-600 font-medium"
              : s === "부분 달성" || s === "진행 중"
                ? "text-blue-600"
                : "text-muted-foreground/40";
          return (
            <span key={k} className={cls}>
              S{k}
            </span>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {formatDate(student.lastUpdatedAt)}
        </span>
        <Link
          to="/students/$id"
          params={{ id: student.id }}
          className="text-xs text-primary hover:underline"
        >
          자세히
        </Link>
      </div>
    </div>
  );
}
