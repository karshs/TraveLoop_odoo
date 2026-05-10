import { Request, Response } from "express";
import { getChecklist, addChecklistItem, updateChecklistItem, deleteChecklistItem, resetChecklist } from "./checklist.service.js";
import { addChecklistItemSchema, updateChecklistItemSchema } from "./checklist.validation.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export async function getChecklistHandler(req: Request, res: Response) {
  try {
    const result = await getChecklist(req.params.tripId, req.user!.id);
    sendSuccess(res, result, "Checklist fetched");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function addChecklistItemHandler(req: Request, res: Response) {
  try {
    const data = addChecklistItemSchema.parse(req.body);
    const result = await addChecklistItem(req.params.tripId, req.user!.id, data);
    sendSuccess(res, result, "Item added", 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function updateChecklistItemHandler(req: Request, res: Response) {
  try {
    const data = updateChecklistItemSchema.parse(req.body);
    const result = await updateChecklistItem(req.params.itemId, req.params.tripId, req.user!.id, data);
    sendSuccess(res, result, "Item updated");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function deleteChecklistItemHandler(req: Request, res: Response) {
  try {
    const result = await deleteChecklistItem(req.params.itemId, req.params.tripId, req.user!.id);
    sendSuccess(res, result, "Item deleted");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function resetChecklistHandler(req: Request, res: Response) {
  try {
    const result = await resetChecklist(req.params.tripId, req.user!.id);
    sendSuccess(res, result, "Checklist reset");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}
