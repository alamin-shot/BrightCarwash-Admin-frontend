import { APP_CONFIG } from '@/configs/app.config';
import type { Lead } from '@/types/leads';
import { mockLeads } from '@/mocks/leads.mock';
import { getAccessToken } from '@/lib/auth-client';

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchFromBackend<T>(
	url: string,
	options?: RequestInit,
): Promise<T> {
	const token = getAccessToken();
	const res = await fetch(`${APP_CONFIG.API_BASE_URL}${url}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
			...options?.headers,
		},
	});
	if (!res.ok) throw new Error(`Request failed: ${res.status}`);
	return res.json();
}

export async function getLeads(): Promise<Lead[]> {
	if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		return [...mockLeads];
	}
	const json = await fetchFromBackend<{ success: boolean; data: Lead[] }>(
		'/admin/lead?limit=50',
	);
	return json.data;
}

export async function updateLeadStage(
	leadId: string,
	stageId: string,
): Promise<Lead> {
	if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		const lead = mockLeads.find((l) => l.id === leadId);
		if (!lead) throw new Error('Lead not found');
		lead.stageId = stageId;
		return { ...lead };
	}
	const json = await fetchFromBackend<{ success: boolean; data: Lead }>(
		`/admin/lead/${leadId}`,
		{
			method: 'PATCH',
			body: JSON.stringify({ stage_id: stageId }),
		},
	);
	return json.data;
}
