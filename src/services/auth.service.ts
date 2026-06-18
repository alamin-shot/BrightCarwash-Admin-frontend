import { APP_CONFIG } from "@/configs/app.config";
import {
  mockLogin,
  mockGetProfile,
  mockLogout,
  mockForgotPassword,
  mockVerifyOtp,
  mockResetPassword,
  mockChangePassword,
} from "@/mocks/auth.mock";
import type {
  LoginCredentials,
  LoginResponse,
  User,
  UserResponse,
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

function mapUser(data: UserResponse["data"]): User {
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    avatar: data.avatar,
    role: data.roleUsers?.[0]?.role?.name || "staff",
  };
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    return mockLogin(credentials.email, credentials.password);
  }
  const { data } = await axiosInstance.post<LoginResponse>("/auth/login", credentials);
  return data;
}

export async function getProfile(): Promise<User> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    const res = mockGetProfile();
    return mapUser(res.data);
  }
  const { data } = await axiosInstance.get<UserResponse>("/auth/me");
  return mapUser(data.data);
}

export async function logout(): Promise<void> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    mockLogout();
    return;
  }
  await axiosInstance.post("/auth/logout");
}

export async function forgotPassword(reqData: ForgotPasswordRequest): Promise<AuthMessageResponse> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    mockForgotPassword(reqData.email);
    return { success: true, message: "If the email exists, an OTP has been sent" };
  }
  const { data } = await axiosInstance.post<AuthMessageResponse>("/auth/forgot-password/send-otp", reqData);
  return data;
}

export async function verifyOtp(reqData: VerifyOtpRequest): Promise<AuthMessageResponse> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    mockVerifyOtp(reqData.email, reqData.otp);
    return { success: true, message: "OTP verified successfully" };
  }
  const { data } = await axiosInstance.post<AuthMessageResponse>("/auth/forgot-password/verify-otp", reqData);
  return data;
}

export async function resetPassword(reqData: ResetPasswordRequest): Promise<AuthMessageResponse> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    mockResetPassword(reqData.email, reqData.otp, reqData.new_password);
    return { success: true, message: "Password reset successfully" };
  }
  const { data } = await axiosInstance.post<AuthMessageResponse>("/auth/forgot-password/reset-password", reqData);
  return data;
}

export async function changePassword(reqData: ChangePasswordRequest): Promise<AuthMessageResponse> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    mockChangePassword(reqData.old_password, reqData.new_password);
    return { success: true, message: "Password changed successfully" };
  }
  const { data } = await axiosInstance.post<AuthMessageResponse>("/auth/change-password", reqData);
  return data;
}