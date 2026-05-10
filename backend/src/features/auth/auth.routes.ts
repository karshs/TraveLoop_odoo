import { Router } from "express";
import passport from "passport";
import {
  signupHandler,
  loginHandler,
  googleCallbackHandler,
} from "./auth.controller.js";

const router = Router();

// ─────────────────────────────────────────────────────────────
//  TRADITIONAL AUTH ROUTES
// ─────────────────────────────────────────────────────────────

// POST /api/v1/auth/signup
router.post("/signup", signupHandler);

// POST /api/v1/auth/login
router.post("/login", loginHandler);

// ─────────────────────────────────────────────────────────────
//  GOOGLE OAUTH ROUTES
// ─────────────────────────────────────────────────────────────

// GET /api/v1/auth/google
// Initiates Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// GET /api/v1/auth/google/callback
// Google redirects here after user approves
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login?error=auth_failed",
  }),
  googleCallbackHandler,
);

export default router;
