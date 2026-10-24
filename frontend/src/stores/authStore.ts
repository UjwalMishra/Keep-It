import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  hasSession,
  setTokens,
} from "../lib/authStorage";

type JwtPayload = {
  userId?: string;
  username?: string;
  exp?: number;
  type?: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  userId: string | null;
  hydrated: boolean;

  hydrate: () => void;
  setSession: (accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
};

function readPayload(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

function isExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  username: null,
  userId: null,
  hydrated: false,

  hydrate: () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const payload = readPayload(accessToken);

    set({
      accessToken,
      refreshToken,
      username: payload?.username ?? null,
      userId: payload?.userId ?? null,
      hydrated: true,
    });
  },

  setSession: (accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    const payload = readPayload(accessToken);
    set({
      accessToken,
      refreshToken,
      username: payload?.username ?? null,
      userId: payload?.userId ?? null,
      hydrated: true,
    });
  },

  clearSession: () => {
    clearTokens();
    set({
      accessToken: null,
      refreshToken: null,
      username: null,
      userId: null,
      hydrated: true,
    });
  },

  isAuthenticated: () => {
    const { accessToken, refreshToken } = get();
    if (!hasSession() && !accessToken && !refreshToken) return false;

    const payload = readPayload(accessToken || getAccessToken());
    // Access may be expired while refresh is still valid
    if (payload && !isExpired(payload)) return true;
    return Boolean(refreshToken || getRefreshToken());
  },
}));
