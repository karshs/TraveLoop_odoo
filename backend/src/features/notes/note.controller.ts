import { Request, Response } from "express";
import { getNotes, addNote, updateNote, deleteNote } from "./note.service.js";
import { addNoteSchema, updateNoteSchema } from "./note.validation.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export async function getNotesHandler(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const { stopId } = req.query;
    const notes = await getNotes(tripId, req.user!.id, stopId as string | undefined);
    sendSuccess(res, notes, "Notes fetched");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function addNoteHandler(req: Request, res: Response) {
  try {
    const data = addNoteSchema.parse(req.body);
    const result = await addNote(req.params.tripId, req.user!.id, data);
    sendSuccess(res, result, "Note added", 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function updateNoteHandler(req: Request, res: Response) {
  try {
    const data = updateNoteSchema.parse(req.body);
    const result = await updateNote(req.params.noteId, req.params.tripId, req.user!.id, data);
    sendSuccess(res, result, "Note updated");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}

export async function deleteNoteHandler(req: Request, res: Response) {
  try {
    const result = await deleteNote(req.params.noteId, req.params.tripId, req.user!.id);
    sendSuccess(res, result, "Note deleted");
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
}
