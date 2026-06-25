import { APP_CONFIG } from '@/configs/app.config';
import {
	mockLogin,
	mockGetProfile,
	mockLogout,
	mockForgotPassword,
	mockVerifyOtp,
	mockResetPassword,
	mockChangePassword,
} from '@/mocks/auth.mock';
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
} from '@/types/auth';
import axiosInstance from '@/lib/axios-instance';
import axios from 'axios';
import { getRefreshToken } from '@/lib/auth-client';

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapUser(data: UserResponse['data']): User {
	return {
		id: data.id,
		firstName: data.first_name,
		lastName: data.last_name,
		email: data.email,
		avatar: data.avatar,
		role: data.roleUsers?.[0]?.role?.name || 'staff',
	};
}

export async function login(
	credentials: LoginCredentials,
): Promise<LoginResponse> {
	// ✅ Debug logging
	console.log('[AUTH] MOCK_MODE value:', APP_CONFIG.MOCK_MODE);

	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		try {
			const result = mockLogin(credentials.email, credentials.password);
			return result;
		} catch (error) {
			// ✅ Re-throw with clean message
			const message = error instanceof Error ? error.message : 'Login failed';
			throw new Error(message);
		}
	}

	try {
		const { data } = await axiosInstance.post<LoginResponse>(
			'/auth/login',
			credentials,
		);
		return data;
	} catch (error: any) {
		// ✅ Extract meaningful error message
		let message = 'Login failed. Please check your credentials.';

		if (error.response?.data?.message) {
			message = error.response.data.message;
		} else if (error.response?.data?.error) {
			message = error.response.data.error;
		} else if (error.message) {
			message = error.message;
		}

		console.error('[AUTH] Login error:', message);
		throw new Error(message);
	}
}

export async function getProfile(): Promise<User> {
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		const res = mockGetProfile();
		return mapUser(res.data);
	}
	const { data } = await axiosInstance.get<UserResponse>('/auth/me');
	return mapUser(data.data);
}

export async function logout(): Promise<void> {
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		mockLogout();
		return;
	}
	await axiosInstance.post('/auth/logout');
}

export async function forgotPassword(
	reqData: ForgotPasswordRequest,
): Promise<AuthMessageResponse> {
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		mockForgotPassword(reqData.email);
		return {
			success: true,
			message: 'If the email exists, an OTP has been sent',
		};
	}
	const { data } = await axiosInstance.post<AuthMessageResponse>(
		'/auth/forgot-password/send-otp',
		reqData,
	);
	return data;
}

export async function verifyOtp(
	reqData: VerifyOtpRequest,
): Promise<AuthMessageResponse> {
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		mockVerifyOtp(reqData.email, reqData.otp);
		return { success: true, message: 'OTP verified successfully' };
	}
	const { data } = await axiosInstance.post<AuthMessageResponse>(
		'/auth/forgot-password/verify-otp',
		reqData,
	);
	return data;
}

export async function resetPassword(
	reqData: ResetPasswordRequest,
): Promise<AuthMessageResponse> {
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		mockResetPassword(reqData.email, reqData.otp, reqData.new_password);
		return { success: true, message: 'Password reset successfully' };
	}
	const { data } = await axiosInstance.post<AuthMessageResponse>(
		'/auth/forgot-password/reset-password',
		reqData,
	);
	return data;
}

export async function changePassword(
	reqData: ChangePasswordRequest,
): Promise<AuthMessageResponse> {
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		mockChangePassword(reqData.old_password, reqData.new_password);
		return { success: true, message: 'Password changed successfully' };
	}
	const { data } = await axiosInstance.post<AuthMessageResponse>(
		'/auth/change-password',
		reqData,
	);
	return data;
}

export async function refreshAccessToken(): Promise<{
	access_token: string;
	refresh_token: string;
}> {
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		return { access_token: 'mock_access', refresh_token: 'mock_refresh' };
	}
	const refreshToken = getRefreshToken();
	if (!refreshToken) throw new Error('No refresh token available');
	const { data } = await axios.post(
		`${APP_CONFIG.API_BASE_URL}/auth/refresh-tokens`,
		{
			refresh_token: refreshToken,
		},
	);
	return data;
}