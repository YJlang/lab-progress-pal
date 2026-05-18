import { useState } from "react";
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
import { STAGE_KEYS, STAGES, type StageKey } from "@/lib/stages";
import { createStudent } from "@/lib/students.functions";
import { createStudentSchema } from "@/lib/schemas";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function AddStudentModal({ open, onOpenChange }: Props) {
  const qc = useQueryClient();
  const create = useServerFn(createStudent);
  const [form, setForm] = useState({
    name: "",
    academicYear: "",
    department: "",
    representativeStage: "1" as StageKey,
    pin: "",
    pinConfirm: "",
    progressNote: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const m = useMutation({
    mutationFn: (input: typeof form) => create({ data: input }),
    onSuccess: () => {
      toast.success("저장되었습니다.");
      qc.invalidateQueries({ queryKey: ["students"] });
      reset();
      onOpenChange(false);
    },
    onError: (e: Error) =>
      toast.error(e.message || "저장 중 문제가 발생했습니다. 다시 시도해주세요."),
  });

  function reset() {
    setForm({
      name: "",
      academicYear: "",
      department: "",
      representativeStage: "1",
      pin: "",
      pinConfirm: "",
      progressNote: "",
    });
    setErrors({});
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = createStudentSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    m.mutate(form);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>학생 추가</DialogTitle>
          <DialogDescription>
            등록 후 정보 수정을 위해 4자리 PIN이 필요합니다. 잊지 않도록 주의해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Field label="이름" error={errors["name"]}>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={60}
              autoFocus
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="학년도" error={errors["academicYear"]}>
              <Input
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                placeholder="예: 2025"
                maxLength={10}
              />
            </Field>
            <Field label="학과 (선택)" error={errors["department"]}>
              <Input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                maxLength={60}
              />
            </Field>
          </div>
          <Field label="대표 단계">
            <Select
              value={form.representativeStage}
              onValueChange={(v) => setForm({ ...form, representativeStage: v as StageKey })}
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="4자리 PIN" error={errors["pin"]}>
              <Input
                inputMode="numeric"
                value={form.pin}
                onChange={(e) =>
                  setForm({ ...form, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })
                }
                maxLength={4}
                placeholder="••••"
                className="tracking-[0.4em]"
              />
            </Field>
            <Field label="PIN 확인" error={errors["pinConfirm"]}>
              <Input
                inputMode="numeric"
                value={form.pinConfirm}
                onChange={(e) =>
                  setForm({ ...form, pinConfirm: e.target.value.replace(/\D/g, "").slice(0, 4) })
                }
                maxLength={4}
                placeholder="••••"
                className="tracking-[0.4em]"
              />
            </Field>
          </div>
          <Field label="학습 메모 (선택)" error={errors["progressNote"]}>
            <Textarea
              value={form.progressNote}
              onChange={(e) => setForm({ ...form, progressNote: e.target.value })}
              rows={3}
              maxLength={500}
              placeholder="현재 학습 진행 상황을 짧게 남겨주세요."
            />
          </Field>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={m.isPending}>
              {m.isPending ? "저장 중..." : "저장하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
