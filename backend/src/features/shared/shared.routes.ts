// Shared routes — GET public is open, copy and visibility update require auth
import { Router } from "express";
import { getPublicTripHandler, copyPublicTripHandler, updateVisibilityHandler } from "./shared.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/public/:shareToken", getPublicTripHandler);
router.post("/public/:shareToken/copy", authenticate, copyPublicTripHandler);
router.patch("/trips/:tripId/visibility", authenticate, updateVisibilityHandler);

export default router;
