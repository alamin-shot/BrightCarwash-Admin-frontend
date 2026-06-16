import { APP_CONFIG } from "@/configs/app.config";
import {
  mockLogin,
  mockRefreshToken,
  mockLogout,
  mockGetProfile,
  mockForgotPassword,
  mockVerifyOtp,
  mockResetPassword,
  mockChangePassword,
} from "@/mocks/auth.mock";
import type {
  LoginCredentials,
  LoginResponse,
  User,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  AuthMessageResponse,
} from "@/types/auth";
import axiosInstance from "@/lib/axios-instance";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    return mockLogin(credentials.email, credentials.password);
  }

  const { data } = await axiosInstance.post<LoginResponse>("/auth/login", credentials);
  return data;
}

export async function refreshAccessToken(): Promise<{ accessToken: string; expiresIn: number; refreshToken?: string }> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    return mockRefreshToken();
  }

  const { data } = await axiosInstance.post<{ accessToken: string; expiresIn: number; refreshToken?: string }>(
    "/auth/refresh"
  );
  return data;
}

export async function logout(): Promise<void> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    mockLogout();
    return;
  }

  await axiosInstance.post("/auth/logout");
}

export async function getProfile(): Promise<User> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    return mockGetProfile();
  }

  const { data } = await axiosInstance.get<User>("/auth/profile");
  return data;
}

export async function forgotPassword(reqData: ForgotPasswordRequest): Promise<AuthMessageResponse> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    mockForgotPassword(reqData.email);
    return { message: "If the email exists, an OTP has been sent" };
  }

  const { data } = await axiosInstance.post<AuthMessageResponse>("/auth/forgot-password", reqData);
  return data;
}

export async function verifyOtp(reqData: VerifyOtpRequest): Promise<AuthMessageResponse> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    mockVerifyOtp(reqData.email, reqData.otp);
    return { message: "OTP verified successfully" };
  }

  const { data } = await axiosInstance.post<AuthMessageResponse>("/auth/verify-otp", reqData);
  return data;
}

export async function resetPassword(reqData: ResetPasswordRequest): Promise<AuthMessageResponse> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    mockResetPassword(reqData.email, reqData.otp, reqData.newPassword);
    return { message: "Password reset successfully" };
  }

  const { data } = await axiosInstance.post<AuthMessageResponse>("/auth/reset-password", reqData);
  return data;
}

export async function changePassword(reqData: ChangePasswordRequest): Promise<AuthMessageResponse> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    mockChangePassword(reqData.currentPassword, reqData.newPassword);
    return { message: "Password changed successfully" };
  }

  const { data } = await axiosInstance.post<AuthMessageResponse>("/auth/change-password", reqData);
  return data;
}