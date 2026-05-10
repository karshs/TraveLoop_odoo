import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  getAllTrips,
  getTrip,
  createTripHandler,
  updateTripHandler,
  deleteTripHandler,
  copyTripHandler,
} from "./trip.controller.js";

const router = Router();

// All trip routes require authentication
router.use(authenticate);

router.get("/", getAllTrips);
router.post("/", createTripHandler);
router.get("/:id", getTrip);
router.patch("/:id", updateTripHandler);
router.delete("/:id", deleteTripHandler);
router.post("/:id/copy", copyTripHandler);

export default router;
