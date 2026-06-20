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
		updateLeadStage: builder.mutation<
			Lead,
			{ id: string; stageId: string; stageName?: string }
		>({
			queryFn: async ({ id, stageId, stageName }) => {
				try {
					if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						const lead = mockLeads.find((l) => l.id === id);
						if (!lead) throw new Error('Lead not found');
						lead.stageId = stageId;
						lead.stage = stageName || lead.stage;
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
			async onQueryStarted(
				{ id, stageId, stageName },
				{ dispatch, queryFulfilled },
			) {
				const patchResult = dispatch(
					leadsApi.util.updateQueryData('getLeads', undefined, (draft) => {
						const lead = draft.find((l) => l.id === id);
						if (lead) {
							lead.stageId = stageId;
							lead.stage = stageName || lead.stage;
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
							stage: body.stage || 'new',
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
					const formData = new FormData();
					formData.append('name', body.name);
					formData.append('email', body.email);
					if (body.phone) formData.append('phone', body.phone);
					formData.append('service', body.service);
					formData.append('vehicle', body.vehicle);
					if (body.source) formData.append('source', body.source);
					if (body.priority) formData.append('priority', body.priority);
					if (body.deposit_status)
						formData.append('deposit_status', body.deposit_status);
					if (body.stage_name) formData.append('stage_name', body.stage_name);
					else if (body.stage) formData.append('stage_name', body.stage);
					if (body.notes)
						body.notes.forEach((note) => formData.append('notes', note));

					const token = getAccessToken();
					const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead`, {
						method: 'POST',
						headers: { Authorization: `Bearer ${token}` },
						body: formData,
					});
					if (!res.ok) throw new Error(`Request failed: ${res.status}`);
					const json = await res.json();
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
			async onQueryStarted(_body, { dispatch, queryFulfilled }) {
				try {
					const { data: newLead } = await queryFulfilled;
					dispatch(
						leadsApi.util.updateQueryData('getLeads', undefined, (draft) => {
							draft.push(newLead);
						}),
					);
				} catch {
					// undo not needed for failed create
				}
			},
		}),
	}),
});

export const {
	useGetLeadsQuery,
	useUpdateLeadStageMutation,
	useCreateLeadMutation,
} = leadsApi;
