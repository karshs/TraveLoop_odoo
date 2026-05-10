import { z } from "zod";

// ─────────────────────────────────────────────────────────────
//  SIGNUP SCHEMA — Traditional email/password registration
// ─────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional().nullable(),
  age: z
    .number()
    .int()
    .positive("Age must be a positive number")
    .optional()
    .nullable(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type SignupInput = z.infer<typeof signupSchema>;

// ─────────────────────────────────────────────────────────────
//  LOGIN SCHEMA — Traditional email/password login
// ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────────────────────
//  GOOGLE CALLBACK SCHEMA — OAuth Google profile data
// ─────────────────────────────────────────────────────────────

export const googleCallbackSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  google_id: z.string().min(1, "Google ID is required"),
  picture: z.string().url("Invalid picture URL").optional().nullable(),
});

export type GoogleCallbackInput = z.infer<typeof googleCallbackSchema>;
