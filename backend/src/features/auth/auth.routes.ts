// Auth routes — wiring only. No logic here.

import { Router } from "express";
import passport from "../../config/passport.js";
import {
  signupHandler,
  loginHandler,
  googleCallbackHandler,
} from "./auth.controller.js";

const router = Router();

// POST /signup
router.post("/signup", signupHandler);

// POST /login
router.post("/login", loginHandler);

// GET /google — initiates Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// GET /google/callback — Google redirects here after approval
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/v1/auth/error",
  }),
  googleCallbackHandler,
);

export default router;
