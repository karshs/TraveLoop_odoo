import { Request, Response } from "express";
import { createTripSchema, updateTripSchema } from "./trip.validation.js";
import {
  getUserTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  copyTrip,
} from "./trip.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export async function getAllTrips(req: Request, res: Response): Promise<void> {
  try {
    const trips = await getUserTrips(req.user!.id);
    sendSuccess(res, trips, "Trips fetched");
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
}

export async function getTrip(req: Request, res: Response): Promise<void> {
  try {
    const trip = await getTripById(req.params.id, req.user!.id);
    sendSuccess(res, trip, "Trip fetched");
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
}

export async function createTripHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedData = createTripSchema.parse(req.body);
    const trip = await createTrip(req.user!.id, validatedData);
    sendSuccess(res, trip, "Trip created", 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 400);
    }
  }
}

export async function updateTripHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedData = updateTripSchema.parse(req.body);
    const trip = await updateTrip(req.params.id, req.user!.id, validatedData);
    sendSuccess(res, trip, "Trip updated");
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 400);
    }
  }
}

export async function deleteTripHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await deleteTrip(req.params.id, req.user!.id);
    sendSuccess(res, null, "Trip deleted");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function copyTripHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const newTrip = await copyTrip(req.params.id, req.user!.id);
    sendSuccess(res, newTrip, "Trip copied", 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}
