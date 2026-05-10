// Express app setup — middleware and route registration only

import express, { Express, Request, Response } from "express";
import cors from "cors";
import passport from "./config/passport.js";
import { env } from "./config/env.js";
import authRoutes from "./features/auth/auth.routes.js";
import tripRoutes from "./features/trips/trip.routes.js";
import stopRoutes from "./features/stops/stop.routes.js";
import stopActivityRoutes from "./features/stop-activities/stop-activity.routes.js";
import budgetRoutes from "./features/budget/budget.routes.js";
import cityRoutes from "./features/cities/city.routes.js";
import activityRoutes from "./features/activities/activity.routes.js";
import sharedRoutes from "./features/shared/shared.routes.js";
import checklistRoutes from "./features/checklist/checklist.routes.js";
import noteRoutes from "./features/notes/note.routes.js";
import userRoutes from "./features/users/user.routes.js";
import adminRoutes from "./features/admin/admin.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app: Express = express();

// Middleware stack (order matters)
const allowedOrigins = env.CLIENT_URL.split(',').map(o => o.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Trip APIs
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/trips/:tripId/stops", stopRoutes);
app.use("/api/v1/stops/:stopId/activities", stopActivityRoutes);
app.use("/api/v1/trips/:tripId/budget", budgetRoutes);

// Discovery APIs (public)
app.use("/api/v1/cities", cityRoutes);
app.use("/api/v1/activities", activityRoutes);

// User APIs
app.use("/api/v1/users", userRoutes);

// Admin APIs
app.use("/api/v1/admin", adminRoutes);

// Shared & Public APIs
app.use("/api/v1", sharedRoutes);

// Note and Checklist APIs
app.use("/api/v1/trips/:tripId/checklist", checklistRoutes);
app.use("/api/v1/trips/:tripId/notes", noteRoutes);

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
