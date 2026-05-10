## Phase 2 — Full Plan

### What Gets Built

4 feature modules, 16 files, 20+ endpoints covering the entire trip planning core.

---

### Files To Create

```
src/features/trips/
├── trip.validation.ts
├── trip.service.ts
├── trip.controller.ts
└── trip.routes.ts

src/features/stops/
├── stop.validation.ts
├── stop.service.ts
├── stop.controller.ts
└── stop.routes.ts

src/features/stop-activities/
├── stop-activity.validation.ts
├── stop-activity.service.ts
├── stop-activity.controller.ts
└── stop-activity.routes.ts

src/middleware/
└── auth.middleware.ts     ← protects all Phase 2 routes

Update:
└── src/app.ts             ← mount new routers
```

---

### Endpoints Being Built

**Trips**
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/trips` | Get all user's trips |
| POST | `/api/v1/trips` | Create trip |
| GET | `/api/v1/trips/:id` | Get single trip with stops |
| PATCH | `/api/v1/trips/:id` | Update trip |
| DELETE | `/api/v1/trips/:id` | Soft delete trip |
| POST | `/api/v1/trips/:id/copy` | Deep copy trip |

**Stops**
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/trips/:id/stops` | Get all stops for a trip |
| POST | `/api/v1/trips/:id/stops` | Add stop to trip |
| PATCH | `/api/v1/trips/:id/stops/:stopId` | Update stop |
| DELETE | `/api/v1/trips/:id/stops/:stopId` | Remove stop |
| PATCH | `/api/v1/trips/:id/stops/reorder` | Reorder stops |

**Stop Activities**
| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/stops/:stopId/activities` | Get activities for a stop |
| POST | `/api/v1/stops/:stopId/activities` | Add activity to stop |
| PATCH | `/api/v1/stops/:stopId/activities/:id` | Update activity instance |
| DELETE | `/api/v1/stops/:stopId/activities/:id` | Remove activity from stop |

---

## Agentic Prompt

> You are working on the backend of a PERN stack travel app called Traveloop. Tech stack is Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, Zod for validation, and JWT for auth. The Prisma client singleton is exported from `src/config/prisma.ts`. Response helpers `sendSuccess` and `sendError` are exported from `src/utils/response.ts`. The `signToken` utility is exported from `src/utils/jwt.ts`. Environment variables are exported as `env` from `src/config/env.ts`.
>
> **Task:** Build the complete Phase 2 — Trip APIs. Create all files listed below exactly as specified. After all files are created, update `src/app.ts` to mount the new routers. Run `npx tsc --noEmit` at the end and fix any TypeScript errors before finishing.
>
> ---
>
> ## FILE 1 — `src/middleware/auth.middleware.ts`
>
> Create a middleware function `authenticate` that:
>
> - Reads the `Authorization` header and extracts the Bearer token
> - If no token, calls `sendError(res, "Unauthorized", 401)` and returns
> - Verifies the token using `verifyToken(token)` from `src/utils/jwt.ts` which returns `{ userId: string }` or throws
> - Looks up the user in DB using Prisma: `prisma.user.findUnique({ where: { id: userId } })`
> - If user not found or `is_deleted: true`, calls `sendError(res, "Unauthorized", 401)` and returns
> - Attaches `req.user = user` to the request object
> - Calls `next()`
> - Extend Express `Request` type in `src/types/express.d.ts` to add `user` field typed as Prisma `User`
> - Export `authenticate` as named export
>
> ---
>
> ## FILE 2 — `src/features/trips/trip.validation.ts`
>
> Create the following Zod schemas and export inferred TypeScript types:
>
> **`createTripSchema`**
>
> - `title` — string, min 1 char, required
> - `description` — string, optional
> - `start_date` — string datetime, optional, transform to `new Date()`
> - `end_date` — string datetime, optional, transform to `new Date()`
> - `visibility` — enum of `"PRIVATE"`, `"PUBLIC"`, `"LINK_ONLY"`, defaults to `"PRIVATE"`
> - `budget_limit` — positive number, optional
>
> **`updateTripSchema`**
>
> - All fields from `createTripSchema` but fully optional using `.partial()`
>
> Export types: `CreateTripInput`, `UpdateTripInput`
>
> ---
>
> ## FILE 3 — `src/features/trips/trip.service.ts`
>
> Create the following exported async functions:
>
> **`getUserTrips(userId: string)`**
>
> - Find all trips where `user_id = userId` and `is_deleted = false`
> - Include count of stops: `_count: { select: { stops: true } }`
> - Order by `created_at` descending
> - Return array of trips
>
> **`getTripById(tripId: string, userId: string)`**
>
> - Find trip where `id = tripId`, `user_id = userId`, `is_deleted = false`
> - Include `stops` ordered by `position` ascending, each stop including `city` and `stop_activities` with `activity`
> - If not found, throw `Error("Trip not found")`
> - Return trip
>
> **`createTrip(userId: string, data: CreateTripInput)`**
>
> - Generate a slug: use title + random 6-char suffix, lowercase, spaces replaced with dashes
> - Create trip with all fields including `user_id`, `slug`
> - Return created trip
>
> **`updateTrip(tripId: string, userId: string, data: UpdateTripInput)`**
>
> - Verify trip exists and belongs to user — throw `Error("Trip not found")` if not
> - Update trip with provided fields
> - Return updated trip
>
> **`deleteTrip(tripId: string, userId: string)`**
>
> - Verify trip exists and belongs to user — throw `Error("Trip not found")` if not
> - Soft delete: `update({ data: { is_deleted: true } })`
> - Return `{ message: "Trip deleted" }`
>
> **`copyTrip(tripId: string, userId: string)`**
>
> - Fetch source trip with all stops and their stop_activities
> - If not found or not belonging to user, throw `Error("Trip not found")`
> - Use `prisma.$transaction` to:
>   1. Create new trip with `title: "Copy of ${source.title}"`, new slug, `status: "DRAFT"`, `visibility: "PRIVATE"`
>   2. For each stop, create new TripStop with same `city_id` and `position`
>   3. For each stop_activity in that stop, create new StopActivity on the new stop
> - Return the new trip
>
> ---
>
> ## FILE 4 — `src/features/trips/trip.controller.ts`
>
> Create the following exported async controller functions, each with try/catch:
>
> **`getAllTrips(req, res)`**
>
> - Call `getUserTrips(req.user.id)`
> - Return `sendSuccess(res, trips, "Trips fetched")`
> - Catch: `sendError(res, error.message, 500)`
>
> **`getTrip(req, res)`**
>
> - Call `getTripById(req.params.id, req.user.id)`
> - Return `sendSuccess(res, trip, "Trip fetched")`
> - Catch: `sendError(res, error.message, 404)`
>
> **`createTripHandler(req, res)`**
>
> - Validate `req.body` against `createTripSchema` — on fail `sendError(res, "Validation failed", 400, errors)`
> - Call `createTrip(req.user.id, validatedData)`
> - Return `sendSuccess(res, trip, "Trip created", 201)`
> - Catch: `sendError(res, error.message, 400)`
>
> **`updateTripHandler(req, res)`**
>
> - Validate `req.body` against `updateTripSchema`
> - Call `updateTrip(req.params.id, req.user.id, validatedData)`
> - Return `sendSuccess(res, trip, "Trip updated")`
> - Catch: `sendError(res, error.message, 400)`
>
> **`deleteTripHandler(req, res)`**
>
> - Call `deleteTrip(req.params.id, req.user.id)`
> - Return `sendSuccess(res, null, "Trip deleted")`
> - Catch: `sendError(res, error.message, 400)`
>
> **`copyTripHandler(req, res)`**
>
> - Call `copyTrip(req.params.id, req.user.id)`
> - Return `sendSuccess(res, newTrip, "Trip copied", 201)`
> - Catch: `sendError(res, error.message, 400)`
>
> ---
>
> ## FILE 5 — `src/features/trips/trip.routes.ts`
>
> Create Express router with `authenticate` middleware on all routes:
>
> - `GET /` → `getAllTrips`
> - `POST /` → `createTripHandler`
> - `GET /:id` → `getTrip`
> - `PATCH /:id` → `updateTripHandler`
> - `DELETE /:id` → `deleteTripHandler`
> - `POST /:id/copy` → `copyTripHandler`
>
> Export as default.
>
> ---
>
> ## FILE 6 — `src/features/stops/stop.validation.ts`
>
> Create the following Zod schemas:
>
> **`addStopSchema`**
>
> - `city_id` — string UUID, required
> - `position` — positive integer, required
> - `arrival_date` — string datetime, optional, transform to `new Date()`
> - `departure_date` — string datetime, optional, transform to `new Date()`
> - `notes` — string, optional
>
> **`updateStopSchema`**
>
> - All fields from `addStopSchema` except `city_id`, all optional using `.partial()`
>
> **`reorderStopsSchema`**
>
> - `stops` — array of objects each with `id` (string) and `position` (positive integer)
>
> Export types: `AddStopInput`, `UpdateStopInput`, `ReorderStopsInput`
>
> ---
>
> ## FILE 7 — `src/features/stops/stop.service.ts`
>
> Create the following exported async functions:
>
> **`getStops(tripId: string, userId: string)`**
>
> - Verify trip belongs to user — throw `Error("Trip not found")` if not
> - Find all stops where `trip_id = tripId`, ordered by `position` ascending
> - Include `city` and `stop_activities` with nested `activity`
> - Return stops array
>
> **`addStop(tripId: string, userId: string, data: AddStopInput)`**
>
> - Verify trip belongs to user
> - Verify `city_id` exists in cities table — throw `Error("City not found")` if not
> - Create TripStop with all fields
> - Return created stop with `city` included
>
> **`updateStop(stopId: string, tripId: string, userId: string, data: UpdateStopInput)`**
>
> - Verify stop exists on this trip which belongs to this user — throw `Error("Stop not found")` if not
> - Update stop with provided fields
> - Return updated stop
>
> **`removeStop(stopId: string, tripId: string, userId: string)`**
>
> - Verify ownership — throw `Error("Stop not found")` if not
> - Delete stop: `prisma.tripStop.delete({ where: { id: stopId } })`
> - Return `{ message: "Stop removed" }`
>
> **`reorderStops(tripId: string, userId: string, stops: ReorderStopsInput["stops"])`**
>
> - Verify trip belongs to user
> - Use `prisma.$transaction` to batch update each stop's position
> - Return `{ message: "Stops reordered" }`
>
> ---
>
> ## FILE 8 — `src/features/stops/stop.controller.ts`
>
> Create the following exported async controllers each with try/catch:
>
> **`getStopsHandler`** → calls `getStops(req.params.tripId, req.user.id)` → `sendSuccess`
>
> **`addStopHandler`** → validates `addStopSchema` → calls `addStop` → `sendSuccess 201`
>
> **`updateStopHandler`** → validates `updateStopSchema` → calls `updateStop` → `sendSuccess`
>
> **`removeStopHandler`** → calls `removeStop` → `sendSuccess`
>
> **`reorderStopsHandler`** → validates `reorderStopsSchema` → calls `reorderStops` → `sendSuccess`
>
> All catch blocks: `sendError(res, error.message, 400)`
>
> ---
>
> ## FILE 9 — `src/features/stops/stop.routes.ts`
>
> Mount on `/api/v1/trips/:tripId/stops` — use `authenticate` on all routes:
>
> - `GET /` → `getStopsHandler`
> - `POST /` → `addStopHandler`
> - `PATCH /reorder` → `reorderStopsHandler` — THIS must come BEFORE `/:stopId` to avoid route conflict
> - `PATCH /:stopId` → `updateStopHandler`
> - `DELETE /:stopId` → `removeStopHandler`
>
> Export as default.
>
> ---
>
> ## FILE 10 — `src/features/stop-activities/stop-activity.validation.ts`
>
> Create the following Zod schemas:
>
> **`addStopActivitySchema`**
>
> - `activity_id` — string UUID, required
> - `scheduled_date` — string datetime, optional, transform to `new Date()`
> - `scheduled_time` — string, optional
> - `custom_cost` — non-negative number, optional
> - `duration_hours` — positive number, optional
> - `notes` — string, optional
> - `position` — integer, optional, defaults to `0`
>
> **`updateStopActivitySchema`**
>
> - All fields optional using `.partial()`
>
> Export types: `AddStopActivityInput`, `UpdateStopActivityInput`
>
> ---
>
> ## FILE 11 — `src/features/stop-activities/stop-activity.service.ts`
>
> Create the following exported async functions:
>
> **`getStopActivities(stopId: string, userId: string)`**
>
> - Verify the stop's trip belongs to the user — throw `Error("Stop not found")` if not
> - Find all stop_activities where `stop_id = stopId`, ordered by `position` ascending
> - Include `activity` with `city`
> - Return array
>
> **`addStopActivity(stopId: string, userId: string, data: AddStopActivityInput)`**
>
> - Verify stop ownership
> - Verify `activity_id` exists — throw `Error("Activity not found")` if not
> - Check if activity already added to this stop — throw `Error("Activity already added to this stop")` if duplicate
> - Create StopActivity with all fields
> - Return created record with `activity` included
>
> **`updateStopActivity(id: string, stopId: string, userId: string, data: UpdateStopActivityInput)`**
>
> - Verify the stop_activity exists on this stop and the trip belongs to the user
> - Update with provided fields
> - Return updated record
>
> **`removeStopActivity(id: string, stopId: string, userId: string)`**
>
> - Verify ownership
> - Delete: `prisma.stopActivity.delete({ where: { id } })`
> - Return `{ message: "Activity removed from stop" }`
>
> ---
>
> ## FILE 12 — `src/features/stop-activities/stop-activity.controller.ts`
>
> Create the following exported async controllers each with try/catch:
>
> **`getStopActivitiesHandler`** → calls `getStopActivities(req.params.stopId, req.user.id)` → `sendSuccess`
>
> **`addStopActivityHandler`** → validates `addStopActivitySchema` → calls `addStopActivity` → `sendSuccess 201`
>
> **`updateStopActivityHandler`** → validates `updateStopActivitySchema` → calls `updateStopActivity` → `sendSuccess`
>
> **`removeStopActivityHandler`** → calls `removeStopActivity` → `sendSuccess`
>
> All catch blocks: `sendError(res, error.message, 400)`
>
> ---
>
> ## FILE 13 — `src/features/stop-activities/stop-activity.routes.ts`
>
> Mount on `/api/v1/stops/:stopId/activities` — use `authenticate` on all routes:
>
> - `GET /` → `getStopActivitiesHandler`
> - `POST /` → `addStopActivityHandler`
> - `PATCH /:id` → `updateStopActivityHandler`
> - `DELETE /:id` → `removeStopActivityHandler`
>
> Export as default.
>
> ---
>
> ## FINAL STEP — Update `src/app.ts`
>
> Import and mount the three new routers:
>
> - Trip router at `/api/v1/trips`
> - Stop router at `/api/v1/trips` — note: stop routes already include `/:tripId/stops` in the router
> - Stop activity router at `/api/v1/stops`
>
> Keep all existing middleware and auth routes untouched. Mount new routes after auth routes and before the 404 handler.
>
> ---
>
> ## Verification
>
> After creating all files:
>
> 1. Run `npx tsc --noEmit` — must pass with zero errors
> 2. Fix all TypeScript errors before finishing
> 3. Confirm `reorderStops` route is registered BEFORE `/:stopId` route to prevent Express treating `reorder` as a stopId param
> 4. Confirm `authenticate` middleware is on every route in all three routers
> 5. Confirm `prisma.$transaction` is used in both `copyTrip` and `reorderStops`
