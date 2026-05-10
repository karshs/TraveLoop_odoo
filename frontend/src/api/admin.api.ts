import axios from "./axios";

export async function getStats() {
  const res = await axios.get(`/admin/stats`);
  return res.data;
}

export async function getAdminUsers(page: number = 1) {
  const res = await axios.get(`/admin/users`, { params: { page } });
  return res.data;
}

export async function getAdminTrips(page: number = 1) {
  const res = await axios.get(`/admin/trips`, { params: { page } });
  return res.data;
}

export async function getTopCities() {
  const res = await axios.get(`/admin/cities/top`);
  return res.data;
}

export async function getTopActivities() {
  const res = await axios.get(`/admin/activities/top`);
  return res.data;
}
