"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AUTH_CONFIG } from "@/configs/auth.config";
import { getAccessToken, clearTokens, isAuthenticated } from "@/lib/auth-client";
import { refreshAccessToken } from "@/services/auth.service";
import { useAppDispatch } from "@/lib/store";
import { clearAuth } from "@/store/slices/authSlice";

const PUBLIC_PATHS = ["/login", "/forgot-password", "/verify-otp", "/reset-password"];

export function useTokenRefresh(): void {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRefreshingRef = useRef(false);

  const performRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    if (!isAuthenticated()) return;

    const currentToken = getAccessToken();
    if (!currentToken) return;

    isRefreshingRef.current = true;

    try {
      await refreshAccessToken();
    } catch {
      clearTokens();
      dispatch(clearAuth());
      if (!PUBLIC_PATHS.includes(pathname)) {
        window.location.href = "/login?expired=true";
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [pathname, dispatch]);

  useEffect(() => {
    if (!isAuthenticated()) return;

    performRefresh();

    refreshIntervalRef.current = setInterval(
      performRefresh,
      AUTH_CONFIG.REFRESH_BUFFER_SECONDS * 1000
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        performRefresh();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [performRefresh]);
}