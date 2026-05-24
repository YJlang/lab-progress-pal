import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  STAGE_KEYS,
  STAGES,
  STAGE_STATUS_OPTIONS,
  type StageKey,
  type StageStatuses,
  type StageStatus,
  type ChecklistState,
} from "@/lib/stages";
import { updateStudent, deleteStudent } from "@/lib/students.functions";
import type { Student } from "@/lib/types";
import { ChecklistSection } from "./ChecklistSection";
import { HelpPopover } from "./HelpPopover";

interface Props {
  open: boolean;
  student: Student;
  pin: string;
  onClose: () => void;
}

export function EditStudentModal({ open, student, pin, onClose }: Props) {
  const qc = useQueryClient();
  const update = useServerFn(updateStudent);
  const del = useServerFn(deleteStudent);

  const [name, setName] = useState(student.name);
  const [academicYear, setAcademicYear] = useState(student.academicYear);
  const [department, setDepartment] = useState(student.department ?? "");
  const [representativeStage, setRepresentativeStage] = useState<StageKey>(
    student.representativeStage,
  );
  const [stageStatuses, setStageStatuses] = useState<StageStatuses>(student.stageStatuses);
  const [notesByStage, setNotesByStage] = useState<Partial<Record<StageKey, string>>>(
    student.notesByStage,
  );
  const [checklist, setChecklist] = useState<ChecklistState>(student.checklistItems);
  const [progressNote, setProgressNote] = useState(student.progressNote);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setName(student.name);
      setAcademicYear(student.academicYear);
      setDepartment(student.department ?? "");
      setRepresentativeStage(student.representativeStage);
      setStageStatuses(student.stageStatuses);
      setNotesByStage(student.notesByStage);
      setChecklist(student.checklistItems);
      setProgressNote(student.progressNote);
    }
  }, [open, student]);

  const save = useMutation({
    mutationFn: () =>
      update({
        data: {
          id: student.id,
          pin,
          patch: {
            name,
            academicYear,
            department,
            representativeStage,
            stageStatuses,
            notesByStage: notesByStage as Record<string, string>,
            currentStage: representativeStage,
            completedStages: [],
            checklistItems: checklist as Record<string, Record<string, boolean>>,
            progressNote,
          },
        },
      }),
    onSuccess: () => {
      toast.success("저장되었습니다.");
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", student.id] });
      onClose();
    },
    onError: (e: Error) =>
      toast.error(e.message || "저장 중 문제가 발생했습니다. 다시 시도해주세요."),
  });

  const remove = useMutation({
    mutationFn: () => del({ data: { id: student.id, pin } }),
    onSuccess: () => {
      toast.success("삭제되었습니다.");
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.removeQueries({ queryKey: ["student", student.id] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message || "삭제 중 문제가 발생했습니다."),
  });

  function setStatus(key: StageKey, status: StageStatus) {
    setStageStatuses((prev) => ({ ...prev, [key]: status }));
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{student.name} 정보 수정</DialogTitle>
            <DialogDescription>
              기본 정보, 단계별 상태, 체크리스트를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="info" className="flex min-h-0 flex-col">
            <TabsList className="self-start">
              <TabsTrigger value="info">기본 정보</TabsTrigger>
              <TabsTrigger value="stages">단계별 상태</TabsTrigger>
              <TabsTrigger value="checklist">체크리스트</TabsTrigger>
            </TabsList>

            <div className="mt-3 overflow-y-auto pr-1" style={{ maxHeight: "60vh" }}>
              <TabsContent value="info" className="space-y-3">
                <Field label="이름">
                  <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="학년도">
                    <Input
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      maxLength={10}
                    />
                  </Field>
                  <Field label="학과">
                    <Input
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      maxLength={60}
                    />
                  </Field>
                </div>
                <Field
                  label="대표 단계"
                  help={
                    <HelpPopover title="대표 단계">
                      학생 카드에 표시되는 주요 단계입니다. 현재 가장 활발하게 진행 중이거나
                      대표하고 싶은 단계를 선택해주세요. 진행률 계산에는 영향을 주지 않습니다.
                    </HelpPopover>
                  }
                >
                  <Select
                    value={representativeStage}
                    onValueChange={(v) => setRepresentativeStage(v as StageKey)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGE_KEYS.map((k) => (
                        <SelectItem key={k} value={k}>
                          Stage {k} — {STAGES.find((s) => s.key === k)?.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="학습 메모">
                  <Textarea
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                </Field>
              </TabsContent>

              <TabsContent value="stages" className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  각 단계의 상태를 독립적으로 설정합니다.
                  <span className="ml-1.5 inline-flex align-middle">
                    <HelpPopover title="단계 상태와 진행률" align="start">
                      <p>각 단계는 4가지 상태로 표시합니다:</p>
                      <ul className="mt-1 space-y-0.5 pl-3">
                        <li>미시작 — 시작 전</li>
                        <li>진행 중 — 학습 시작</li>
                        <li>부분 달성 — 핵심은 익혔으나 일부 미흡</li>
                        <li>달성 — 기준을 모두 충족</li>
                      </ul>
                      <p className="mt-2">
                        대표 단계와 별개로 각 단계를 독립적으로 기록할 수 있고, 상태와 체크리스트가
                        함께 전체 진행률에 반영됩니다.
                      </p>
                    </HelpPopover>
                  </span>
                </p>
                {STAGES.map((stage) => (
                  <div key={stage.key} className="rounded-md border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          Stage {stage.key} — {stage.title}
                        </p>
                        <p className="text-xs text-muted-foreground/70 line-clamp-2">
                          {stage.fullDescription}
                        </p>
                      </div>
                      <Select
                        value={stageStatuses[stage.key] ?? "미시작"}
                        onValueChange={(v) => setStatus(stage.key, v as StageStatus)}
                      >
                        <SelectTrigger className="h-8 w-24 text-sm shrink-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGE_STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-2">
                      <Input
                        value={notesByStage[stage.key] ?? ""}
                        onChange={(e) =>
                          setNotesByStage((prev) => ({ ...prev, [stage.key]: e.target.value }))
                        }
                        placeholder={`${stage.title} 관련 메모...`}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="checklist" className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  체크 항목을 표시하면 해당 단계의 진행률이 올라가고, 전체 진행률 평균에도
                  반영됩니다.
                  <span className="ml-1.5 inline-flex align-middle">
                    <HelpPopover title="체크리스트와 진행률" align="start">
                      각 단계별로 세부 학습 항목이 있습니다. 항목을 체크하면 그 단계의 진행률이 100%
                      가까이 올라가고, 모든 단계의 평균이 학생 카드의 전체 진행률로 표시됩니다.
                    </HelpPopover>
                  </span>
                </p>
                <ChecklistSection state={checklist} onChange={setChecklist} />
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-3 flex-row items-center justify-between gap-2 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              삭제
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                취소
              </Button>
              <Button onClick={() => save.mutate()} disabled={save.isPending}>
                {save.isPending ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>학생 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => remove.mutate()}
            >
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Field({
  label,
  children,
  help,
}: {
  label: string;
  children: React.ReactNode;
  help?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
        {help && <span className="ml-1.5 inline-flex align-middle">{help}</span>}
      </Label>
      {children}
    </div>
  );
}
