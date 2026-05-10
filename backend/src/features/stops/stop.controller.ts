import { Request, Response } from "express";
import {
  addStopSchema,
  updateStopSchema,
  reorderStopsSchema,
} from "./stop.validation.js";
import {
  getStops,
  addStop,
  updateStop,
  removeStop,
  reorderStops,
} from "./stop.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export async function getStopsHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const stops = await getStops(req.params.tripId, req.user!.id);
    sendSuccess(res, stops, "Stops fetched");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function addStopHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedData = addStopSchema.parse(req.body);
    const stop = await addStop(req.params.tripId, req.user!.id, validatedData);
    sendSuccess(res, stop, "Stop added", 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 400);
    }
  }
}

export async function updateStopHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedData = updateStopSchema.parse(req.body);
    const stop = await updateStop(
      req.params.stopId,
      req.params.tripId,
      req.user!.id,
      validatedData,
    );
    sendSuccess(res, stop, "Stop updated");
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 400);
    }
  }
}

export async function removeStopHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await removeStop(req.params.stopId, req.params.tripId, req.user!.id);
    sendSuccess(res, null, "Stop removed");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function reorderStopsHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedData = reorderStopsSchema.parse(req.body);
    await reorderStops(req.params.tripId, req.user!.id, validatedData.stops);
    sendSuccess(res, null, "Stops reordered");
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 400);
    }
  }
}
