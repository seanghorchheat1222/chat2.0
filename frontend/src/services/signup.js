import api from "./api/api"

export const requestOTP = async (form) => {
  return await api.post('user/request_otp', form)
}

export const confirmOTP = async (form) => {
  return await api.post('user/confirm_otp', form)
}

export const createUser = async (form) => {
  return await api.post('user/createuser', form)
}



