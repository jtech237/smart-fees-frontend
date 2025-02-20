import { UserResponse } from "@/types/user";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { getSession, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
let cachedSession: Awaited<ReturnType<typeof getSession>> = null;

async function getCachedSession(){
  if(!cachedSession){
    cachedSession = await getSession()
  }
  return cachedSession
}

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const session = await getCachedSession();
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
      const session = await getCachedSession();
      if (!session?.user) {
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


export default api
