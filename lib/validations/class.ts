import { z } from "zod";

export const createClassSchema =
  z.object({
    name: z.string().min(2),

    level: z.string().min(1),

    capacity: z.coerce.number(),

    academicYearId: z.string().min(1, "Academic year is required"),
  });