import { z } from "zod";

export const addBudgetItemSchema = z.object({
  category: z.enum([
    "TRANSPORT",
    "ACCOMMODATION",
    "FOOD",
    "ACTIVITIES",
    "SHOPPING",
    "MISC",
  ]),
  label: z.string().min(1, "Label is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().optional().default("USD"),
  is_actual: z.boolean().optional().default(false),
  date: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const updateBudgetItemSchema = addBudgetItemSchema.partial();

export type AddBudgetItemInput = z.infer<typeof addBudgetItemSchema>;
export type UpdateBudgetItemInput = z.infer<typeof updateBudgetItemSchema>;
