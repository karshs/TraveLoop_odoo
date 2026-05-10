// src/features/shared/shared.controller.ts
import { Request, Response } from "express";
import { getPublicTrip, copyPublicTrip, updateTripVisibility } from "./shared.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { z } from "zod";

export async function getPublicTripHandler(req: Request, res: Response) {
  try {
    const { shareToken } = req.params;
    const trip = await getPublicTrip(shareToken);
    sendSuccess(res, trip, "Trip fetched");
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
}

export async function copyPublicTripHandler(req: Request, res: Response) {
  try {
    const { shareToken } = req.params;
    const newTrip = await copyPublicTrip(shareToken, req.user!.id);
    sendSuccess(res, newTrip, "Trip copied", 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function updateVisibilityHandler(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const visibility = z.enum(["PRIVATE", "PUBLIC", "LINK_ONLY"]).parse(req.body.visibility);
    const trip = await updateTripVisibility(tripId, req.user!.id, visibility);
    sendSuccess(res, trip, "Visibility updated");
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Invalid visibility value", 400);
    } else {
      sendError(res, error.message, 400);
    }
  }
}
