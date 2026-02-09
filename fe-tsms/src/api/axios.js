import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.62.98.150:8080/",
  // baseURL:"http://192.168.12.67:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

