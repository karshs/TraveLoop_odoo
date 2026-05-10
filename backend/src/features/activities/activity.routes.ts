// Activity routes — public, no auth required
import { Router } from "express";
import { searchActivitiesHandler, getActivityHandler } from "./activity.controller.js";

const router = Router();

router.get("/", searchActivitiesHandler);
router.get("/:id", getActivityHandler);

export default router;
