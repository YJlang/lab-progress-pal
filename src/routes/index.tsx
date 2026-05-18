import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { fetchStudents } from "@/lib/students-client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { FilterBar } from "@/components/FilterBar";
import { StageCriteriaReference } from "@/components/StageCriteriaReference";
import { StudentTable, StudentCard } from "@/components/StudentList";
import { AddStudentModal } from "@/components/AddStudentModal";
import { EditFlow } from "@/components/EditFlow";
import type { Student } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "inc lab" },
      {
        name: "description",
        content: "inc lab 소속 학부연구생 progress tracker",
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
  const [paperFilter, setPaperFilter] = useState("__all__");
  const [algoFilter, setAlgoFilter] = useState("__all__");

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const years = useMemo(
    () =>
      Array.from(new Set(students.map((s) => s.academicYear).filter(Boolean)))
        .sort()
        .reverse(),
    [students],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      if (year && s.academicYear !== year) return false;
      if (stage && s.representativeStage !== stage) return false;
      if (
        paperFilter === "yes" &&
        !["달성", "부분 달성"].includes(s.stageStatuses["4"] ?? "미시작")
      )
        return false;
      if (
        paperFilter === "no" &&
        ["달성", "부분 달성"].includes(s.stageStatuses["4"] ?? "미시작")
      )
        return false;
      if (
        algoFilter === "yes" &&
        !["달성", "부분 달성"].includes(s.stageStatuses["3.5"] ?? "미시작")
      )
        return false;
      if (
        algoFilter === "no" &&
        ["달성", "부분 달성"].includes(s.stageStatuses["3.5"] ?? "미시작")
      )
        return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        (s.department ?? "").toLowerCase().includes(q)
      );
    });
  }, [students, search, year, stage, paperFilter, algoFilter]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          inc lab · 학부연구생
        </h1>
        <p className="text-sm text-muted-foreground">
          inc lab 소속 학부연구생들의 학습 진행 상황을 공유하는 보드입니다.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <DashboardStats students={students} />

        <StageCriteriaReference />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              year={year}
              onYearChange={setYear}
              stage={stage}
              onStageChange={setStage}
              years={years}
              paperFilter={paperFilter}
              onPaperFilterChange={setPaperFilter}
              algoFilter={algoFilter}
              onAlgoFilterChange={setAlgoFilter}
            />
          </div>
          <Button
            onClick={() => setAddOpen(true)}
            size="sm"
            className="h-9 text-sm shrink-0"
          >
            <Plus className="h-4 w-4" />
            학생 추가
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
            불러오는 중...
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-lg border bg-card px-4 py-14 text-center">
            <p className="text-sm text-muted-foreground">
              아직 등록된 학부연구생이 없습니다.
            </p>
            <Button className="mt-3" size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              학생 등록
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
