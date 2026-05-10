import axios from "./axios";

export async function getBudget(tripId: string) {
  const res = await axios.get(`/trips/${tripId}/budget`);
  return res.data;
}

export async function addBudgetItem(tripId: string, data: object) {
  const res = await axios.post(`/trips/${tripId}/budget`, data);
  return res.data;
}

export async function updateBudgetItem(tripId: string, itemId: string, data: object) {
  const res = await axios.patch(`/trips/${tripId}/budget/${itemId}`, data);
  return res.data;
}

export async function deleteBudgetItem(tripId: string, itemId: string) {
  const res = await axios.delete(`/trips/${tripId}/budget/${itemId}`);
  return res.data;
}

export async function autoGenerateBudget(tripId: string) {
  const res = await axios.post(`/trips/${tripId}/budget/auto`);
  return res.data;
}
