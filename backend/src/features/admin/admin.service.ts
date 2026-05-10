import prisma from "../../config/prisma.js";

export async function getPlatformStats() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalUsers,
    totalTrips,
    publicTrips,
    totalStops,
    totalActivitiesAdded,
    newUsersThisWeek,
    newTripsThisWeek
  ] = await Promise.all([
    prisma.user.count({ where: { is_deleted: false } }),
    prisma.trip.count({ where: { is_deleted: false } }),
    prisma.trip.count({ where: { visibility: "PUBLIC", is_deleted: false } }),
    prisma.tripStop.count(),
    prisma.stopActivity.count(),
    prisma.user.count({ where: { created_at: { gte: sevenDaysAgo } } }),
    prisma.trip.count({ where: { created_at: { gte: sevenDaysAgo } } })
  ]);

  return {
    totalUsers,
    totalTrips,
    publicTrips,
    totalStops,
    totalActivitiesAdded,
    newUsersThisWeek,
    newTripsThisWeek
  };
}

export async function getAllUsers(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        is_verified: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where: { is_deleted: false } })
  ]);

  const totalPages = Math.ceil(total / limit);
  return { users, total, page, limit, totalPages };
}

export async function getAllTrips(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where: { is_deleted: false },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        _count: { select: { stops: true } }
      },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    }),
    prisma.trip.count({ where: { is_deleted: false } })
  ]);

  const totalPages = Math.ceil(total / limit);
  return { trips, total, page, limit, totalPages };
}

export async function getTopCities(limit: number = 10) {
  const topCities = await prisma.tripStop.groupBy({
    by: ["city_id"],
    _count: { city_id: true },
    orderBy: { _count: { city_id: "desc" } },
    take: limit
  });

  const cityIds = topCities.map((t) => t.city_id);
  const cities = await prisma.city.findMany({
    where: { id: { in: cityIds } },
    select: { id: true, name: true, country: true, slug: true }
  });

  return topCities.map((tc) => {
    const city = cities.find((c) => c.id === tc.city_id);
    return {
      city_id: tc.city_id,
      name: city?.name,
      country: city?.country,
      slug: city?.slug,
      trip_count: tc._count.city_id
    };
  });
}

export async function getTopActivities(limit: number = 10) {
  const topActivities = await prisma.stopActivity.groupBy({
    by: ["activity_id"],
    _count: { activity_id: true },
    orderBy: { _count: { activity_id: "desc" } },
    take: limit
  });

  const activityIds = topActivities.map((ta) => ta.activity_id);
  const activities = await prisma.activity.findMany({
    where: { id: { in: activityIds } },
    select: { id: true, name: true, category: true }
  });

  return topActivities.map((ta) => {
    const act = activities.find((a) => a.id === ta.activity_id);
    return {
      activity_id: ta.activity_id,
      name: act?.name,
      category: act?.category,
      added_count: ta._count.activity_id
    };
  });
}
