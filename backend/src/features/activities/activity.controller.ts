import { Request, Response } from "express";
import { searchActivities, getActivityById } from "./activity.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

// ─────────────────────────────────────────────────────────────
//  GET /api/v1/activities  — search with filters
// ─────────────────────────────────────────────────────────────

export async function searchActivitiesHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { q, cityId, category } = req.query as Record<string, string>;

    const maxCost = parseFloat(req.query.maxCost as string);
    const maxDuration = parseFloat(req.query.maxDuration as string);
    const page = parseInt((req.query.page as string) ?? "1", 10) || 1;
    const limit = parseInt((req.query.limit as string) ?? "10", 10) || 10;

    const result = await searchActivities({
      q,
      cityId,
      category,
      maxCost,
      maxDuration,
      page,
      limit,
    });

    sendSuccess(res, result, "Activities fetched");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bad request";
    sendError(res, message, 400);
  }
}

// ─────────────────────────────────────────────────────────────
//  GET /api/v1/activities/:id  — single activity detail
// ─────────────────────────────────────────────────────────────

export async function getActivityHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const activity = await getActivityById(id);

    sendSuccess(res, activity, "Activity fetched");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Not found";
    sendError(res, message, 404);
  }
}
