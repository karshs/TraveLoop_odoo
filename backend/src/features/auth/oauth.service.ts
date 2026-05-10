import {
  GoogleCallbackInput,
  googleCallbackSchema,
} from "./auth.validation.js";
import { findOrCreateGoogleUser } from "./auth.service.js";

// ─────────────────────────────────────────────────────────────
//  SINGLE RESPONSIBILITY: Translate raw Passport Google profile
//  into validated input, then exchange for JWT. No DB logic here.
// ─────────────────────────────────────────────────────────────

export async function handleGoogleCallback(
  profile: any,
): Promise<string> {
  // Extract fields from raw Passport profile object
  const google_id = profile.id;
  const email = profile.emails?.[0]?.value;
  const firstName = profile.name?.givenName;
  const lastName = profile.name?.familyName;
  const picture = profile.photos?.[0]?.value;

  // Build callback input shape
  const input = {
    google_id,
    email,
    firstName,
    lastName,
    picture,
  };

  // Validate against schema; throw if invalid
  let validatedData: GoogleCallbackInput;
  try {
    validatedData = googleCallbackSchema.parse(input);
  } catch {
    throw new Error("Invalid Google profile data");
  }

  // Exchange validated data for JWT
  const token = await findOrCreateGoogleUser(validatedData);
  return token;
}
