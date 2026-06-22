import { APP_CONFIG } from '@/configs/app.config';
import type { Template } from '@/types/template';
import {
	mockSavedTemplates,
	mockCampaignTemplates,
} from '@/mocks/template.mock';
import axiosInstance from '@/lib/axios-instance';

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSavedTemplates(): Promise<Template[]> {
	if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		const stored =
			typeof window !== 'undefined'
				? JSON.parse(localStorage.getItem('savedTemplates') || '[]')
				: [];
		return [...mockSavedTemplates, ...stored];
	}
	const { data } = await axiosInstance.get<Template[]>('/templates/saved');
	return data;
}

export async function getCampaignTemplates(): Promise<Template[]> {
	if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		return [...mockCampaignTemplates];
	}
	const { data } = await axiosInstance.get<Template[]>('/templates/campaign');
	return data;
}
