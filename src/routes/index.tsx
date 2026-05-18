import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { fetchStudents } from "@/lib/students-client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { FilterBar } from "@/components/FilterBar";
import { StudentTable, StudentCard } from "@/components/StudentList";
import { AddStudentModal } from "@/components/AddStudentModal";
import { EditFlow } from "@/components/EditFlow";
import type { Student } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "전체 현황 · Lab Progress Board" },
      {
        name: "description",
        content:
          "학부연구생의 현재 학습 단계와 진행률을 한눈에 확인할 수 있는 연구실 내부 공유 보드.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const isMobile = useIsMobile();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [stage, setStage] = useState("");

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const years = useMemo(
    () => Array.from(new Set(students.map((s) => s.academicYear).filter(Boolean))).sort().reverse(),
    [students],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      if (year && s.academicYear !== year) return false;
      if (stage && s.currentStage !== stage) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        (s.department ?? "").toLowerCase().includes(q)
      );
    });
  }, [students, search, year, stage]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          학부연구생 Progress Board
        </h1>
        <p className="text-sm text-muted-foreground">
          Undergraduate Research Assistant Learning Progress
        </p>
        <p className="max-w-3xl text-sm text-muted-foreground">
          학부연구생의 현재 학습 단계와 연구실 적응 Progress를 한눈에 확인하기 위한 내부 공유 보드입니다.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <DashboardStats students={students} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              year={year}
              onYearChange={setYear}
              stage={stage}
              onStageChange={setStage}
              years={years}
            />
          </div>
          <Button onClick={() => setAddOpen(true)} className="self-stretch sm:self-auto">
            <Plus className="h-4 w-4" />
            학생 추가
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
            불러오는 중...
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card px-4 py-14 text-center">
            <p className="text-sm text-muted-foreground">아직 등록된 학부연구생이 없습니다.</p>
            <Button className="mt-4" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              첫 번째 학생 추가하기
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </div>
        ) : isMobile ? (
          <div className="grid gap-3">
            {filtered.map((s) => (
              <StudentCard key={s.id} student={s} onEdit={setEditing} />
            ))}
          </div>
        ) : (
          <StudentTable students={filtered} onEdit={setEditing} />
        )}
      </div>

      <AddStudentModal open={addOpen} onOpenChange={setAddOpen} />
      <EditFlow student={editing} onClose={() => setEditing(null)} />
    </main>
  );
}
