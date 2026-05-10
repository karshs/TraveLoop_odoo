import axios from "./axios";

export async function getNotes(tripId: string, stopId?: string) {
  const res = await axios.get(`/trips/${tripId}/notes`, {
    params: stopId ? { stopId } : undefined
  });
  return res.data;
}

export async function addNote(tripId: string, data: object) {
  const res = await axios.post(`/trips/${tripId}/notes`, data);
  return res.data;
}

export async function updateNote(tripId: string, noteId: string, data: object) {
  const res = await axios.patch(`/trips/${tripId}/notes/${noteId}`, data);
  return res.data;
}

export async function deleteNote(tripId: string, noteId: string) {
  const res = await axios.delete(`/trips/${tripId}/notes/${noteId}`);
  return res.data;
}
