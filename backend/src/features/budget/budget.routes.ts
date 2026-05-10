// Budget routes — all protected
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  getBudgetHandler,
  addBudgetItemHandler,
  updateBudgetItemHandler,
  deleteBudgetItemHandler,
  autoGenerateBudgetHandler,
} from "./budget.controller.js";

const router = Router({ mergeParams: true });

// All budget routes require authentication
router.use(authenticate);

router.get("/", getBudgetHandler);
router.post("/", addBudgetItemHandler);
// IMPORTANT: /auto must come BEFORE /:itemId to prevent route conflict
router.post("/auto", autoGenerateBudgetHandler);
router.patch("/:itemId", updateBudgetItemHandler);
router.delete("/:itemId", deleteBudgetItemHandler);

export default router;
