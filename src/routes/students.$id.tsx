import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import { fetchStudent } from "@/lib/students-client";
import { Button } from "@/components/ui/button";
import { StageBadge } from "@/components/StageBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { StageTimeline } from "@/components/StageTimeline";
import { ChecklistSection } from "@/components/ChecklistSection";
import { EditFlow } from "@/components/EditFlow";
import { overallProgress, countCompletedItems, TOTAL_CHECKLIST_ITEMS } from "@/lib/stages";

export const Route = createFileRoute("/students/$id")({
  head: () => ({
    meta: [
      { title: "학생 상세 · Lab Progress Board" },
      { name: "description", content: "학부연구생 학습 단계 상세 보기" },
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
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      </main>
    );
  }

  if (!student) {
    throw notFound();
  }

  const pct = overallProgress(student.checklistItems);
  const done = countCompletedItems(student.checklistItems);

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          전체 현황
        </Link>
      </Button>

      <div className="rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {student.name}
              </h1>
              <StageBadge stage={student.currentStage} size="md" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {student.academicYear} · {student.department || "학과 미입력"}
            </p>
          </div>
          <Button onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            수정하기
          </Button>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>진행률</span>
            <span className="tabular-nums">
              {pct}% · {done} / {TOTAL_CHECKLIST_ITEMS}
            </span>
          </div>
          <ProgressBar value={pct} className="mt-2" />
        </div>

        {student.progressNote && (
          <div className="mt-5 rounded-md border bg-muted/40 p-3">
            <p className="text-xs font-medium text-muted-foreground">학습 메모</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
              {student.progressNote}
            </p>
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground tabular-nums">
          마지막 수정일: {formatDate(student.lastUpdatedAt)}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">연구 준비 단계</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Stage 1부터 Stage 4까지의 학습 흐름과 현재 위치를 확인할 수 있습니다.
        </p>
        <div className="mt-4 rounded-lg border bg-card p-5">
          <StageTimeline
            currentStage={student.currentStage}
            completedStages={student.completedStages}
            checklist={student.checklistItems}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">단계별 체크리스트</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          수정은 상단의 수정하기 버튼에서 PIN 확인 후 진행할 수 있습니다.
        </p>
        <div className="mt-4">
          <ChecklistSection state={student.checklistItems} readOnly />
        </div>
      </section>

      <EditFlow student={editOpen ? student : null} onClose={() => setEditOpen(false)} />
    </main>
  );
}
