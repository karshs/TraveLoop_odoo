import { z } from "zod";

export const addStopSchema = z.object({
  city_id: z.string().uuid("Invalid city ID"),
  position: z.number().int().positive("Position must be positive"),
  arrival_date: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  departure_date: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  notes: z.string().optional(),
});

export const updateStopSchema = addStopSchema.omit({ city_id: true }).partial();

export const reorderStopsSchema = z.object({
  stops: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().positive(),
    }),
  ),
});

export type AddStopInput = z.infer<typeof addStopSchema>;
export type UpdateStopInput = z.infer<typeof updateStopSchema>;
export type ReorderStopsInput = z.infer<typeof reorderStopsSchema>;
