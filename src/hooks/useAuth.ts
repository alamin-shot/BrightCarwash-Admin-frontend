"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setUser, setLoading, clearAuth, initAuth } from "@/store/slices/authSlice";
import { setTokens, clearTokens, isAuthenticated as checkAuth } from "@/lib/auth-client";
import { useLoginMutation, useGetProfileQuery } from "@/services/auth.api";
import type { LoginCredentials } from "@/types/auth";
import { toast } from "react-toastify";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [loginMutation] = useLoginMutation();
  const { data: profile, error: profileError } = useGetProfileQuery(undefined, {
    skip: !checkAuth(),
  });

  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
    }
    if (profileError) {
      clearTokens();
      dispatch(clearAuth());
    }
  }, [profile, profileError, dispatch]);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const response = await loginMutation(credentials).unwrap();
        setTokens(response.accessToken, response.expiresIn, response.refreshToken);
        dispatch(setUser(response.user));
        toast.success("Login successful");
        router.push("/dashboard");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Login failed");
        throw error;
      }
    },
    [loginMutation, dispatch, router]
  );

  const logout = useCallback(async () => {
    try {
      // Call logout service via axios (already handled in auth.service.ts)
      const { logout: logoutService } = await import("@/services/auth.service");
      await logoutService();
    } catch {
      // Proceed with local cleanup regardless
    } finally {
      clearTokens();
      dispatch(clearAuth());
      router.push("/login");
      toast.info("Logged out successfully");
    }
  }, [dispatch, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}