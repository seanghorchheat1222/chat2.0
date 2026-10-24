import { store } from "../store/store";
import api from "./api/api"

export const getConversationParticipant = async () => {
  return await api.get("chat/getconversationparticipant")
}

export const showMessage = async (conversationId) => {
  return await api.get(`chat/showmessage/${conversationId}`)
}

export const sentMessage = async (formData) => {
  return await api.post("chat/sendmessage", formData)
}

export const deleteMessage = async (id) => {
  return await api.delete(`chat/deleteconversation/${id}`)
}

export const getUser = async (search, id) => {
  return await api.get(`user/getuser?search=${search}&&id=${id}`)
}

export const createConversatoin = async (form) => {
  return await api.post("chat/createchat", form)
}


