import prisma from "../../config/prisma.js";
import { AddNoteInput, UpdateNoteInput } from "./note.validation.js";

export async function getNotes(tripId: string, userId: string, stopId?: string) {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, user_id: userId, is_deleted: false }
  });
  if (!trip) throw new Error("Trip not found");

  const whereClause: any = { trip_id: tripId, is_deleted: false };
  if (stopId) {
    whereClause.stop_id = stopId;
  }

  const notes = await prisma.tripNote.findMany({
    where: whereClause,
    orderBy: { created_at: "desc" }
  });

  return notes;
}

export async function addNote(tripId: string, userId: string, data: AddNoteInput) {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, user_id: userId, is_deleted: false }
  });
  if (!trip) throw new Error("Trip not found");

  if (data.stop_id) {
    const stop = await prisma.tripStop.findFirst({
      where: { id: data.stop_id, trip_id: tripId }
    });
    if (!stop) throw new Error("Stop not found");
  }

  const note = await prisma.tripNote.create({
    data: {
      trip_id: tripId,
      user_id: userId,
      title: data.title,
      content: data.content,
      type: data.type,
      stop_id: data.stop_id,
      note_date: data.note_date,
    }
  });

  return note;
}

export async function updateNote(noteId: string, tripId: string, userId: string, data: UpdateNoteInput) {
  const note = await prisma.tripNote.findFirst({
    where: { id: noteId, trip_id: tripId, user_id: userId, is_deleted: false }
  });
  if (!note) throw new Error("Note not found");

  const updated = await prisma.tripNote.update({
    where: { id: noteId },
    data
  });

  return updated;
}

export async function deleteNote(noteId: string, tripId: string, userId: string) {
  const note = await prisma.tripNote.findFirst({
    where: { id: noteId, trip_id: tripId, user_id: userId }
  });
  if (!note) throw new Error("Note not found");

  await prisma.tripNote.update({
    where: { id: noteId },
    data: { is_deleted: true }
  });

  return { message: "Note deleted" };
}
