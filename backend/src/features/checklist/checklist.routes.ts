// Checklist routes — all protected
import { Router } from "express";
import { getChecklistHandler, addChecklistItemHandler, updateChecklistItemHandler, deleteChecklistItemHandler, resetChecklistHandler } from "./checklist.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", getChecklistHandler);
router.post("/", addChecklistItemHandler);
router.post("/reset", resetChecklistHandler);
router.patch("/:itemId", updateChecklistItemHandler);
router.delete("/:itemId", deleteChecklistItemHandler);

export default router;
