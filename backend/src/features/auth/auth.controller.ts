import { Request, Response } from "express";
import { signup, login } from "./auth.service.js";
import { handleGoogleCallback } from "./oauth.service.js";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import env from "../../config/env.js";

// ─────────────────────────────────────────────────────────────
//  SIGNUP HANDLER
// ─────────────────────────────────────────────────────────────

export async function signupHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Validate input
    const input = signupSchema.parse({
      ...req.body,
      age: req.body.age ? Number(req.body.age) : undefined, // Coerce age to number
    });

    // Call signup service
    const token = await signup(input);

    // Return success response
    sendSuccess(res, { token }, "User registered successfully", 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      // Validation error
      const errors = error.errors.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      sendError(res, "Validation failed", 400, errors);
    } else if (error.message === "Email already in use") {
      sendError(res, "Email already in use", 409);
    } else {
      sendError(res, error.message || "Signup failed", 500);
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  LOGIN HANDLER
// ─────────────────────────────────────────────────────────────

export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    // Validate input
    const input = loginSchema.parse(req.body);

    // Call login service
    const token = await login(input);

    // Return success response
    sendSuccess(res, { token }, "Login successful");
  } catch (error: any) {
    if (error.name === "ZodError") {
      // Validation error
      const errors = error.errors.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      sendError(res, "Validation failed", 400, errors);
    } else if (
      error.message === "Invalid email or password" ||
      error.message === "Please sign in with Google"
    ) {
      sendError(res, error.message, 401);
    } else {
      sendError(res, error.message || "Login failed", 500);
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
    // Extract profile from Passport (attached by middleware)
    const profile = (req as any).user;

    if (!profile) {
      sendError(res, "No profile data from Google", 400);
      return;
    }

    // Handle profile extraction and validation
    const callbackInput = handleGoogleCallback(profile);

    // Find or create user
    const token = await findOrCreateGoogleUser(callbackInput);

    // Redirect to frontend with JWT in query param
    const redirectUrl = `${env.CLIENT_URL}/auth/callback?token=${token}`;
    res.redirect(redirectUrl);
  } catch (error: any) {
    console.error("Google callback error:", error);

    // Redirect to login with error
    const errorUrl = `${env.CLIENT_URL}/login?error=${encodeURIComponent(
      error.message || "Google authentication failed",
    )}`;
    res.redirect(errorUrl);
  }
}
