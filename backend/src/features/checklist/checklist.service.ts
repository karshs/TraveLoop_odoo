import prisma from "../../config/prisma.js";
import { AddChecklistItemInput, UpdateChecklistItemInput } from "./checklist.validation.js";

export async function getChecklist(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, user_id: userId, is_deleted: false }
  });
  if (!trip) throw new Error("Trip not found");

  const items = await prisma.checklistItem.findMany({
    where: { trip_id: tripId },
    orderBy: [
      { category: "asc" },
      { position: "asc" }
    ]
  });

  const grouped = items.reduce((acc: any, item: any) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return grouped;
}

export async function addChecklistItem(tripId: string, userId: string, data: AddChecklistItemInput) {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, user_id: userId, is_deleted: false }
  });
  if (!trip) throw new Error("Trip not found");

  const item = await prisma.checklistItem.create({
    data: {
      trip_id: tripId,
      user_id: userId,
      label: data.label,
      category: data.category,
      position: data.position,
    }
  });

  return item;
}

export async function updateChecklistItem(itemId: string, tripId: string, userId: string, data: UpdateChecklistItemInput) {
  const item = await prisma.checklistItem.findFirst({
    where: { id: itemId, trip_id: tripId, user_id: userId }
  });
  if (!item) throw new Error("Item not found");

  const updated = await prisma.checklistItem.update({
    where: { id: itemId },
    data
  });

  return updated;
}

export async function deleteChecklistItem(itemId: string, tripId: string, userId: string) {
  const item = await prisma.checklistItem.findFirst({
    where: { id: itemId, trip_id: tripId, user_id: userId }
  });
  if (!item) throw new Error("Item not found");

  await prisma.checklistItem.delete({
    where: { id: itemId }
  });

  return { message: "Item deleted" };
}

export async function resetChecklist(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, user_id: userId, is_deleted: false }
  });
  if (!trip) throw new Error("Trip not found");

  await prisma.checklistItem.updateMany({
    where: { trip_id: tripId },
    data: { is_packed: false }
  });

  return { message: "Checklist reset" };
}
