import { z } from "zod";

export const createProcurementSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  amount: z.number().nonnegative(),
  vendorId: z.string().optional(),
});

export type CreateProcurement = z.infer<typeof createProcurementSchema>;
