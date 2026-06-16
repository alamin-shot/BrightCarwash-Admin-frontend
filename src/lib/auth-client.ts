"use client";

import { AUTH_CONFIG } from "@/configs/auth.config";

interface TokenCache {
  accessToken: string | null;
  expiresAt: number | null;
}

const tokenCache: TokenCache = {
  accessToken: null,
  expiresAt: null,
};

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax; secure`;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getAccessToken(): string | null {
  if (tokenCache.accessToken && tokenCache.expiresAt) {
    if (Date.now() < tokenCache.expiresAt) {
      return tokenCache.accessToken;
    }
  }

  const fromCookie = getCookie(AUTH_CONFIG.ACCESS_TOKEN_COOKIE);
  if (fromCookie) {
    tokenCache.accessToken = fromCookie;
    const expiry = getCookie(`${AUTH_CONFIG.ACCESS_TOKEN_COOKIE}_expiry`);
    tokenCache.expiresAt = expiry ? Number(expiry) : null;
    return fromCookie;
  }

  return null;
}

export function setTokens(accessToken: string, expiresIn: number, refreshToken: string): void {
  tokenCache.accessToken = accessToken;
  tokenCache.expiresAt = Date.now() + expiresIn * 1000;

  setCookie(AUTH_CONFIG.ACCESS_TOKEN_COOKIE, accessToken, AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE);
  setCookie(
    `${AUTH_CONFIG.ACCESS_TOKEN_COOKIE}_expiry`,
    String(tokenCache.expiresAt),
    AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE
  );
  setCookie(AUTH_CONFIG.REFRESH_TOKEN_COOKIE, refreshToken, AUTH_CONFIG.REFRESH_TOKEN_MAX_AGE);
}

export function clearTokens(): void {
  tokenCache.accessToken = null;
  tokenCache.expiresAt = null;

  deleteCookie(AUTH_CONFIG.ACCESS_TOKEN_COOKIE);
  deleteCookie(`${AUTH_CONFIG.ACCESS_TOKEN_COOKIE}_expiry`);
  deleteCookie(AUTH_CONFIG.REFRESH_TOKEN_COOKIE);
}

export function isTokenExpired(): boolean {
  if (tokenCache.expiresAt) {
    return Date.now() >= tokenCache.expiresAt - AUTH_CONFIG.REFRESH_BUFFER_SECONDS * 1000;
  }
  return true;
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}