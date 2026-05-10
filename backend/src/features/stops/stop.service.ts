import prisma from "../../config/prisma.js";
import {
  AddStopInput,
  UpdateStopInput,
  ReorderStopsInput,
} from "./stop.validation.js";

export async function getStops(tripId: string, userId: string) {
  // Verify trip belongs to user
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

  return await prisma.tripStop.findMany({
    where: {
      trip_id: tripId,
    },
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
  });
}

export async function addStop(
  tripId: string,
  userId: string,
  data: AddStopInput,
) {
  // Verify trip belongs to user
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

  // Verify city exists
  const city = await prisma.city.findUnique({
    where: { id: data.city_id },
  });

  if (!city) {
    throw new Error("City not found");
  }

  return await prisma.tripStop.create({
    data: {
      trip_id: tripId,
      city_id: data.city_id,
      position: data.position,
      arrival_date: data.arrival_date,
      departure_date: data.departure_date,
      notes: data.notes,
    },
    include: {
      city: true,
    },
  });
}

export async function updateStop(
  stopId: string,
  tripId: string,
  userId: string,
  data: UpdateStopInput,
) {
  // Verify stop exists on this trip which belongs to this user
  const stop = await prisma.tripStop.findFirst({
    where: {
      id: stopId,
      trip_id: tripId,
      trip: {
        user_id: userId,
        is_deleted: false,
      },
    },
    include: {
      trip: true,
    },
  });

  if (!stop) {
    throw new Error("Stop not found");
  }

  return await prisma.tripStop.update({
    where: { id: stopId },
    data,
    include: {
      city: true,
    },
  });
}

export async function removeStop(
  stopId: string,
  tripId: string,
  userId: string,
) {
  // Verify ownership
  const stop = await prisma.tripStop.findFirst({
    where: {
      id: stopId,
      trip_id: tripId,
      trip: {
        user_id: userId,
        is_deleted: false,
      },
    },
  });

  if (!stop) {
    throw new Error("Stop not found");
  }

  await prisma.tripStop.delete({
    where: { id: stopId },
  });

  return { message: "Stop removed" };
}

export async function reorderStops(
  tripId: string,
  userId: string,
  stops: ReorderStopsInput["stops"],
) {
  // Verify trip belongs to user
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

  // Use transaction to batch update positions
  await prisma.$transaction(
    stops.map((stop) =>
      prisma.tripStop.update({
        where: { id: stop.id },
        data: { position: stop.position },
      }),
    ),
  );

  return { message: "Stops reordered" };
}
