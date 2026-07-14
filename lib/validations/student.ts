import { z } from "zod";

export const createStudentSchema =
  z.object({
    admissionNumber: z.string().min(3),

    firstName: z.string().min(2),

    lastName: z.string().min(2),

    email: z.string().email().or(z.literal("")).optional(),

    phone: z.string().optional(),

    gender: z.enum([
      "MALE",
      "FEMALE",
    ]),

    dateOfBirth: z.string(),

    address: z.string().optional(),
  });
