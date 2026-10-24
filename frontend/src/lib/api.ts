import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BACKEND_URL } from "../config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./authStorage";
import { queryClient } from "./queryClient";

export const publicApi = axios.create({
  baseURL: BACKEND_URL,
});

export const api = axios.create({
  baseURL: BACKEND_URL,
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const res = await publicApi.post(`/auth/refresh`, { refreshToken });
    const accessToken = res.data.accessToken || res.data.token;
    const nextRefresh = res.data.refreshToken;

    if (!accessToken || !nextRefresh) {
      clearTokens();
      return null;
    }

    setTokens(accessToken, nextRefresh);
    return accessToken as string;
  } catch {
    clearTokens();
    return null;
  }
}

function refreshOnce(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const url = original?.url || "";
    const isAuthRoute =
      url.includes("/auth/signin") ||
      url.includes("/auth/signup") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout");

    if (status !== 401 || !original || original._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    original._retry = true;
    const newAccessToken = await refreshOnce();

    if (!newAccessToken) {
      queryClient.clear();
      if (window.location.pathname !== "/signin") {
        window.location.assign("/signin");
      }
      return Promise.reject(error);
    }

    original.headers.Authorization = `Bearer ${newAccessToken}`;
    return api(original);
  }
);

export async function logoutRequest(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await publicApi.post(`/auth/logout`, { refreshToken });
    }
  } catch {
    // ignore
  } finally {
    clearTokens();
    queryClient.clear();
  }
}
