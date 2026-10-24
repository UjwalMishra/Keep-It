import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signin, signup, type AuthCredentials } from "./api";
import { useAuthStore } from "../../stores/authStore";
import { useUiStore } from "../../stores/uiStore";
import { logoutRequest } from "../../lib/api";

export function useSignin() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: AuthCredentials) => signin(data),
    onSuccess: ({ accessToken, refreshToken }) => {
      if (!accessToken || !refreshToken) {
        toast.error("Login failed: missing tokens");
        return;
      }
      setSession(accessToken, refreshToken);
      toast.success("Login successful!");
      navigate("/");
    },
    onError: (err: any) => {
      const errors = err?.response?.data?.errors;
      const firstFieldError =
        errors &&
        (Object.values(errors).flat()[0] as string | undefined);
      toast.error(
        firstFieldError || err?.response?.data?.msg || "Please try again!"
      );
    },
  });
}

export function useSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: AuthCredentials) => signup(data),
    onSuccess: () => {
      toast.success("Account created! Please login now");
      navigate("/signin");
    },
    onError: (err: any) => {
      const errors = err?.response?.data?.errors;
      const firstFieldError =
        errors &&
        (Object.values(errors).flat()[0] as string | undefined);
      toast.error(
        firstFieldError || err?.response?.data?.msg || "Please try again!"
      );
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const resetUi = useUiStore((s) => s.resetUi);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: () => {
      clearSession();
      resetUi();
      toast.success("Logged out");
      navigate("/signin");
    },
  });
}
