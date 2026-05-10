// Admin routes — requires ADMIN role
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireAdmin } from "../../middleware/role.middleware.js";
import { getStatsHandler, getUsersHandler, getTripsHandler, getTopCitiesHandler, getTopActivitiesHandler } from "./admin.controller.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/stats", getStatsHandler);
router.get("/users", getUsersHandler);
router.get("/trips", getTripsHandler);
router.get("/cities/top", getTopCitiesHandler);
router.get("/activities/top", getTopActivitiesHandler);

export default router;
