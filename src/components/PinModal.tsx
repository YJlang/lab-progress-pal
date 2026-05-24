import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { verifyStudentPin } from "@/lib/students.functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  studentId: string;
  studentName: string;
  onCancel: () => void;
  onVerified: (pin: string) => void;
}

export function PinModal({ open, studentId, studentName, onCancel, onVerified }: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const verify = useServerFn(verifyStudentPin);
  const m = useMutation({
    mutationFn: (p: string) => verify({ data: { id: studentId, pin: p } }),
    onSuccess: (res, p) => {
      if (res.ok) {
        setPin("");
        setError(null);
        onVerified(p);
      } else {
        setError("PIN이 올바르지 않습니다.");
      }
    },
    onError: () => setError("PIN이 올바르지 않습니다."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      setError("4자리 숫자를 입력해주세요.");
      return;
    }
    m.mutate(pin);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setPin("");
          setError(null);
          onCancel();
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>PIN 입력</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{studentName}</span> 정보를 수정하려면
            4자리 PIN을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            autoFocus
            value={pin}
            onChange={(e) => {
              setError(null);
              setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
            }}
            placeholder="••••"
            className="text-center text-lg tracking-[0.5em]"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">PIN을 잊으셨다면 운영자에게 문의해주세요.</p>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" disabled={m.isPending}>
              {m.isPending ? "확인 중..." : "확인"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
