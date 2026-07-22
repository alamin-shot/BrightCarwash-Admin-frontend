'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
	setUser,
	setLoading,
	clearAuth,
	initAuth,
} from '@/store/slices/authSlice';
import {
	setTokens,
	clearTokens,
	isAuthenticated as checkAuth,
} from '@/lib/auth-client';
import * as authService from '@/services/auth.service';
import type { LoginCredentials } from '@/types/auth';
import { toast } from 'react-toastify';

export function useAuth() {
	const dispatch = useAppDispatch();
	const { user, isAuthenticated, isLoading } = useAppSelector(
		(state) => state.auth,
	);
	const router = useRouter();

	useEffect(() => {
		dispatch(initAuth());
	}, [dispatch]);

	useEffect(() => {
		if (checkAuth() && !user) {
			dispatch(setLoading(true));
			authService
				.getProfile()
				.then((profile) => dispatch(setUser(profile)))
				.catch(() => {
					clearTokens();
					dispatch(clearAuth());
				});
		}
	}, [user, dispatch]);

	const login = useCallback(
		async (credentials: LoginCredentials) => {
			try {
				console.log('[useAuth] Starting login process...');
				const response = await authService.login(credentials);
				console.log('[useAuth] Login response received, setting tokens...');
				setTokens(
					response.authorization.access_token,
					response.authorization.refresh_token,
				);
				const profile = await authService.getProfile();
				console.log('[useAuth] Profile fetched:', profile);
				dispatch(setUser(profile));
				toast.success('Login successful');
				router.replace('/dashboard');
				return true;
			} catch (error) {
				console.error('[useAuth] Login error:', error);

				clearTokens();
				dispatch(clearAuth());

				const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
				toast.error(errorMessage);

				return false;
			}
		},
		[dispatch, router],
	);

	const logout = useCallback(async () => {
		try {
			await authService.logout();
		} catch {
			// cleanup anyway
		} finally {
			clearTokens();
			dispatch(clearAuth());
			router.push('/login');
			toast.info('Logged out successfully');
		}
	}, [dispatch, router]);

	return { user, isAuthenticated, isLoading, login, logout };
}