import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return sendError(res, "Forbidden", 403);
  }
  next();
}
