import prisma from "../../config/prisma.js";
import {
  AddStopActivityInput,
  UpdateStopActivityInput,
} from "./stop-activity.validation.js";

export async function getStopActivities(stopId: string, userId: string) {
  // Verify the stop's trip belongs to the user
  const stop = await prisma.tripStop.findFirst({
    where: {
      id: stopId,
      trip: {
        user_id: userId,
        is_deleted: false,
      },
    },
  });

  if (!stop) {
    throw new Error("Stop not found");
  }

  return await prisma.stopActivity.findMany({
    where: {
      stop_id: stopId,
    },
    include: {
      activity: {
        include: {
          city: true,
        },
      },
    },
    orderBy: {
      position: "asc",
    },
  });
}

export async function addStopActivity(
  stopId: string,
  userId: string,
  data: AddStopActivityInput,
) {
  // Verify stop ownership
  const stop = await prisma.tripStop.findFirst({
    where: {
      id: stopId,
      trip: {
        user_id: userId,
        is_deleted: false,
      },
    },
  });

  if (!stop) {
    throw new Error("Stop not found");
  }

  // Verify activity exists
  const activity = await prisma.activity.findUnique({
    where: { id: data.activity_id },
  });

  if (!activity) {
    throw new Error("Activity not found");
  }

  // Check if activity already added to this stop
  const existing = await prisma.stopActivity.findFirst({
    where: {
      stop_id: stopId,
      activity_id: data.activity_id,
    },
  });

  if (existing) {
    throw new Error("Activity already added to this stop");
  }

  return await prisma.stopActivity.create({
    data: {
      stop_id: stopId,
      activity_id: data.activity_id,
      scheduled_date: data.scheduled_date,
      scheduled_time: data.scheduled_time,
      custom_cost: data.custom_cost,
      duration_hours: data.duration_hours,
      notes: data.notes,
      position: data.position,
    },
    include: {
      activity: {
        include: {
          city: true,
        },
      },
    },
  });
}

export async function updateStopActivity(
  id: string,
  stopId: string,
  userId: string,
  data: UpdateStopActivityInput,
) {
  // Verify the stop_activity exists on this stop and the trip belongs to the user
  const stopActivity = await prisma.stopActivity.findFirst({
    where: {
      id,
      stop_id: stopId,
      stop: {
        trip: {
          user_id: userId,
          is_deleted: false,
        },
      },
    },
  });

  if (!stopActivity) {
    throw new Error("Activity not found");
  }

  return await prisma.stopActivity.update({
    where: { id },
    data,
    include: {
      activity: {
        include: {
          city: true,
        },
      },
    },
  });
}

export async function removeStopActivity(
  id: string,
  stopId: string,
  userId: string,
) {
  // Verify ownership
  const stopActivity = await prisma.stopActivity.findFirst({
    where: {
      id,
      stop_id: stopId,
      stop: {
        trip: {
          user_id: userId,
          is_deleted: false,
        },
      },
    },
  });

  if (!stopActivity) {
    throw new Error("Activity not found");
  }

  await prisma.stopActivity.delete({
    where: { id },
  });

  return { message: "Activity removed from stop" };
}
