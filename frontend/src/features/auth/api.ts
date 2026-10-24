import { publicApi } from "../../lib/api";

export type AuthCredentials = {
  username: string;
  password: string;
};

export async function signup(data: AuthCredentials) {
  const res = await publicApi.post(`/auth/signup`, data);
  return res.data;
}

export async function signin(data: AuthCredentials) {
  const res = await publicApi.post(`/auth/signin`, data);
  return {
    accessToken: (res.data.accessToken || res.data.token) as string,
    refreshToken: res.data.refreshToken as string,
  };
}
