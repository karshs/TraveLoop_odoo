import { z } from "zod";

export const addStopActivitySchema = z.object({
  activity_id: z.string().uuid("Invalid activity ID"),
  scheduled_date: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  scheduled_time: z.string().optional(),
  custom_cost: z.number().nonnegative("Cost cannot be negative").optional(),
  duration_hours: z.number().positive("Duration must be positive").optional(),
  notes: z.string().optional(),
  position: z.number().int().default(0),
});

export const updateStopActivitySchema = addStopActivitySchema.partial();

export type AddStopActivityInput = z.infer<typeof addStopActivitySchema>;
export type UpdateStopActivityInput = z.infer<typeof updateStopActivitySchema>;
