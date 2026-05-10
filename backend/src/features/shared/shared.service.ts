// src/features/shared/shared.service.ts
import prisma from "../../config/prisma.js";

export async function getPublicTrip(shareToken: string) {
  const trip = await prisma.trip.findUnique({
    where: { share_token: shareToken, is_deleted: false },
    include: {
      stops: {
        orderBy: { position: "asc" },
        include: {
          city: true,
          stop_activities: {
            include: { activity: true }
          }
        }
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    }
  });

  if (!trip) throw new Error("Trip not found");
  if (trip.visibility === "PRIVATE") throw new Error("This trip is not shared");

  return trip;
}

export async function copyPublicTrip(shareToken: string, userId: string) {
  const tripToCopy = await getPublicTrip(shareToken);

  const slug = `copy-${tripToCopy.id.substring(0, 8)}-${Date.now()}`;

  const newTrip = await prisma.$transaction(async (tx) => {
    const createdTrip = await tx.trip.create({
      data: {
        user_id: userId,
        title: `Copy of ${tripToCopy.title}`,
        slug: slug,
        status: "DRAFT",
        visibility: "PRIVATE",
        description: tripToCopy.description,
        cover_image_url: tripToCopy.cover_image_url,
      }
    });

    if (tripToCopy.stops.length > 0) {
      for (const stop of tripToCopy.stops) {
        const createdStop = await tx.tripStop.create({
          data: {
            trip_id: createdTrip.id,
            city_id: stop.city_id,
            position: stop.position,
            notes: stop.notes,
          }
        });

        if (stop.stop_activities.length > 0) {
          const activitiesData = stop.stop_activities.map(sa => ({
            stop_id: createdStop.id,
            activity_id: sa.activity_id,
            notes: sa.notes,
            position: sa.position,
            custom_cost: sa.custom_cost,
            duration_hours: sa.duration_hours,
          }));
          await tx.stopActivity.createMany({
            data: activitiesData
          });
        }
      }
    }
    
    return createdTrip;
  });

  return newTrip;
}

export async function updateTripVisibility(tripId: string, userId: string, visibility: "PRIVATE" | "PUBLIC" | "LINK_ONLY") {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, user_id: userId, is_deleted: false }
  });

  if (!trip) throw new Error("Trip not found");

  const updatedTrip = await prisma.trip.update({
    where: { id: tripId },
    data: { visibility }
  });

  return updatedTrip;
}
