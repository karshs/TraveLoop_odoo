import { Request, Response } from "express";
import {
  addStopActivitySchema,
  updateStopActivitySchema,
} from "./stop-activity.validation.js";
import {
  getStopActivities,
  addStopActivity,
  updateStopActivity,
  removeStopActivity,
} from "./stop-activity.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export async function getStopActivitiesHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const activities = await getStopActivities(req.params.stopId, req.user!.id);
    sendSuccess(res, activities, "Activities fetched");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function addStopActivityHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedData = addStopActivitySchema.parse(req.body);
    const activity = await addStopActivity(
      req.params.stopId,
      req.user!.id,
      validatedData,
    );
    sendSuccess(res, activity, "Activity added", 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 400);
    }
  }
}

export async function updateStopActivityHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedData = updateStopActivitySchema.parse(req.body);
    const activity = await updateStopActivity(
      req.params.id,
      req.params.stopId,
      req.user!.id,
      validatedData,
    );
    sendSuccess(res, activity, "Activity updated");
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 400);
    }
  }
}

export async function removeStopActivityHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await removeStopActivity(req.params.id, req.params.stopId, req.user!.id);
    sendSuccess(res, null, "Activity removed");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}
