import prisma from "../../config/prisma.js";
import { hashPassword, comparePassword } from "../../utils/bcrypt.js";
import { signToken } from "../../utils/jwt.js";
import {
  SignupInput,
  LoginInput,
  GoogleCallbackInput,
} from "./auth.validation.js";

// ─────────────────────────────────────────────────────────────
//  SIGNUP SERVICE — Traditional email/password
// ─────────────────────────────────────────────────────────────

export async function signup(data: SignupInput): Promise<string> {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      age: data.age || null,
      password_hash: passwordHash,
      is_verified: false,
    },
  });

  // Return signed JWT
  return signToken(user.id);
}

// ─────────────────────────────────────────────────────────────
//  LOGIN SERVICE — Traditional email/password
// ─────────────────────────────────────────────────────────────

export async function login(data: LoginInput): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if user has a password (might be OAuth-only user)
  if (!user.password_hash) {
    throw new Error("Please sign in with Google");
  }

  // Verify password
  const isPasswordValid = await comparePassword(
    data.password,
    user.password_hash,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Return signed JWT
  return signToken(user.id);
}

// ─────────────────────────────────────────────────────────────
//  FIND OR CREATE GOOGLE USER — OAuth path
// ─────────────────────────────────────────────────────────────

export async function findOrCreateGoogleUser(
  data: GoogleCallbackInput,
): Promise<string> {
  // Try to find user by google_id first
  let user = await prisma.user.findUnique({
    where: { google_id: data.google_id },
  });

  // If not found by google_id, try email
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // If user exists with same email but no google_id, link it
    if (user && !user.google_id) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          google_id: data.google_id,
          oauth_provider: "GOOGLE",
          profile_photo_url: data.picture || null,
          is_verified: true,
        },
      });
    }
  }

  // If still no user, create one
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        google_id: data.google_id,
        oauth_provider: "GOOGLE",
        profile_photo_url: data.picture || null,
        is_verified: true,
        password_hash: null,
      },
    });
  }

  // Return signed JWT
  return signToken(user.id);
}
