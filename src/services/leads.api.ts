import { createApi } from '@reduxjs/toolkit/query/react';
import type { Lead, CreateLeadRequest, LeadApiResponse } from '@/types/leads';
import { APP_CONFIG } from '@/configs/app.config';
import { mockLeads } from '@/mocks/leads.mock';
import { getAccessToken } from '@/lib/auth-client';

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapApiToLead(data: LeadApiResponse): Lead {
	return {
		id: data.id,
		name: data.name,
		email: data.email,
		phone: data.phone,
		avatar: '/images/avatar-placeholder.png',
		service: data.service,
		vehicle: data.vehicle,
		source: data.source,
		priority: (data.priority as Lead['priority']) || 'MEDIUM',
		deposit: 0,
		depositStatus: (data.deposit_status as Lead['depositStatus']) || 'NONE',
		stage: data.stage?.name?.toLowerCase() || 'new',
		stageId: data.stage_id,
		assignedToId: data.assigned_to_id || null,
		notes: data.notes || [],
		date: data.created_at?.split('T')[0] || '',
	};
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

export const leadsApi = createApi({
	reducerPath: 'leadsApi',
	baseQuery: async () => ({ data: null }),
	tagTypes: ['Leads'],
	endpoints: (builder) => ({
		getLeads: builder.query<Lead[], void>({
			queryFn: async () => {
				try {
					if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						return { data: mockLeads.map((l) => ({ ...l })) };
					}
					const json = await fetchFromBackend<{
						success: boolean;
						data: LeadApiResponse[];
					}>('/admin/lead?limit=50');
					return { data: json.data.map(mapApiToLead) };
				} catch (error) {
					return {
						error: {
							status: 500,
							data:
								error instanceof Error
									? error.message
									: 'Failed to fetch leads',
						},
					};
				}
			},
			providesTags: ['Leads'],
		}),
		updateLeadStage: builder.mutation<Lead, { id: string; stageId: string }>({
			queryFn: async ({ id, stageId }) => {
				try {
					if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						const lead = mockLeads.find((l) => l.id === id);
						if (!lead) throw new Error('Lead not found');
						lead.stageId = stageId;
						const stageMap: Record<string, string> = {
							stage_new: 'new',
							stage_contracted: 'contracted',
							stage_converted: 'converted',
							stage_lost: 'lost',
						};
						lead.stage = stageMap[stageId] || lead.stage;
						return { data: { ...lead } };
					}
					const json = await fetchFromBackend<{
						success: boolean;
						data: LeadApiResponse;
					}>(`/admin/lead/${id}`, {
						method: 'PATCH',
						body: JSON.stringify({ stage_id: stageId }),
					});
					return { data: mapApiToLead(json.data) };
				} catch (error) {
					return {
						error: {
							status: 500,
							data:
								error instanceof Error
									? error.message
									: 'Failed to update stage',
						},
					};
				}
			},
			async onQueryStarted({ id, stageId }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					leadsApi.util.updateQueryData('getLeads', undefined, (draft) => {
						const lead = draft.find((l) => l.id === id);
						if (lead) {
							lead.stageId = stageId;
							const stageMap: Record<string, string> = {
								stage_new: 'new',
								stage_contracted: 'contracted',
								stage_converted: 'converted',
								stage_lost: 'lost',
							};
							lead.stage = stageMap[stageId] || lead.stage;
						}
					}),
				);
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
			invalidatesTags: ['Leads'],
		}),
		createLead: builder.mutation<Lead, CreateLeadRequest>({
			queryFn: async (body) => {
				try {
					if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						const newLead: Lead = {
							id: `inq_${Date.now()}`,
							avatar: '/images/avatar-placeholder.png',
							date: new Date().toISOString().split('T')[0],
							priority: body.priority || 'MEDIUM',
							deposit: 0,
							stage: 'new',
							stageId: body.stage_id,
							assignedToId: null,
							notes: body.notes || [],
							name: body.name,
							email: body.email,
							phone: body.phone,
							service: body.service,
							vehicle: body.vehicle,
							source: body.source,
							depositStatus: body.deposit_status || 'NONE',
						};
						mockLeads.push(newLead);
						return { data: { ...newLead } };
					}
					const json = await fetchFromBackend<{
						success: boolean;
						data: LeadApiResponse;
					}>('/admin/lead', {
						method: 'POST',
						body: JSON.stringify(body),
					});
					return { data: mapApiToLead(json.data) };
				} catch (error) {
					return {
						error: {
							status: 500,
							data:
								error instanceof Error
									? error.message
									: 'Failed to create lead',
						},
					};
				}
			},
			invalidatesTags: ['Leads'],
		}),
	}),
});

export const {
	useGetLeadsQuery,
	useUpdateLeadStageMutation,
	useCreateLeadMutation,
} = leadsApi;
