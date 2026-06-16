import { createApi } from "@reduxjs/toolkit/query/react";
import type { DashboardData } from "@/types/dashboard";
import { APP_CONFIG } from "@/configs/app.config";
import { mockDashboardData } from "@/mocks/dashboard.mock";
import axiosInstance from "@/lib/axios-instance";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: async () => ({ data: null }),
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      queryFn: async () => {
        try {
          if (APP_CONFIG.MOCK_MODE) {
            await delay(APP_CONFIG.MOCK_DELAY_MS);
            return { data: mockDashboardData };
          }
          const { data } = await axiosInstance.get<DashboardData>("/dashboard");
          return { data };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error instanceof Error ? error.message : "Failed to fetch dashboard",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;