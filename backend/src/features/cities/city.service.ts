import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";

// ─────────────────────────────────────────────────────────────
//  SEARCH CITIES
// ─────────────────────────────────────────────────────────────

interface SearchCitiesParams {
  q?: string;
  country?: string;
  region?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export async function searchCities(params: SearchCitiesParams) {
  const { q, country, region, sortBy, page = 1, limit = 10 } = params;

  // Build dynamic where clause
  const where: Prisma.CityWhereInput = {
    is_active: true,
    ...(q && { name: { contains: q, mode: "insensitive" } }),
    ...(country && { country: { contains: country, mode: "insensitive" } }),
    ...(region && { region: { contains: region, mode: "insensitive" } }),
  };

  // Build dynamic orderBy
  let orderBy: Prisma.CityOrderByWithRelationInput;
  switch (sortBy) {
    case "cost":
      orderBy = { avg_cost_per_day: "asc" };
      break;
    case "name":
      orderBy = { name: "asc" };
      break;
    case "popularity":
    default:
      orderBy = { popularity_score: "desc" };
  }

  const skip = (page - 1) * limit;

  // Run count and data queries in parallel
  const [cities, total] = await Promise.all([
    prisma.city.findMany({ where, orderBy, skip, take: limit }),
    prisma.city.count({ where }),
  ]);

  return {
    cities,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ─────────────────────────────────────────────────────────────
//  GET CITY BY SLUG
// ─────────────────────────────────────────────────────────────

export async function getCityBySlug(slug: string) {
  const city = await prisma.city.findFirst({
    where: { slug, is_active: true },
    include: {
      activities: {
        where: { is_active: true },
        orderBy: { estimated_cost: "asc" },
      },
    },
  });

  if (!city) {
    throw new Error("City not found");
  }

  return city;
}
