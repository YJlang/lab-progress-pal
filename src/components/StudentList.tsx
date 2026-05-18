import { Link } from "@tanstack/react-router";
import { Eye, Pencil } from "lucide-react";
import type { Student } from "@/lib/types";
import { overallProgress, countCompletedItems, TOTAL_CHECKLIST_ITEMS } from "@/lib/stages";
import { StageBadge } from "./StageBadge";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

interface RowProps {
  student: Student;
  onEdit: (s: Student) => void;
}

export function StudentTable({ students, onEdit }: { students: Student[]; onEdit: (s: Student) => void }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 text-left font-medium">이름</th>
            <th className="px-4 py-2.5 text-left font-medium">학년도</th>
            <th className="px-4 py-2.5 text-left font-medium">학과</th>
            <th className="px-4 py-2.5 text-left font-medium">현재 단계</th>
            <th className="px-4 py-2.5 text-left font-medium">진행률</th>
            <th className="px-4 py-2.5 text-left font-medium">마지막 수정일</th>
            <th className="px-4 py-2.5 text-right font-medium">동작</th>
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
  const pct = overallProgress(student.checklistItems);
  const done = countCompletedItems(student.checklistItems);
  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
      <td className="px-4 py-3 text-muted-foreground tabular-nums">{student.academicYear}</td>
      <td className="px-4 py-3 text-muted-foreground">{student.department || "—"}</td>
      <td className="px-4 py-3">
        <StageBadge stage={student.currentStage} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <ProgressBar value={pct} className="w-28" />
          <span className="text-xs tabular-nums text-muted-foreground">
            {pct}% · {done}/{TOTAL_CHECKLIST_ITEMS}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground tabular-nums">{formatDate(student.lastUpdatedAt)}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1">
          <Button asChild size="sm" variant="ghost">
            <Link to="/students/$id" params={{ id: student.id }}>
              <Eye className="h-4 w-4" />
              자세히
            </Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(student)}>
            <Pencil className="h-4 w-4" />
            수정
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function StudentCard({ student, onEdit }: RowProps) {
  const pct = overallProgress(student.checklistItems);
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{student.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {student.academicYear} · {student.department || "학과 미입력"}
          </p>
        </div>
        <StageBadge stage={student.currentStage} />
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>진행률</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <ProgressBar value={pct} className="mt-1.5" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground tabular-nums">
          수정 {formatDate(student.lastUpdatedAt)}
        </span>
        <div className="flex gap-1">
          <Button asChild size="sm" variant="ghost">
            <Link to="/students/$id" params={{ id: student.id }}>
              자세히
            </Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(student)}>
            수정
          </Button>
        </div>
      </div>
    </div>
  );
}
