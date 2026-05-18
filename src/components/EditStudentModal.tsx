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
import { STAGE_KEYS, type StageKey, type ChecklistState } from "@/lib/stages";
import { updateStudent, deleteStudent } from "@/lib/students.functions";
import type { Student } from "@/lib/types";
import { ChecklistSection } from "./ChecklistSection";

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
  const [currentStage, setCurrentStage] = useState<StageKey>(student.currentStage);
  const [completedStages, setCompletedStages] = useState<StageKey[]>(student.completedStages);
  const [checklist, setChecklist] = useState<ChecklistState>(student.checklistItems);
  const [progressNote, setProgressNote] = useState(student.progressNote);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setName(student.name);
      setAcademicYear(student.academicYear);
      setDepartment(student.department ?? "");
      setCurrentStage(student.currentStage);
      setCompletedStages(student.completedStages);
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
            currentStage,
            completedStages,
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
    onError: (e: Error) => toast.error(e.message || "저장 중 문제가 발생했습니다. 다시 시도해주세요."),
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

  function toggleCompleted(k: StageKey, on: boolean) {
    setCompletedStages((prev) =>
      on ? Array.from(new Set([...prev, k])) : prev.filter((s) => s !== k),
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{student.name} 정보 수정</DialogTitle>
            <DialogDescription>
              학생의 기본 정보와 단계별 체크리스트를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="info" className="flex min-h-0 flex-col">
            <TabsList className="self-start">
              <TabsTrigger value="info">기본 정보</TabsTrigger>
              <TabsTrigger value="checklist">단계별 체크리스트</TabsTrigger>
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
                <Field label="현재 단계">
                  <Select value={currentStage} onValueChange={(v) => setCurrentStage(v as StageKey)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGE_KEYS.map((k) => (
                        <SelectItem key={k} value={k}>
                          Stage {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="완료한 단계">
                  <div className="flex flex-wrap gap-2 rounded-md border bg-card p-2">
                    {STAGE_KEYS.map((k) => {
                      const on = completedStages.includes(k);
                      return (
                        <button
                          type="button"
                          key={k}
                          onClick={() => toggleCompleted(k, !on)}
                          className={
                            "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors " +
                            (on
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground hover:bg-muted")
                          }
                        >
                          Stage {k}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <Field label="학습 메모">
                  <Textarea
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    rows={4}
                    maxLength={500}
                  />
                </Field>
              </TabsContent>

              <TabsContent value="checklist">
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
