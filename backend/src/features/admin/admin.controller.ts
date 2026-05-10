import { Request, Response } from "express";
import { sendSuccess, sendError } from "../../utils/response.js";
import { getPlatformStats, getAllUsers, getAllTrips, getTopCities, getTopActivities } from "./admin.service.js";

export async function getStatsHandler(req: Request, res: Response) {
  try {
    const stats = await getPlatformStats();
    sendSuccess(res, stats, "Stats fetched");
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
}

export async function getUsersHandler(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await getAllUsers(page, limit);
    sendSuccess(res, result, "Users fetched");
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
}

export async function getTripsHandler(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await getAllTrips(page, limit);
    sendSuccess(res, result, "Trips fetched");
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
}

export async function getTopCitiesHandler(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const cities = await getTopCities(limit);
    sendSuccess(res, cities, "Top cities fetched");
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
}

export async function getTopActivitiesHandler(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const activities = await getTopActivities(limit);
    sendSuccess(res, activities, "Top activities fetched");
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
}
