import { z } from "zod";

export const addNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1),
  type: z.enum(["TRIP", "STOP", "DAY"]).default("TRIP"),
  stop_id: z.string().uuid().optional(),
  note_date: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

export const updateNoteSchema = addNoteSchema.partial();

export type AddNoteInput = z.infer<typeof addNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
