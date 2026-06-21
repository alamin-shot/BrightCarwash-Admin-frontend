import { createApi } from '@reduxjs/toolkit/query/react';
import type { Campaign } from '@/types/campaign';
import { APP_CONFIG } from '@/configs/app.config';
import { mockCampaigns } from '@/mocks/campaign.mock';
import axiosInstance from '@/lib/axios-instance';

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const campaignApi = createApi({
	reducerPath: 'campaignApi',
	baseQuery: async () => ({ data: null }),
	endpoints: (builder) => ({
		getCampaigns: builder.query<Campaign[], void>({
			queryFn: async () => {
				try {
					if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						return { data: mockCampaigns.map((c) => ({ ...c })) };
					}
					const { data } = await axiosInstance.get<Campaign[]>('/campaigns');
					return { data };
				} catch (error) {
					return {
						error: {
							status: 500,
							data:
								error instanceof Error
									? error.message
									: 'Failed to fetch campaigns',
						},
					};
				}
			},
		}),
	}),
});

export const { useGetCampaignsQuery } = campaignApi;
