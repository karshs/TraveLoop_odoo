import axios from "./axios";

export async function getPublicTrip(shareToken: string) {
  const res = await axios.get(`/public/${shareToken}`);
  return res.data;
}

export async function copyPublicTrip(shareToken: string) {
  const res = await axios.post(`/public/${shareToken}/copy`);
  return res.data;
}

export async function updateVisibility(tripId: string, visibility: string) {
  const res = await axios.patch(`/trips/${tripId}/visibility`, { visibility });
  return res.data;
}
