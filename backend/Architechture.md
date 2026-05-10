# Traveloop — Backend Architecture & Database Design

---

## 1. High-Level Architecture

```
Client (React)
    │
    ▼
Express.js Server
    ├── Routes (feature-based)
    ├── Middleware (auth, validation, error handler)
    ├── Controllers (request/response)
    ├── Services (business logic)
    └── Prisma ORM
            │
            ▼
        PostgreSQL
```

**Design philosophy:** Feature-based folder structure, not MVC layers. Every feature owns its routes, controller, service, and validation — making it easy to add/remove features without touching unrelated code.

---

## 2. ERD — Entity Relationship Overview

```
User ──< Trip ──< TripStop >── City
                   │
                   ├──< StopActivity >── Activity
                   │                        │
                   │                       City (belongs to)
                   │
Trip ──< BudgetItem
Trip ──< ChecklistItem
Trip ──< TripNote >── TripStop (optional)
City ──< Activity
```

**Key relationships:**

- A **User** owns many **Trips** (1:N)
- A **Trip** has many **TripStops** representing the multi-city route (1:N)
- Each **TripStop** references a **City** from the catalog (N:1)
- A **TripStop** has many **StopActivities** — the junction between a stop and the Activity catalog (M:N via junction)
- A **Trip** has many **BudgetItems** (1:N)
- A **Trip** has many **ChecklistItems** (1:N)
- A **Trip** has many **TripNotes**, optionally tied to a **TripStop** (1:N with optional FK)

---

## 3. Table-by-Table Explanation

### `users`

Core user record. Stores hashed password, soft delete flag, reset/verify tokens.

- `is_deleted` soft-delete so you never orphan trip data
- `reset_token` + `reset_token_expiry` handles forgot-password flow
- `language_pref` for i18n readiness

### `cities`

Pre-seeded catalog of destinations. Users search this, they don't create city records.

- `slug` used in URLs: `/cities/paris-france`
- `popularity_score` + `avg_cost_per_day` power search sorting and budget estimation
- `latitude/longitude` ready for map integrations

### `activities`

Pre-seeded activity catalog per city. Users browse/select from this.

- Linked to a city via `city_id`
- `category` enum makes filtering fast
- `estimated_cost` + `duration_hours` feed the budget system automatically

### `trips`

The core user artifact. A trip is the top-level container.

- `slug` is generated on creation (e.g. `europe-summer-a3f9`) — used for public URLs
- `share_token` is a UUID generated at creation, used for LINK_ONLY sharing (`/shared/:token`)
- `visibility` controls who can see: PRIVATE | PUBLIC | LINK_ONLY
- `budget_limit` lets the frontend show over-budget warnings
- `is_deleted` soft delete — user can "undo" or admin can restore

### `trip_stops`

One row per city in a trip's route. Controls the multi-city itinerary.

- `position` stores ordering (1, 2, 3...) — frontend reorders by updating these integers
- `arrival_date` + `departure_date` define how long the user stays
- `@@unique([trip_id, position])` prevents duplicate ordering slots

### `stop_activities`

Junction table between TripStop and Activity.

- Stores per-instance overrides: `custom_cost`, `duration_hours`
- `scheduled_date` + `scheduled_time` for day-wise planning
- `position` allows ordering activities within a stop
- `@@unique([stop_id, activity_id])` prevents duplicate activity on same stop

### `budget_items`

Individual expense lines. Can be estimated or actual.

- `is_actual` flag: `false` = estimated (auto-calculated), `true` = user confirmed/spent
- `category` matches the frontend breakdown chart (transport, stay, food, activities, etc.)
- Budget total = SUM of all `budget_items.amount` for a trip

### `checklist_items`

Per-trip packing list. Simple and categorized.

- `is_packed` toggled by user
- `position` for drag-to-reorder
- `category` enables grouped display (Clothing, Docs, Electronics...)
- Reset = set all `is_packed = false` in one UPDATE

### `trip_notes`

Flexible note system. A note can belong to a whole trip, a specific stop, or a specific day.

- `type` enum: TRIP | STOP | DAY
- `stop_id` is nullable — trip-level notes don't need it
- `note_date` enables day-specific reminders
- `is_deleted` soft delete

---

## 4. Prisma Schema Key Decisions

| Decision    | Choice                                    | Reason                                                                     |
| ----------- | ----------------------------------------- | -------------------------------------------------------------------------- |
| ID strategy | UUID                                      | Avoids enumerable IDs in public URLs, future-proof for distributed systems |
| Timestamps  | `created_at`, `updated_at` on every table | Audit trail, sorting, soft-delete logic                                    |
| Soft delete | `is_deleted` on User, Trip, TripNote      | Prevents data loss; allows undo                                            |
| Share token | UUID stored on Trip                       | Opaque, unguessable sharing link                                           |
| Slug        | On City + Trip                            | Clean public URLs, SEO-friendly                                            |
| Currency    | Stored per BudgetItem                     | Ready for multi-currency support                                           |
| ORM         | Prisma                                    | Type-safe, great DX, strong migration tooling                              |

---

## 5. Indexing Strategy

```sql
-- Frequently queried lookups
users:          email           (unique login lookup)
cities:         name+country    (search), slug (URL), country+region (filter)
activities:     city_id         (load activities for a city), category (filter)
trips:          user_id         (load user's trips), share_token (public link), slug
trip_stops:     trip_id         (load stops for a trip), city_id
stop_activities: stop_id, activity_id
budget_items:   trip_id, trip_id+category (budget breakdown query)
checklist_items: trip_id, trip_id+category
trip_notes:     trip_id, trip_id+stop_id, user_id
```

**Rule of thumb used here:** Index every foreign key. Add composite indexes where you consistently filter by two columns together (e.g. `trip_id + category` for budget breakdown).

---

## 6. Budget Calculation Strategy

Don't store a "total" on the trip. Calculate it dynamically:

```sql
-- Total estimated budget for a trip
SELECT SUM(amount) FROM budget_items WHERE trip_id = $1;

-- Breakdown by category
SELECT category, SUM(amount) as total
FROM budget_items
WHERE trip_id = $1
GROUP BY category;

-- Auto-populate budget items from stop activities
-- When user adds a StopActivity, create/update a BudgetItem(category=ACTIVITIES, amount=custom_cost ?? estimated_cost)
```

This keeps budget_items as the single source of truth. The frontend just queries it and renders the pie chart.

---

## 7. Public Sharing Design

```
Trip.visibility = LINK_ONLY
Trip.share_token = "f47ac10b-58cc-..." (UUID, generated at creation)

Public URL: GET /api/v1/shared/:share_token
- No auth required
- Returns trip + stops + activities (read-only projection)
- Does NOT return user private data
```

For LINK_ONLY trips: only someone with the exact token can view.
For PUBLIC trips: appears in explore/public feed (future feature).

---

## 8. Scalable Folder Structure

```
traveloop-backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                  ← cities + activities seed data
│
├── src/
│   ├── app.ts                   ← Express app setup, middleware registration
│   ├── server.ts                ← Entry point, listen
│   │
│   ├── config/
│   │   ├── env.ts               ← Zod-validated env variables
│   │   ├── prisma.ts            ← PrismaClient singleton
│   │   └── cloudinary.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts   ← JWT verify, attach req.user
│   │   ├── role.middleware.ts   ← isAdmin guard
│   │   ├── validate.middleware.ts ← Zod schema validation
│   │   └── error.middleware.ts  ← Global error handler
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── bcrypt.ts
│   │   ├── slug.ts              ← generateSlug(title)
│   │   ├── token.ts             ← generateResetToken()
│   │   ├── response.ts          ← sendSuccess / sendError helpers
│   │   └── upload.ts            ← Multer + Cloudinary
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.routes.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.validation.ts
│   │   │
│   │   ├── trips/
│   │   │   ├── trip.routes.ts
│   │   │   ├── trip.controller.ts
│   │   │   ├── trip.service.ts
│   │   │   └── trip.validation.ts
│   │   │
│   │   ├── stops/
│   │   │   ├── stop.routes.ts
│   │   │   ├── stop.controller.ts
│   │   │   ├── stop.service.ts
│   │   │   └── stop.validation.ts
│   │   │
│   │   ├── activities/
│   │   │   ├── activity.routes.ts
│   │   │   ├── activity.controller.ts
│   │   │   ├── activity.service.ts
│   │   │   └── activity.validation.ts
│   │   │
│   │   ├── cities/
│   │   │   ├── city.routes.ts
│   │   │   ├── city.controller.ts
│   │   │   └── city.service.ts
│   │   │
│   │   ├── budget/
│   │   │   ├── budget.routes.ts
│   │   │   ├── budget.controller.ts
│   │   │   ├── budget.service.ts
│   │   │   └── budget.validation.ts
│   │   │
│   │   ├── checklist/
│   │   │   ├── checklist.routes.ts
│   │   │   ├── checklist.controller.ts
│   │   │   ├── checklist.service.ts
│   │   │   └── checklist.validation.ts
│   │   │
│   │   ├── notes/
│   │   │   ├── note.routes.ts
│   │   │   ├── note.controller.ts
│   │   │   ├── note.service.ts
│   │   │   └── note.validation.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── shared.routes.ts  ← Public, no auth
│   │   │   └── shared.controller.ts
│   │   │
│   │   └── admin/
│   │       ├── admin.routes.ts
│   │       ├── admin.controller.ts
│   │       └── admin.service.ts
│   │
│   └── types/
│       └── express.d.ts         ← Extend req.user type
│
├── .env
├── .env.example
└── package.json
```

---

## 9. Consistent API Response Format

All endpoints return this shape:

```json
// Success
{
  "success": true,
  "message": "Trip created successfully",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Trip not found",
  "errors": [ ... ]   // optional validation errors array
}
```

Use a `response.ts` utility:

```ts
export const sendSuccess = (res, data, message = "Success", status = 200) =>
  res.status(status).json({ success: true, message, data });

export const sendError = (res, message, status = 400, errors = null) =>
  res
    .status(status)
    .json({ success: false, message, ...(errors && { errors }) });
```

---

## 10. Complete API Route Map

### Auth

| Method | Route                        | Auth | Description                    |
| ------ | ---------------------------- | ---- | ------------------------------ |
| POST   | /api/v1/auth/signup          | ❌   | Register                       |
| POST   | /api/v1/auth/login           | ❌   | Login, returns JWT             |
| POST   | /api/v1/auth/logout          | ✅   | Invalidate token (client-side) |
| POST   | /api/v1/auth/forgot-password | ❌   | Send reset email               |
| POST   | /api/v1/auth/reset-password  | ❌   | Reset with token               |

### Users

| Method | Route                     | Auth | Description          |
| ------ | ------------------------- | ---- | -------------------- |
| GET    | /api/v1/users/me          | ✅   | Get own profile      |
| PATCH  | /api/v1/users/me          | ✅   | Update profile       |
| PATCH  | /api/v1/users/me/password | ✅   | Change password      |
| POST   | /api/v1/users/me/photo    | ✅   | Upload profile photo |
| DELETE | /api/v1/users/me          | ✅   | Soft delete account  |

### Trips

| Method | Route                   | Auth | Description        |
| ------ | ----------------------- | ---- | ------------------ |
| GET    | /api/v1/trips           | ✅   | Get user's trips   |
| POST   | /api/v1/trips           | ✅   | Create trip        |
| GET    | /api/v1/trips/:id       | ✅   | Get single trip    |
| PATCH  | /api/v1/trips/:id       | ✅   | Update trip        |
| DELETE | /api/v1/trips/:id       | ✅   | Soft delete trip   |
| POST   | /api/v1/trips/:id/cover | ✅   | Upload cover image |
| POST   | /api/v1/trips/:id/copy  | ✅   | Copy trip          |

### Stops (Itinerary Builder)

| Method | Route                           | Auth | Description                                  |
| ------ | ------------------------------- | ---- | -------------------------------------------- |
| GET    | /api/v1/trips/:id/stops         | ✅   | Get all stops for trip                       |
| POST   | /api/v1/trips/:id/stops         | ✅   | Add stop to trip                             |
| PATCH  | /api/v1/trips/:id/stops/:stopId | ✅   | Update stop dates/notes                      |
| DELETE | /api/v1/trips/:id/stops/:stopId | ✅   | Remove stop                                  |
| PATCH  | /api/v1/trips/:id/stops/reorder | ✅   | Reorder stops (send array of {id, position}) |

### Stop Activities

| Method | Route                                | Auth | Description               |
| ------ | ------------------------------------ | ---- | ------------------------- |
| GET    | /api/v1/stops/:stopId/activities     | ✅   | Get activities for stop   |
| POST   | /api/v1/stops/:stopId/activities     | ✅   | Add activity to stop      |
| PATCH  | /api/v1/stops/:stopId/activities/:id | ✅   | Update activity instance  |
| DELETE | /api/v1/stops/:stopId/activities/:id | ✅   | Remove activity from stop |

### Cities

| Method | Route                | Auth | Description                        |
| ------ | -------------------- | ---- | ---------------------------------- |
| GET    | /api/v1/cities       | ❌   | Search cities (q, country, region) |
| GET    | /api/v1/cities/:slug | ❌   | Get city detail                    |

### Activities (Catalog)

| Method | Route                  | Auth | Description                                                |
| ------ | ---------------------- | ---- | ---------------------------------------------------------- |
| GET    | /api/v1/activities     | ❌   | Search activities (cityId, category, maxCost, maxDuration) |
| GET    | /api/v1/activities/:id | ❌   | Get activity detail                                        |

### Budget

| Method | Route                            | Auth | Description                    |
| ------ | -------------------------------- | ---- | ------------------------------ |
| GET    | /api/v1/trips/:id/budget         | ✅   | Get budget summary + breakdown |
| POST   | /api/v1/trips/:id/budget         | ✅   | Add budget item                |
| PATCH  | /api/v1/trips/:id/budget/:itemId | ✅   | Update budget item             |
| DELETE | /api/v1/trips/:id/budget/:itemId | ✅   | Delete budget item             |

### Checklist

| Method | Route                               | Auth | Description            |
| ------ | ----------------------------------- | ---- | ---------------------- |
| GET    | /api/v1/trips/:id/checklist         | ✅   | Get checklist items    |
| POST   | /api/v1/trips/:id/checklist         | ✅   | Add item               |
| PATCH  | /api/v1/trips/:id/checklist/:itemId | ✅   | Update / toggle packed |
| DELETE | /api/v1/trips/:id/checklist/:itemId | ✅   | Delete item            |
| POST   | /api/v1/trips/:id/checklist/reset   | ✅   | Reset all to unpacked  |

### Notes

| Method | Route                           | Auth | Description            |
| ------ | ------------------------------- | ---- | ---------------------- |
| GET    | /api/v1/trips/:id/notes         | ✅   | Get all notes for trip |
| POST   | /api/v1/trips/:id/notes         | ✅   | Add note               |
| PATCH  | /api/v1/trips/:id/notes/:noteId | ✅   | Edit note              |
| DELETE | /api/v1/trips/:id/notes/:noteId | ✅   | Soft delete note       |

### Sharing (Public — No Auth)

| Method | Route                      | Auth | Description             |
| ------ | -------------------------- | ---- | ----------------------- |
| GET    | /api/v1/shared/:shareToken | ❌   | View public/shared trip |

### Admin

| Method | Route               | Auth     | Description    |
| ------ | ------------------- | -------- | -------------- |
| GET    | /api/v1/admin/stats | ✅ ADMIN | Platform stats |
| GET    | /api/v1/admin/users | ✅ ADMIN | All users      |
| GET    | /api/v1/admin/trips | ✅ ADMIN | All trips      |

---

## 11. Key Service Examples

### Budget Service — getBreakdown

```ts
async getTripBudget(tripId: string) {
  const items = await prisma.budgetItem.findMany({ where: { trip_id: tripId } });

  const total = items.reduce((sum, i) => sum + i.amount, 0);

  const breakdown = items.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + i.amount;
    return acc;
  }, {} as Record<string, number>);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { budget_limit: true, start_date: true, end_date: true }
  });

  const days = trip?.start_date && trip?.end_date
    ? Math.ceil((trip.end_date.getTime() - trip.start_date.getTime()) / 86400000)
    : null;

  return {
    total,
    breakdown,
    avg_per_day: days ? total / days : null,
    limit: trip?.budget_limit ?? null,
    over_budget: trip?.budget_limit ? total > trip.budget_limit : false,
  };
}
```

### Stop Service — reorderStops

```ts
async reorderStops(tripId: string, order: { id: string; position: number }[]) {
  // Batch update in a transaction to prevent race conditions
  await prisma.$transaction(
    order.map(({ id, position }) =>
      prisma.tripStop.update({
        where: { id, trip_id: tripId },
        data: { position },
      })
    )
  );
}
```

### Copy Trip

```ts
async copyTrip(sourceTripId: string, userId: string) {
  const source = await prisma.trip.findUnique({
    where: { id: sourceTripId },
    include: { stops: { include: { stop_activities: true } }, budget_items: true, checklist_items: true }
  });

  return await prisma.$transaction(async (tx) => {
    const newTrip = await tx.trip.create({
      data: {
        user_id: userId,
        title: `Copy of ${source.title}`,
        slug: generateSlug(`copy-${source.title}`),
        description: source.description,
        status: 'DRAFT',
        visibility: 'PRIVATE',
        budget_limit: source.budget_limit,
      }
    });

    for (const stop of source.stops) {
      const newStop = await tx.tripStop.create({
        data: { trip_id: newTrip.id, city_id: stop.city_id, position: stop.position }
      });
      for (const sa of stop.stop_activities) {
        await tx.stopActivity.create({
          data: { stop_id: newStop.id, activity_id: sa.activity_id, custom_cost: sa.custom_cost }
        });
      }
    }

    return newTrip;
  });
}
```

---

## 12. Scalability & Future Extensibility

| Future Feature           | How Schema Handles It                                                          |
| ------------------------ | ------------------------------------------------------------------------------ |
| Team/collaborative trips | Add `trip_collaborators` table with `(trip_id, user_id, role)`                 |
| Notifications            | Add `notifications` table with `(user_id, type, payload, read_at)`             |
| AI recommendations       | Use `City.popularity_score`, `Activity.category` as ML features                |
| Bookmarks/favorites      | Add `user_favorites` table with `(user_id, city_id OR activity_id)`            |
| Reviews & ratings        | Add `reviews` table with polymorphic `(entity_type, entity_id, rating, body)`  |
| Payments                 | Add `subscriptions` table; `User.plan` enum                                    |
| Real-time                | Trip/Stop tables are WebSocket-friendly — add `last_edited_by` to stops        |
| Analytics                | All tables have `created_at` — time-series queries work without schema changes |

---

## 13. Environment Variables (.env)

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/traveloop"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
CLIENT_URL="http://localhost:5173"
PORT=5000
NODE_ENV=development
```

---

## 14. Seed Data Strategy

Seed 20–30 cities with popularity scores and avg costs. Seed 5–10 activities per city.
This powers the City Search and Activity Search screens immediately without requiring user-generated data.

```ts
// prisma/seed.ts
const cities = [
  {
    name: "Paris",
    country: "France",
    slug: "paris-france",
    popularity_score: 95,
    avg_cost_per_day: 120,
  },
  {
    name: "Tokyo",
    country: "Japan",
    slug: "tokyo-japan",
    popularity_score: 92,
    avg_cost_per_day: 100,
  },
  // ... more cities
];
```

---

## 15. Final Hackathon Checklist

**Day 1 — Foundation**

- [ ] Init project, install dependencies
- [ ] Set up Prisma + run `prisma migrate dev`
- [ ] Seed cities + activities
- [ ] Auth endpoints working (signup, login, JWT middleware)

**Day 2 — Core Features**

- [ ] Trip CRUD + stops CRUD
- [ ] Stop activities add/remove
- [ ] Budget items + breakdown endpoint

**Day 3 — Polish**

- [ ] Checklist, notes
- [ ] Public share endpoint
- [ ] Copy trip
- [ ] City/activity search with filters

**Day 4 — Demo Ready**

- [ ] Admin stats endpoint
- [ ] Postman collection exported
- [ ] Deploy to Railway/Render
- [ ] README written
