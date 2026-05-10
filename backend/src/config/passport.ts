import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "./env.js";

// ─────────────────────────────────────────────────────────────
//  PASSPORT GOOGLE OAUTH STRATEGY
// ─────────────────────────────────────────────────────────────

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: env.GOOGLE_CALLBACK_URL || "",
    },
    (accessToken, refreshToken, profile, done) => {
      // Do NOT query DB here — just verify and pass profile through
      // DB logic happens in the controller/service layer
      done(null, profile);
    },
  ),
);

export default passport;
