import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_RENDER_API_URL,
});

// Optional: Set up token globally if you use authentication
API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default API;s