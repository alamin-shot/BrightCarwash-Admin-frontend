import { APP_CONFIG } from '@/configs/app.config';
import type {
	LeadDetail,
	ActivityItem,
	LeadDetailApiResponse,
} from '@/types/lead-detail';
import { mockLeadDetail, mockActivities } from '@/mocks/lead-detail.mock';
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

function mapApiToLeadDetail(data: LeadDetailApiResponse): LeadDetail {
	return {
		id: data.id,
		name: data.name,
		email: data.email,
		phone: data.phone,
		service: data.service,
		vehicle: data.vehicle,
		source: data.source,
		priority: data.priority,
		depositStatus: data.deposit_status,
		stage: data.stage?.name || 'New',
		stageId: data.stage_id,
		stageColor: data.stage?.color || '#0098E8',
		assignedToId: data.assigned_to?.id || null,
		assignedToName: data.assigned_to
			? `${data.assigned_to.first_name} ${data.assigned_to.last_name}`
			: null,
		avatar: '/images/avatar-placeholder.png',
		notes: (data.notes || []).map((n) => ({
			id: n.id,
			content: n.content,
			author: n.author
				? `${n.author.first_name} ${n.author.last_name}`
				: 'Unknown',
			date: n.created_at?.split('T')[0] || '',
		})),
		date: data.created_at?.split('T')[0] || '',
	};
}

export async function getLeadDetail(id: string): Promise<LeadDetail> {
	if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		return { ...mockLeadDetail, id };
	}
	const json = await fetchFromBackend<{
		success: boolean;
		data: LeadDetailApiResponse;
	}>(`/admin/lead/${id}`);
	return mapApiToLeadDetail(json.data);
}

export async function getLeadActivities(id: string): Promise<ActivityItem[]> {
	if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		return [...mockActivities];
	}
	return [...mockActivities]; // Backend doesn't have activity endpoint yet
}

export async function addLeadNote(id: string, content: string): Promise<void> {
	if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		mockLeadDetail.notes.push({
			id: `note_${Date.now()}`,
			content,
			author: 'You',
			date: new Date().toDateString(),
		});
		return;
	}
	await fetchFromBackend(`/admin/lead/${id}`, {
		method: 'PATCH',
		body: JSON.stringify({ notes: [content] }),
	});
}
