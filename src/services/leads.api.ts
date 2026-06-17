import { createApi } from "@reduxjs/toolkit/query/react";
import type { Lead } from "@/types/leads";
import { APP_CONFIG } from "@/configs/app.config";
import { mockLeads } from "@/mocks/leads.mock";
import axiosInstance from "@/lib/axios-instance";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const leadsApi = createApi({
  reducerPath: "leadsApi",
  baseQuery: async () => ({ data: null }),
  tagTypes: ["Leads"],
  endpoints: (builder) => ({
    getLeads: builder.query<Lead[], void>({
      queryFn: async () => {
        try {
          if (APP_CONFIG.MOCK_MODE) {
            await delay(APP_CONFIG.MOCK_DELAY_MS);
            return { data: mockLeads.map((l) => ({ ...l })) };
          }
          const { data } = await axiosInstance.get<Lead[]>("/leads");
          return { data };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error instanceof Error ? error.message : "Failed to fetch leads",
            },
          };
        }
      },
      providesTags: ["Leads"],
    }),
    updateLeadStage: builder.mutation<Lead, { id: string; stage: Lead["stage"] }>({
      queryFn: async ({ id, stage }) => {
        try {
          if (APP_CONFIG.MOCK_MODE) {
            await delay(APP_CONFIG.MOCK_DELAY_MS);
            const lead = mockLeads.find((l) => l.id === id);
            if (!lead) throw new Error("Lead not found");
            lead.stage = stage;
            return { data: { ...lead } };
          }
          const { data } = await axiosInstance.patch<Lead>(`/leads/${id}/stage`, { stage });
          return { data };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error instanceof Error ? error.message : "Failed to update stage",
            },
          };
        }
      },
      invalidatesTags: ["Leads"],
    }),
  }),
});

export const { useGetLeadsQuery, useUpdateLeadStageMutation } = leadsApi;