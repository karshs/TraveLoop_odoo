import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  getStopsHandler,
  addStopHandler,
  updateStopHandler,
  removeStopHandler,
  reorderStopsHandler,
} from "./stop.controller.js";

const router = Router({ mergeParams: true });

// All stop routes require authentication
router.use(authenticate);

router.get("/", getStopsHandler);
router.post("/", addStopHandler);
// IMPORTANT: reorder must come BEFORE :stopId to prevent route conflict
router.patch("/reorder", reorderStopsHandler);
router.patch("/:stopId", updateStopHandler);
router.delete("/:stopId", removeStopHandler);

export default router;
