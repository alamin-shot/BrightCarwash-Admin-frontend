import { createApi } from '@reduxjs/toolkit/query/react';
import type { PaymentDashboardData } from '@/types/payment';
import { APP_CONFIG } from '@/configs/app.config';
import { mockPaymentData } from '@/mocks/payment.mock';
import axiosInstance from '@/lib/axios-instance';

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const paymentApi = createApi({
	reducerPath: 'paymentApi',
	baseQuery: async () => ({ data: null }),
	endpoints: (builder) => ({
		getPaymentData: builder.query<PaymentDashboardData, void>({
			queryFn: async () => {
				try {
					if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						return {
							data: {
								...mockPaymentData,
								payments: mockPaymentData.payments.map((p) => ({ ...p })),
							},
						};
					}
					const { data } =
						await axiosInstance.get<PaymentDashboardData>('/payments');
					return { data };
				} catch (error) {
					return {
						error: {
							status: 500,
							data:
								error instanceof Error
									? error.message
									: 'Failed to fetch payments',
						},
					};
				}
			},
		}),
	}),
});

export const { useGetPaymentDataQuery } = paymentApi;
