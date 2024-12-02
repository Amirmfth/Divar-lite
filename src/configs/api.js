import axios from "axios";
import { getCookie } from "src/utils/cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (reguest) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      reguest.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return reguest;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
