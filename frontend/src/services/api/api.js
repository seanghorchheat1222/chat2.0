import axios from "axios";
import { store } from "../../store/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers:{
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = store.getState().token.token;

    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }else{
      delete config.headers.Authorization
    }

    return config;
  },

  (err) => Promise.reject(err)
)

export default api;