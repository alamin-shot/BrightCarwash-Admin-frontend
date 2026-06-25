import { createApi } from "@reduxjs/toolkit/query/react";
import type { Lead, CreateLeadRequest, LeadApiResponse } from "@/types/leads";
import { APP_CONFIG } from "@/configs/app.config";
import { mockLeads } from "@/mocks/leads.mock";
import { getAccessToken } from "@/lib/auth-client";
import type { LeadGroup, LeadGroupsListResponse } from "@/types/campaign";


function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapApiToLead(data: LeadApiResponse): Lead {
	const nameToValue: Record<string, string> = {
		"new lead": "new",
		contracted: "contracted",
		converted: "converted",
		lost: "lost",
	};
	const rawStage = data.stage?.name?.toLowerCase() || "";
	const stageSlug = nameToValue[rawStage] ?? rawStage.replace(/\s+/g, "_");

	return {
		id: data.id,
		name: data.name,
		email: data.email,
		phone: data.phone,
		avatar: "/images/avatar-placeholder.png",
		service: data.service,
		vehicle: data.vehicle,
		source: data.source,
		priority: (data.priority as Lead["priority"]) || "MEDIUM",
		deposit: 0,
		depositStatus: (data.deposit_status as Lead["depositStatus"]) || "NONE",
		stage: stageSlug,
		stageId: data.stage_id,
		assignedToId: data.assigned_to_id || null,
		notes: data.notes || [],
		date: data.created_at?.split("T")[0] || "",
	};
}

async function fetchFromBackend<T>(url: string, options?: RequestInit): Promise<T> {
	const token = getAccessToken();
	const res = await fetch(`${APP_CONFIG.API_BASE_URL}${url}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			...(options?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
			...options?.headers,
		},
	});
	if (!res.ok) throw new Error(`Request failed: ${res.status}`);
	return res.json();
}

export const leadsApi = createApi({
	reducerPath: "leadsApi",
	baseQuery: async () => ({ data: null }),
	// ✅ Add LeadGroups to tagTypes
	tagTypes: ["Leads", "LeadGroups"],
	endpoints: (builder) => ({
		getLeads: builder.query<Lead[], void>({
			queryFn: async () => {
				try {
					if (APP_CONFIG.MOCK_MODE) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						return { data: mockLeads.map((l) => ({ ...l })) };
					}
					const json = await fetchFromBackend<{ success: boolean; data: LeadApiResponse[] }>("/admin/lead?limit=100");
					return { data: (json.data || []).map(mapApiToLead) };
				} catch (error) {
					return { error: { status: 500, data: error instanceof Error ? error.message : "Failed to fetch leads" } };
				}
			},
			providesTags: ["Leads"],
		}),

		updateLeadStage: builder.mutation<Lead, { id: string; stageName: string }>({
			queryFn: async ({ id, stageName }) => {
				try {
					if (APP_CONFIG.MOCK_MODE) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						const lead = mockLeads.find((l) => l.id === id);
						if (!lead) throw new Error("Lead not found");
						lead.stage = stageName.toLowerCase().replace(/\s+/g, "_");
						return { data: { ...lead } };
					}
					const formData = new FormData();
					formData.append("stage_name", stageName);
					const json = await fetchFromBackend<{ success: boolean; data: LeadApiResponse }>(`/admin/lead/${id}`, {
						method: "PATCH",
						body: formData,
					});
					return { data: mapApiToLead(json.data) };
				} catch (error) {
					return { error: { status: 500, data: error instanceof Error ? error.message : "Failed to update stage" } };
				}
			},
			async onQueryStarted({ id, stageName }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					leadsApi.util.updateQueryData("getLeads", undefined, (draft) => {
						const lead = draft.find((l) => l.id === id);
						if (lead) lead.stage = stageName.toLowerCase().replace(/\s+/g, "_");
					})
				);
				try { await queryFulfilled; } catch { patchResult.undo(); }
			},
			invalidatesTags: ["Leads"],
		}),

		createLead: builder.mutation<Lead, CreateLeadRequest>({
			queryFn: async (body) => {
				try {
					if (APP_CONFIG.MOCK_MODE) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						const newLead: Lead = {
							id: `inq_${Date.now()}`,
							avatar: "/images/avatar-placeholder.png",
							date: new Date().toISOString().split("T")[0],
							priority: body.priority || "MEDIUM",
							deposit: 0,
							stage: body.stage || "new",
							stageId: "",
							assignedToId: null,
							notes: body.notes || [],
							name: body.name,
							email: body.email,
							phone: body.phone,
							service: body.service,
							vehicle: body.vehicle,
							source: body.source,
							depositStatus: body.deposit_status || "NONE",
						};
						mockLeads.push(newLead);
						return { data: { ...newLead } };
					}
					const formData = new FormData();
					formData.append("name", body.name);
					formData.append("email", body.email);
					if (body.phone) formData.append("phone", body.phone);
					formData.append("service", body.service);
					formData.append("vehicle", body.vehicle);
					if (body.source) formData.append("source", body.source);
					if (body.priority) formData.append("priority", body.priority);
					if (body.deposit_status) formData.append("deposit_status", body.deposit_status);
					if (body.stage_name) formData.append("stage_name", body.stage_name);
					if (body.notes) body.notes.forEach((n) => formData.append("notes", n));
					const json = await fetchFromBackend<{ success: boolean; data: LeadApiResponse }>("/admin/lead", {
						method: "POST",
						body: formData,
					});
					return { data: mapApiToLead(json.data) };
				} catch (error) {
					return { error: { status: 500, data: error instanceof Error ? error.message : "Failed to create lead" } };
				}
			},
			invalidatesTags: ["Leads"],
			async onQueryStarted(_body, { dispatch, queryFulfilled }) {
				try {
					const { data: newLead } = await queryFulfilled;
					dispatch(leadsApi.util.updateQueryData("getLeads", undefined, (draft) => { draft.push(newLead); }));
				} catch { /* undo not needed */ }
			},
		}),

		getLeadGroups: builder.query<LeadGroup[], { search?: string; page?: number; limit?: number }>({
			queryFn: async (params = {}) => {
				try {
					if (APP_CONFIG.MOCK_MODE) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						return { data: [] };
					}
					const queryParams = new URLSearchParams();
					if (params.search) queryParams.append('search', params.search);
					if (params.page) queryParams.append('page', String(params.page || 1));
					if (params.limit) queryParams.append('limit', String(params.limit || 50));

					const url = `/admin/lead-groups${queryParams.toString() ? `?${queryParams}` : ''}`;
					const json = await fetchFromBackend<LeadGroupsListResponse>(url);
					return { data: json.data.groups };
				} catch (error) {
					return {
						error: {
							status: 500,
							data: error instanceof Error ? error.message : 'Failed to fetch lead groups',
						},
					};
				}
			},
			providesTags: ['LeadGroups'],
			keepUnusedDataFor: 300,
		}),

		deleteLead: builder.mutation<void, string>({
			queryFn: async (id) => {
				try {
					if (APP_CONFIG.MOCK_MODE) {
						await delay(APP_CONFIG.MOCK_DELAY_MS);
						const idx = mockLeads.findIndex((l) => l.id === id);
						if (idx !== -1) mockLeads.splice(idx, 1);
						return { data: undefined };
					}
					await fetchFromBackend(`/admin/lead/${id}`, { method: "DELETE" });
					return { data: undefined };
				} catch (error) {
					return { error: { status: 500, data: error instanceof Error ? error.message : "Failed to delete lead" } };
				}
			},
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					leadsApi.util.updateQueryData("getLeads", undefined, (draft) => {
						const idx = draft.findIndex((l) => l.id === id);
						if (idx !== -1) draft.splice(idx, 1);
					})
				);
				try { await queryFulfilled; } catch { patchResult.undo(); }
			},
			invalidatesTags: ["Leads"],
		}),
	}),
});

export const {
	useGetLeadsQuery,
	useUpdateLeadStageMutation,
	useCreateLeadMutation,
	useGetLeadGroupsQuery,
	useDeleteLeadMutation
} = leadsApi;