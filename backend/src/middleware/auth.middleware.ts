import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";
import prisma from "../config/prisma.js";

// Authentication middleware — verifies JWT and attaches user to request
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    // Verify JWT and extract payload
    const payload = verifyJWT(token);
    if (!payload) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    // Look up user in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    // Check user exists and is not deleted
    if (!user || user.is_deleted) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    // Attach user to request and proceed
    req.user = user;
    next();
  } catch (error) {
    sendError(res, "Unauthorized", 401);
  }
}
