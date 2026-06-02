import { z } from "zod";

export const createTimetableSchema = z.object({
  classId: z.string(),
  subjectId: z.string(),
  teacherId: z.string().optional(),
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const updateTimetableSchema = createTimetableSchema.partial();

export type CreateTimetable = z.infer<typeof createTimetableSchema>;
