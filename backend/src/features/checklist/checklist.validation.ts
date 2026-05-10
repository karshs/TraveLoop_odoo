import { z } from "zod";

export const addChecklistItemSchema = z.object({
  label: z.string().min(1),
  category: z.enum(["CLOTHING", "DOCUMENTS", "ELECTRONICS", "TOILETRIES", "MEDICINES", "ACCESSORIES", "MISC"]).default("MISC"),
  position: z.number().int().optional().default(0),
});

export const updateChecklistItemSchema = z.object({
  label: z.string().optional(),
  category: z.enum(["CLOTHING", "DOCUMENTS", "ELECTRONICS", "TOILETRIES", "MEDICINES", "ACCESSORIES", "MISC"]).optional(),
  is_packed: z.boolean().optional(),
  position: z.number().int().optional(),
});

export type AddChecklistItemInput = z.infer<typeof addChecklistItemSchema>;
export type UpdateChecklistItemInput = z.infer<typeof updateChecklistItemSchema>;
