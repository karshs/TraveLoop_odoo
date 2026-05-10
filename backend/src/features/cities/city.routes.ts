// City routes — public, no auth required
import { Router } from "express";
import { searchCitiesHandler, getCityHandler } from "./city.controller.js";

const router = Router();

router.get("/", searchCitiesHandler);
router.get("/:slug", getCityHandler);

export default router;
