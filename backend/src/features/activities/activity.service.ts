import { ActivityCategory, Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";

// ─────────────────────────────────────────────────────────────
//  SEARCH ACTIVITIES
// ─────────────────────────────────────────────────────────────

interface SearchActivitiesParams {
  q?: string;
  cityId?: string;
  category?: string;
  maxCost?: number;
  maxDuration?: number;
  page?: number;
  limit?: number;
}

// All valid ActivityCategory enum values — used for input validation
const VALID_CATEGORIES = Object.values(ActivityCategory);

export async function searchActivities(params: SearchActivitiesParams) {
  const { q, cityId, category, maxCost, maxDuration, page = 1 } = params;

  // Cap limit at 50
  const limit = Math.min(params.limit ?? 10, 50);

  // Validate category enum value before building the query
  if (category !== undefined && !VALID_CATEGORIES.includes(category as ActivityCategory)) {
    throw new Error("Invalid category");
  }

  // Build dynamic where clause
  const where: Prisma.ActivityWhereInput = {
    is_active: true,
    ...(q && { name: { contains: q, mode: "insensitive" } }),
    ...(cityId && { city_id: cityId }),
    ...(category && { category: category as ActivityCategory }),
    ...(maxCost !== undefined && !isNaN(maxCost) && { estimated_cost: { lte: maxCost } }),
    ...(maxDuration !== undefined && !isNaN(maxDuration) && { duration_hours: { lte: maxDuration } }),
  };

  const skip = (page - 1) * limit;

  // Run count and data queries in parallel
  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      orderBy: { estimated_cost: "asc" },
      skip,
      take: limit,
      include: {
        city: {
          select: { id: true, name: true, country: true, slug: true },
        },
      },
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    activities,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ─────────────────────────────────────────────────────────────
//  GET ACTIVITY BY ID
// ─────────────────────────────────────────────────────────────

export async function getActivityById(id: string) {
  const activity = await prisma.activity.findFirst({
    where: { id, is_active: true },
    include: { city: true },
  });

  if (!activity) {
    throw new Error("Activity not found");
  }

  return activity;
}
