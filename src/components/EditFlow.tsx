import { useState } from "react";
import { PinModal } from "./PinModal";
import { EditStudentModal } from "./EditStudentModal";
import type { Student } from "@/lib/types";

interface Props {
  student: Student | null;
  onClose: () => void;
}

/**
 * Two-step edit flow: PIN modal -> edit modal.
 * Render this once at the page level; control by setting `student` to non-null.
 */
export function EditFlow({ student, onClose }: Props) {
  const [verifiedPin, setVerifiedPin] = useState<string | null>(null);

  if (!student) return null;

  if (!verifiedPin) {
    return (
      <PinModal
        open
        studentId={student.id}
        studentName={student.name}
        onCancel={onClose}
        onVerified={(p) => setVerifiedPin(p)}
      />
    );
  }

  return (
    <EditStudentModal
      open
      student={student}
      pin={verifiedPin}
      onClose={() => {
        setVerifiedPin(null);
        onClose();
      }}
    />
  );
}
