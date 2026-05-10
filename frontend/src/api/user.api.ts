import axios from "./axios";

export async function getProfile() {
  const res = await axios.get(`/users/me`);
  return res.data;
}

export async function updateProfile(data: object) {
  const res = await axios.patch(`/users/me`, data);
  return res.data;
}

export async function changePassword(data: object) {
  const res = await axios.patch(`/users/me/password`, data);
  return res.data;
}

export async function uploadPhoto(file: File) {
  const formData = new FormData();
  formData.append("photo", file);
  const res = await axios.post(`/users/me/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
}

export async function deleteAccount() {
  const res = await axios.delete(`/users/me`);
  return res.data;
}
