import axios from "axios";
import { getNewTokens } from "services/token";
import { setCookie } from "utils/cookie";
import { getCookie } from "utils/cookie";

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const res = await getNewTokens();
      if (!res?.response) return;
      setCookie(res.response.data);
      return api(originalRequest);
    }
  }
);

export default api;
