import axios from "axios";

export const api = axios.create({
  // baseURL: "http://10.25.62.104:8080/",
  baseURL: "http://192.168.12.67:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; 
  }
  return config;
});