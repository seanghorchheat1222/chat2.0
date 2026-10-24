import api from "./api/api"

export const currentUser = async () => {
  return await api.get(`/auth/currentuser`);
}