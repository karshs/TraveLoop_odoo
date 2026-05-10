import prisma from "../../config/prisma.js";
import { CreateTripInput, UpdateTripInput } from "./trip.validation.js";

// Generate slug from title with random suffix
function generateSlug(title: string): string {
  const random = Math.random().toString(36).substring(2, 8);
  return `${title.toLowerCase().replace(/\s+/g, "-")}-${random}`;
}

export async function getUserTrips(userId: string) {
  return await prisma.trip.findMany({
    where: {
      user_id: userId,
      is_deleted: false,
    },
    include: {
      _count: {
        select: {
          stops: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function getTripById(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      user_id: userId,
      is_deleted: false,
    },
    include: {
      stops: {
        include: {
          city: true,
          stop_activities: {
            include: {
              activity: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!trip) {
    throw new Error("Trip not found");
  }

  return trip;
}

export async function createTrip(userId: string, data: CreateTripInput) {
  const slug = generateSlug(data.title);

  return await prisma.trip.create({
    data: {
      user_id: userId,
      title: data.title,
      slug,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      visibility: data.visibility,
      budget_limit: data.budget_limit,
    },
  });
}

export async function updateTrip(
  tripId: string,
  userId: string,
  data: UpdateTripInput,
) {
  // Verify trip exists and belongs to user
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      user_id: userId,
      is_deleted: false,
    },
  });

  if (!trip) {
    throw new Error("Trip not found");
  }

  return await prisma.trip.update({
    where: { id: tripId },
    data,
  });
}

export async function deleteTrip(tripId: string, userId: string) {
  // Verify trip exists and belongs to user
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      user_id: userId,
      is_deleted: false,
    },
  });

  if (!trip) {
    throw new Error("Trip not found");
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: { is_deleted: true },
  });

  return { message: "Trip deleted" };
}

export async function copyTrip(tripId: string, userId: string) {
  // Fetch source trip with all stops and activities
  const sourceTrip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      user_id: userId,
      is_deleted: false,
    },
    include: {
      stops: {
        include: {
          stop_activities: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!sourceTrip) {
    throw new Error("Trip not found");
  }

  // Use transaction to copy trip with all stops and activities
  const newTrip = await prisma.$transaction(async (tx) => {
    // Create new trip
    const trip = await tx.trip.create({
      data: {
        user_id: userId,
        title: `Copy of ${sourceTrip.title}`,
        slug: generateSlug(`Copy of ${sourceTrip.title}`),
        status: "DRAFT",
        visibility: "PRIVATE",
      },
    });

    // Copy all stops with their activities
    for (const stop of sourceTrip.stops) {
      const newStop = await tx.tripStop.create({
        data: {
          trip_id: trip.id,
          city_id: stop.city_id,
          position: stop.position,
        },
      });

      // Copy stop activities
      for (const activity of stop.stop_activities) {
        await tx.stopActivity.create({
          data: {
            stop_id: newStop.id,
            activity_id: activity.activity_id,
            position: activity.position,
          },
        });
      }
    }

    return trip;
  });

  return newTrip;
}
