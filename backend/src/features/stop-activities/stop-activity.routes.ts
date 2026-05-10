import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  getStopActivitiesHandler,
  addStopActivityHandler,
  updateStopActivityHandler,
  removeStopActivityHandler,
} from "./stop-activity.controller.js";

const router = Router({ mergeParams: true });

// All stop activity routes require authentication
router.use(authenticate);

router.get("/", getStopActivitiesHandler);
router.post("/", addStopActivityHandler);
router.patch("/:id", updateStopActivityHandler);
router.delete("/:id", removeStopActivityHandler);

export default router;
