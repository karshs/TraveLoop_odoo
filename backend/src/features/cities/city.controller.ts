import { Request, Response } from "express";
import { searchCities, getCityBySlug } from "./city.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

// ─────────────────────────────────────────────────────────────
//  GET /api/v1/cities  — search with filters
// ─────────────────────────────────────────────────────────────

export async function searchCitiesHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { q, country, region, sortBy } = req.query as Record<string, string>;

    const page = parseInt((req.query.page as string) ?? "1", 10) || 1;
    const limit = parseInt((req.query.limit as string) ?? "10", 10) || 10;

    const result = await searchCities({ q, country, region, sortBy, page, limit });

    sendSuccess(res, result, "Cities fetched");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    sendError(res, message, 500);
  }
}

// ─────────────────────────────────────────────────────────────
//  GET /api/v1/cities/:slug  — single city with activities
// ─────────────────────────────────────────────────────────────

export async function getCityHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { slug } = req.params;
    const city = await getCityBySlug(slug);

    sendSuccess(res, city, "City fetched");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Not found";
    sendError(res, message, 404);
  }
}
