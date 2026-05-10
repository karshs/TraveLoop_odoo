import axios from "./axios";

export async function getChecklist(tripId: string) {
  const res = await axios.get(`/trips/${tripId}/checklist`);
  return res.data;
}

export async function addChecklistItem(tripId: string, data: object) {
  const res = await axios.post(`/trips/${tripId}/checklist`, data);
  return res.data;
}

export async function updateChecklistItem(tripId: string, itemId: string, data: object) {
  const res = await axios.patch(`/trips/${tripId}/checklist/${itemId}`, data);
  return res.data;
}

export async function deleteChecklistItem(tripId: string, itemId: string) {
  const res = await axios.delete(`/trips/${tripId}/checklist/${itemId}`);
  return res.data;
}

export async function resetChecklist(tripId: string) {
  const res = await axios.post(`/trips/${tripId}/checklist/reset`);
  return res.data;
}
