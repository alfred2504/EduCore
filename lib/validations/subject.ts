import { z } from "zod";

export const updateSubjectSchema = z.object({
  teacherId: z.string().nullable().optional(),
  classId: z.string().optional(),
});

export type UpdateSubject = z.infer<typeof updateSubjectSchema>;
