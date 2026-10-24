import api from "./api/api"

export const signOut = async (token) => {
  return await api.post("auth/logout", token)
}

export const setProfile = async (formData) => {
  return await api.post("profile/setprofile", formData)
}

export const currentUser = async () => {
  return await api.get("auth/currentuser")
}