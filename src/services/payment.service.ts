import { APP_CONFIG } from '@/configs/app.config';
import type { PaymentDashboardData } from '@/types/payment';
import { mockPaymentData } from '@/mocks/payment.mock';
import axiosInstance from '@/lib/axios-instance';

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getPaymentData(): Promise<PaymentDashboardData> {
	if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		return {
			...mockPaymentData,
			payments: mockPaymentData.payments.map((p) => ({ ...p })),
		};
	}
	const { data } = await axiosInstance.get<PaymentDashboardData>('/payments');
	return data;
}
