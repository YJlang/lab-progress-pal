import { z } from "zod";
import { STAGE_KEYS } from "./stages";

export const pinSchema = z.string().regex(/^\d{4}$/, "PIN은 4자리 숫자여야 합니다.");

export const stageKeySchema = z.enum(STAGE_KEYS as [string, ...string[]]);

export const stageStatusSchema = z.enum(["미시작", "진행 중", "부분 달성", "달성"]);

export const stageStatusesSchema = z.record(z.string(), stageStatusSchema);

export const createStudentSchema = z
  .object({
    name: z.string().trim().min(1, "이름을 입력해주세요.").max(60),
    academicYear: z.string().trim().min(1, "학년도를 입력해주세요.").max(10),
    department: z.string().trim().max(60).optional().or(z.literal("")),
    representativeStage: stageKeySchema,
    pin: pinSchema,
    pinConfirm: pinSchema,
    progressNote: z.string().max(500).optional().or(z.literal("")),
  })
  .refine((v) => v.pin === v.pinConfirm, {
    message: "PIN이 일치하지 않습니다.",
    path: ["pinConfirm"],
  });

export const updateStudentSchema = z.object({
  id: z.string().uuid(),
  pin: pinSchema,
  patch: z.object({
    name: z.string().trim().min(1).max(60).optional(),
    academicYear: z.string().trim().min(1).max(10).optional(),
    department: z.string().trim().max(60).nullable().optional(),
    representativeStage: stageKeySchema.optional(),
    stageStatuses: stageStatusesSchema.optional(),
    notesByStage: z.record(z.string(), z.string()).optional(),
    currentStage: stageKeySchema.optional(),
    completedStages: z.array(stageKeySchema).optional(),
    checklistItems: z.record(z.string(), z.record(z.string(), z.boolean())).optional(),
    progressNote: z.string().max(500).optional(),
  }),
});

export const verifyPinSchema = z.object({
  id: z.string().uuid(),
  pin: pinSchema,
});

export const deleteStudentSchema = z.object({
  id: z.string().uuid(),
  pin: pinSchema,
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
