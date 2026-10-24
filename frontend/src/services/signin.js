import api from "./api/api"

export const signIn = async (form) => {
  return await api.post("auth/login", form)
}

export const currentUser = async () => {
  return await api.get("auth/currentuser")
}