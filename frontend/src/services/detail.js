import api from "./api/api"

export const showMessage = async (conversationId) => {
  return await api.get(`chat/showmessage/${conversationId}`)
}

export const sentMessage = async (formData) => {
  return await api.post("chat/sendmessage", formData)
}

export const deleteMessage = async (id) => {
  return await api.delete(`chat/deleteconversation/${id}`)
}

export const getConversationParticipant = async () => {
  return await api.get("chat/getconversationparticipant")
}
