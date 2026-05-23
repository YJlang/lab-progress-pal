import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import { fetchStudent } from "@/lib/students-client";
import { Button } from "@/components/ui/button";
import { StageBadge } from "@/components/StageBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { ProgressMap } from "@/components/StageTimeline";
import { ChecklistSection } from "@/components/ChecklistSection";
import { EditFlow } from "@/components/EditFlow";
import { overallProgress } from "@/lib/stages";

export const Route = createFileRoute("/students/$id")({
  head: () => ({
    meta: [
      { title: "학생 상세 · INC Lab" },
      { name: "description", content: "INC Lab 학부연구생 상세 progress" },
    ],
  }),
  component: StudentDetail,
});

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function StudentDetail() {
  const { id } = Route.useParams();
  const [editOpen, setEditOpen] = useState(false);

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudent(id),
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      </main>
    );
  }

  if (!student) {
    throw notFound();
  }

  const pct = overallProgress(student.stageStatuses, student.checklistItems);

  return (
    <main className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          전체 현황
        </Link>
      </Button>

      <div className="rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {student.name}
              </h1>
              <StageBadge stage={student.representativeStage} size="md" />
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {student.academicYear}
              {student.department ? ` · ${student.department}` : ""}
            </p>
          </div>
          <Button onClick={() => setEditOpen(true)} size="sm">
            <Pencil className="h-4 w-4" />
            수정하기
          </Button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>전체 Progress</span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <ProgressBar value={pct} className="mt-1.5" />
        </div>

        {student.progressNote && (
          <div className="mt-3 rounded-md border bg-muted/30 p-3">
            <p className="text-sm text-muted-foreground">{student.progressNote}</p>
          </div>
        )}

        <p className="mt-3 text-xs text-muted-foreground tabular-nums">
          마지막 수정일: {formatDate(student.lastUpdatedAt)}
        </p>
      </div>

      <section className="mt-6">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold tracking-tight text-foreground">Progress 기록</h2>
          <span className="text-xs text-muted-foreground">
            단계는 순서와 무관하게 독립적으로 기록됩니다
          </span>
        </div>
        <div className="mt-3">
          <ProgressMap
            stageStatuses={student.stageStatuses}
            checklist={student.checklistItems}
            notesByStage={student.notesByStage}
          />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          단계별 체크리스트
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          수정은 상단의 수정하기 버튼에서 PIN 확인 후 진행할 수 있습니다.
        </p>
        <div className="mt-3">
          <ChecklistSection state={student.checklistItems} readOnly />
        </div>
      </section>

      <EditFlow student={editOpen ? student : null} onClose={() => setEditOpen(false)} />
    </main>
  );
}
