import { UserResponse } from "@/types/user";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import camelCaseKeys from "camelcase-keys";
import { getSession, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = camelcaseKeys(response.data, { deep: true });
    }
    return response;
  },
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const session = await getSession();
      if (!session) {
        Promise.reject(error);
      } else {
        try {
          const res = await axios.post<UserResponse>(`${API_URL}/auth/token/refresh`, {
            refresh: session.user.refreshToken,
          });
          const newAccess = res.data.access;
          session.user.accessToken = newAccess;
          session.user.refreshToken = res.data.refresh;
        } catch (refreshError) {
          console.error("Token refresh failed, logging out...", refreshError);
          signOut();
        }
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use((response) => {
  if(response.data){
    response.data = camelCaseKeys(response.data, {deep: true})
  }
  return response
})

export default api
