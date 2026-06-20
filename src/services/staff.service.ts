import { APP_CONFIG } from '@/configs/app.config';
import type { Staff } from '@/types/staffs';
import { mockStaff } from '@/mocks/staff.mock';
import axiosInstance from '@/lib/axios-instance';

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getStaff(): Promise<Staff[]> {
	if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		return mockStaff.map((s) => ({ ...s }));
	}
	const { data } = await axiosInstance.get<Staff[]>('/staff');
	return data;
}
