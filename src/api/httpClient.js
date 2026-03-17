import axios from "axios";
import { API_BASE_URL } from "./config";
import {
  clearStoredTokens,
  getStoredAuth,
  setStoredTokens,
} from "./tokenStorage";

// Dedicated client for refresh to avoid interceptor recursion.
const refreshClient = axios.create({ baseURL: API_BASE_URL });

let refreshPromise = null;

async function refreshAccessToken() {
  const { refreshToken } = getStoredAuth();
  if (!refreshToken) {
    clearStoredTokens();
    throw new Error("Missing refresh token");
  }

  const { data } = await refreshClient.post("/auth/refresh", { refreshToken });
  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error("Invalid refresh response");
  }

  setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.accessToken;
}

export const http = axios.create({
  baseURL: API_BASE_URL,
});

http.interceptors.request.use((config) => {
  const { accessToken } = getStoredAuth();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (!originalRequest || status !== 401) {
      throw error;
    }

    // Never try to refresh for auth endpoints to avoid loops.
    const url = String(originalRequest.url || "");
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh")
    ) {
      throw error;
    }

    if (originalRequest._retry) {
      throw error;
    }
    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newAccessToken = await refreshPromise;
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return http(originalRequest);
    } catch (refreshErr) {
      clearStoredTokens();
      throw refreshErr;
    }
  },
);
