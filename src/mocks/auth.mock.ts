import type { User, LoginResponse } from "@/types/auth";
import { AUTH_CONFIG } from "@/configs/auth.config";

const MOCK_USERS: Map<string, { password: string; user: User }> = new Map([
  [
    AUTH_CONFIG.MOCK_CREDENTIALS.email,
    {
      password: AUTH_CONFIG.MOCK_CREDENTIALS.password,
      user: {
        id: "usr_001",
        email: AUTH_CONFIG.MOCK_CREDENTIALS.email,
        name: "Admin User",
        role: "admin",
      },
    },
  ],
]);

const MOCK_OTP_STORE: Map<string, string> = new Map();
const MOCK_BLACKLIST: Set<string> = new Set();
let refreshTokenCounter = 0;
let currentRefreshToken: string | null = null;
let currentAccessToken: string | null = null;

function generateMockToken(payload: Record<string, unknown>, expiresInSeconds: number): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    })
  );
  return `${header}.${body}.mock_signature`;
}

export function mockLogin(email: string, password: string): LoginResponse {
  const found = MOCK_USERS.get(email);
  if (!found || found.password !== password) {
    throw new Error("Invalid email or password");
  }

  currentAccessToken = generateMockToken(
    { sub: found.user.id, email: found.user.email, role: found.user.role },
    AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE
  );

  currentRefreshToken = generateMockToken(
    { sub: found.user.id, type: "refresh", jti: String(++refreshTokenCounter) },
    AUTH_CONFIG.REFRESH_TOKEN_MAX_AGE
  );

  return {
    accessToken: currentAccessToken,
    refreshToken: currentRefreshToken,
    expiresIn: AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE,
    user: found.user,
  };
}

export function mockRefreshToken(): { accessToken: string; expiresIn: number; refreshToken: string } {
  if (!currentRefreshToken || MOCK_BLACKLIST.has(currentRefreshToken)) {
    throw new Error("No valid refresh token");
  }

  const payload = JSON.parse(atob(currentRefreshToken.split(".")[1]));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) {
    throw new Error("Refresh token expired");
  }

  const user = Array.from(MOCK_USERS.values()).find(
    (u) => u.user.id === payload.sub
  );

  if (!user) {
    throw new Error("User not found");
  }

  MOCK_BLACKLIST.add(currentRefreshToken);

  currentAccessToken = generateMockToken(
    { sub: user.user.id, email: user.user.email, role: user.user.role },
    AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE
  );

  currentRefreshToken = generateMockToken(
    { sub: user.user.id, type: "refresh", jti: String(++refreshTokenCounter) },
    AUTH_CONFIG.REFRESH_TOKEN_MAX_AGE
  );

  return {
    accessToken: currentAccessToken,
    expiresIn: AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE,
    refreshToken: currentRefreshToken,
  };
}

export function mockLogout(): void {
  if (currentRefreshToken) {
    MOCK_BLACKLIST.add(currentRefreshToken);
  }
  currentAccessToken = null;
  currentRefreshToken = null;
}

export function mockGetProfile(): User {
  if (!currentAccessToken) {
    throw new Error("Not authenticated");
  }

  const payload = JSON.parse(atob(currentAccessToken.split(".")[1]));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) {
    throw new Error("Token expired");
  }

  const user = Array.from(MOCK_USERS.values()).find(
    (u) => u.user.id === payload.sub
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user.user;
}

export function mockForgotPassword(email: string): void {
  const found = MOCK_USERS.has(email);
  if (!found) return;
  MOCK_OTP_STORE.set(email, AUTH_CONFIG.MOCK_OTP);
}

export function mockVerifyOtp(email: string, otp: string): void {
  const stored = MOCK_OTP_STORE.get(email);
  if (!stored || stored !== otp) {
    throw new Error("Invalid OTP");
  }
}

export function mockResetPassword(email: string, otp: string, newPassword: string): void {
  mockVerifyOtp(email, otp);
  const found = MOCK_USERS.get(email);
  if (found) {
    found.password = newPassword;
  }
  MOCK_OTP_STORE.delete(email);
}

export function mockChangePassword(currentPassword: string, newPassword: string): void {
  if (!currentAccessToken) {
    throw new Error("Not authenticated");
  }

  const payload = JSON.parse(atob(currentAccessToken.split(".")[1]));
  const user = Array.from(MOCK_USERS.values()).find(
    (u) => u.user.id === payload.sub
  );

  if (!user || user.password !== currentPassword) {
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
}