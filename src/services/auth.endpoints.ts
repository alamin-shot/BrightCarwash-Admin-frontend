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
import {
  mockLogin,
  mockGetProfile,
  mockForgotPassword,
  mockVerifyOtp,
  mockResetPassword,
  mockChangePassword,
} from "@/mocks/auth.mock";
import { mockOrReal } from "@/services/base-query";

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
        const result = await mockOrReal<UserResponse>(
          () => mockGetProfile(),
          { url: "/auth/me", method: "GET" }
        );
        return { data: mapUser(result.data.data) };
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
            return { success: true, message: "If the email exists, an OTP has been sent" };
          },
          { url: "/auth/forgot-password/send-otp", method: "POST", body }
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
            return { success: true, message: "OTP verified successfully" };
          },
          { url: "/auth/forgot-password/verify-otp", method: "POST", body }
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
            mockResetPassword(body.email, body.otp, body.new_password);
            return { success: true, message: "Password reset successfully" };
          },
          { url: "/auth/forgot-password/reset-password", method: "POST", body }
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
            mockChangePassword(body.old_password, body.new_password);
            return { success: true, message: "Password changed successfully" };
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