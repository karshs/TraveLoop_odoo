import { Request, Response } from "express";
import {
  addBudgetItemSchema,
  updateBudgetItemSchema,
} from "./budget.validation.js";
import {
  getBudgetSummary,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  autoGenerateBudget,
} from "./budget.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export async function getBudgetHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const summary = await getBudgetSummary(req.params.tripId, req.user!.id);
    sendSuccess(res, summary, "Budget fetched");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function addBudgetItemHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedData = addBudgetItemSchema.parse(req.body);
    const item = await addBudgetItem(
      req.params.tripId,
      req.user!.id,
      validatedData,
    );
    sendSuccess(res, item, "Budget item added", 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 400);
    }
  }
}

export async function updateBudgetItemHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedData = updateBudgetItemSchema.parse(req.body);
    const item = await updateBudgetItem(
      req.params.itemId,
      req.params.tripId,
      req.user!.id,
      validatedData,
    );
    sendSuccess(res, item, "Budget item updated");
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendError(res, "Validation failed", 400, error.errors);
    } else {
      sendError(res, error.message, 400);
    }
  }
}

export async function deleteBudgetItemHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await deleteBudgetItem(
      req.params.itemId,
      req.params.tripId,
      req.user!.id,
    );
    sendSuccess(res, null, "Budget item deleted");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function autoGenerateBudgetHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await autoGenerateBudget(req.params.tripId, req.user!.id);
    sendSuccess(res, result, "Budget auto-generated");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}
