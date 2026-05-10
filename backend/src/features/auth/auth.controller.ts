import { Request, Response } from "express";
import { signup, login } from "./auth.service.js";
import { handleGoogleCallback } from "./oauth.service.js";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { env } from "../../config/env.js";

// ─────────────────────────────────────────────────────────────
//  SIGNUP HANDLER
// ─────────────────────────────────────────────────────────────

export async function signupHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Validate input
    const validatedData = signupSchema.parse({
      ...req.body,
      age: req.body.age ? Number(req.body.age) : undefined,
    });

    // Call signup service
    const token = await signup(validatedData);

    // Return success response
    sendSuccess(res, { token }, "Account created successfully", 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 400);
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  LOGIN HANDLER
// ─────────────────────────────────────────────────────────────

export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);

    // Call login service
    const token = await login(validatedData);

    // Return success response
    sendSuccess(res, { token }, "Login successful");
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 401);
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  GOOGLE CALLBACK HANDLER
// ─────────────────────────────────────────────────────────────

export async function googleCallbackHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Extract profile from Passport middleware
    const profile = (req as any).user;

    // Call oauth service to translate profile and get JWT
    const token = await handleGoogleCallback(profile);

    // Redirect to frontend with JWT in query param
    const redirectUrl = `${env.CLIENT_URL}/auth/callback?token=${token}`;
    res.redirect(redirectUrl);
  } catch (error: any) {
    console.error("Google callback error:", error);

    // Redirect to error page
    const errorUrl = `${env.CLIENT_URL}/auth/error`;
    res.redirect(errorUrl);
  }
}
