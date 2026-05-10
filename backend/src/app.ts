// Express app setup — middleware and route registration only

import express, { Express, Request, Response } from "express";
import cors from "cors";
import passport from "./config/passport.js";
import { env } from "./config/env.js";
import authRoutes from "./features/auth/auth.routes.js";
import tripRoutes from "./features/trips/trip.routes.js";
import stopRoutes from "./features/stops/stop.routes.js";
import stopActivityRoutes from "./features/stop-activities/stop-activity.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app: Express = express();

// Middleware stack (order matters)
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Trip APIs
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/trips/:tripId/stops", stopRoutes);
app.use("/api/v1/stops/:stopId/activities", stopActivityRoutes);

// Health check
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.json({ success: true, message: "Plannr API is running" });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
