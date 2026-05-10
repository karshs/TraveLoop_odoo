// Passport config — strategy only. No DB logic.
// Verify callback passes raw profile to controller via req.user

import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { env } from "./env.js";

// ─────────────────────────────────────────────────────────────
//  GOOGLE OAUTH 2.0 STRATEGY
// ─────────────────────────────────────────────────────────────

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback,
    ) => {
      // Pass raw profile through — no DB calls, no transformations
      // The profile will be attached to req.user by Passport middleware
      // oauth.service.ts handles translation and validation
      done(null, profile);
    },
  ),
);

export default passport;
