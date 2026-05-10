import prisma from "../../config/prisma.js";
import { AddBudgetItemInput, UpdateBudgetItemInput } from "./budget.validation.js";
import { BudgetCategory } from "@prisma/client";

const ALL_CATEGORIES: BudgetCategory[] = [
  "TRANSPORT",
  "ACCOMMODATION",
  "FOOD",
  "ACTIVITIES",
  "SHOPPING",
  "MISC",
];

export async function getBudgetSummary(tripId: string, userId: string) {
  // Verify trip exists, belongs to user, is not soft deleted
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      user_id: userId,
      is_deleted: false,
    },
  });

  if (!trip) {
    throw new Error("Trip not found");
  }

  // Fetch all budget items for this trip
  const budgetItems = await prisma.budgetItem.findMany({
    where: { trip_id: tripId },
    orderBy: { created_at: "desc" },
  });

  // Calculate totals
  const total = budgetItems.reduce((sum, item) => sum + item.amount, 0);

  // Build breakdown with all 6 categories (even if 0)
  const breakdown: Record<BudgetCategory, number> = {} as Record<BudgetCategory, number>;
  for (const cat of ALL_CATEGORIES) {
    breakdown[cat] = 0;
  }
  for (const item of budgetItems) {
    breakdown[item.category] += item.amount;
  }

  // Calculate days between start_date and end_date
  let days: number | null = null;
  if (trip.start_date && trip.end_date) {
    days = Math.ceil(
      (trip.end_date.getTime() - trip.start_date.getTime()) / 86400000,
    );
  }

  const avg_per_day = days ? total / days : null;
  const over_budget = trip.budget_limit ? total > trip.budget_limit : false;
  const remaining = trip.budget_limit ? trip.budget_limit - total : null;

  return {
    total,
    limit: trip.budget_limit,
    over_budget,
    remaining,
    avg_per_day,
    breakdown,
    items: budgetItems,
  };
}

export async function addBudgetItem(
  tripId: string,
  userId: string,
  data: AddBudgetItemInput,
) {
  // Verify trip belongs to user
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      user_id: userId,
      is_deleted: false,
    },
  });

  if (!trip) {
    throw new Error("Trip not found");
  }

  return await prisma.budgetItem.create({
    data: {
      trip_id: tripId,
      category: data.category,
      label: data.label,
      amount: data.amount,
      currency: data.currency,
      is_actual: data.is_actual,
      date: data.date,
    },
  });
}

export async function updateBudgetItem(
  itemId: string,
  tripId: string,
  userId: string,
  data: UpdateBudgetItemInput,
) {
  // Verify the budget item exists on this trip which belongs to this user
  const item = await prisma.budgetItem.findFirst({
    where: {
      id: itemId,
      trip_id: tripId,
      trip: {
        user_id: userId,
        is_deleted: false,
      },
    },
  });

  if (!item) {
    throw new Error("Budget item not found");
  }

  return await prisma.budgetItem.update({
    where: { id: itemId },
    data,
  });
}

export async function deleteBudgetItem(
  itemId: string,
  tripId: string,
  userId: string,
) {
  // Verify the budget item exists on this trip which belongs to this user
  const item = await prisma.budgetItem.findFirst({
    where: {
      id: itemId,
      trip_id: tripId,
      trip: {
        user_id: userId,
        is_deleted: false,
      },
    },
  });

  if (!item) {
    throw new Error("Budget item not found");
  }

  await prisma.budgetItem.delete({
    where: { id: itemId },
  });

  return { message: "Budget item deleted" };
}

export async function autoGenerateBudget(tripId: string, userId: string) {
  // Verify trip belongs to user
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      user_id: userId,
      is_deleted: false,
    },
  });

  if (!trip) {
    throw new Error("Trip not found");
  }

  // Fetch all stop activities for this trip with nested activity data
  const stops = await prisma.tripStop.findMany({
    where: { trip_id: tripId },
    include: {
      stop_activities: {
        include: { activity: true },
      },
    },
  });

  // Collect all activity budget items to create
  const itemsToCreate: {
    trip_id: string;
    category: BudgetCategory;
    label: string;
    amount: number;
    currency: string;
    is_actual: boolean;
  }[] = [];

  for (const stop of stops) {
    for (const sa of stop.stop_activities) {
      const amount = sa.custom_cost ?? sa.activity.estimated_cost;
      itemsToCreate.push({
        trip_id: tripId,
        category: "ACTIVITIES",
        label: sa.activity.name,
        amount,
        currency: "USD",
        is_actual: false,
      });
    }
  }

  // Delete all existing ACTIVITIES category budget items for this trip first
  await prisma.budgetItem.deleteMany({
    where: {
      trip_id: tripId,
      category: "ACTIVITIES",
    },
  });

  // Create new budget items
  await prisma.budgetItem.createMany({
    data: itemsToCreate,
  });

  return { message: "Budget auto-generated", count: itemsToCreate.length };
}
