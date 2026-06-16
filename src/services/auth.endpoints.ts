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
import {
  mockLogin,
  mockGetProfile,
  mockForgotPassword,
  mockVerifyOtp,
  mockResetPassword,
  mockChangePassword,
} from "@/mocks/auth.mock";
import { mockOrReal } from "@/services/base-query";

export const authEndpoints = {
  login: {
    queryFn: async (credentials: LoginCredentials) => {
      try {
        const result = await mockOrReal<LoginResponse>(
          () => mockLogin(credentials.email, credentials.password),
          { url: "/auth/login", method: "POST", body: credentials }
        );
        return result;
      } catch (error) {
        return {
          error: {
            status: 401,
            data: error instanceof Error ? error.message : "Login failed",
          },
        };
      }
    },
  },

  getProfile: {
    queryFn: async () => {
      try {
        const result = await mockOrReal<User>(
          () => mockGetProfile(),
          { url: "/auth/profile", method: "GET" }
        );
        return result;
      } catch (error) {
        return {
          error: {
            status: 401,
            data: error instanceof Error ? error.message : "Failed to fetch profile",
          },
        };
      }
    },
  },

  forgotPassword: {
    queryFn: async (body: ForgotPasswordRequest) => {
      try {
        const result = await mockOrReal<AuthMessageResponse>(
          () => {
            mockForgotPassword(body.email);
            return { message: "If the email exists, an OTP has been sent" };
          },
          { url: "/auth/forgot-password", method: "POST", body }
        );
        return result;
      } catch (error) {
        return {
          error: {
            status: 500,
            data: error instanceof Error ? error.message : "Something went wrong",
          },
        };
      }
    },
  },

  verifyOtp: {
    queryFn: async (body: VerifyOtpRequest) => {
      try {
        const result = await mockOrReal<AuthMessageResponse>(
          () => {
            mockVerifyOtp(body.email, body.otp);
            return { message: "OTP verified successfully" };
          },
          { url: "/auth/verify-otp", method: "POST", body }
        );
        return result;
      } catch (error) {
        return {
          error: {
            status: 400,
            data: error instanceof Error ? error.message : "OTP verification failed",
          },
        };
      }
    },
  },

  resetPassword: {
    queryFn: async (body: ResetPasswordRequest) => {
      try {
        const result = await mockOrReal<AuthMessageResponse>(
          () => {
            mockResetPassword(body.email, body.otp, body.newPassword);
            return { message: "Password reset successfully" };
          },
          { url: "/auth/reset-password", method: "POST", body }
        );
        return result;
      } catch (error) {
        return {
          error: {
            status: 400,
            data: error instanceof Error ? error.message : "Reset failed",
          },
        };
      }
    },
  },

  changePassword: {
    queryFn: async (body: ChangePasswordRequest) => {
      try {
        const result = await mockOrReal<AuthMessageResponse>(
          () => {
            mockChangePassword(body.currentPassword, body.newPassword);
            return { message: "Password changed successfully" };
          },
          { url: "/auth/change-password", method: "POST", body }
        );
        return result;
      } catch (error) {
        return {
          error: {
            status: 400,
            data: error instanceof Error ? error.message : "Change password failed",
          },
        };
      }
    },
  },
};