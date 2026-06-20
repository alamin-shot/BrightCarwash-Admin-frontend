import { createApi } from "@reduxjs/toolkit/query/react";
import type { Staff } from "@/types/staffs";
import { APP_CONFIG } from "@/configs/app.config";
import { mockStaff } from "@/mocks/staff.mock";
import axiosInstance from "@/lib/axios-instance";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: async () => ({ data: null }),
  endpoints: (builder) => ({
    getStaff: builder.query<Staff[], void>({
      queryFn: async () => {
        try {
          if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
            await delay(APP_CONFIG.MOCK_DELAY_MS);
            return { data: mockStaff.map((s) => ({ ...s })) };
          }
          const { data } = await axiosInstance.get<Staff[]>("/staff");
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error instanceof Error ? error.message : "Failed to fetch staff" } };
        }
      },
    }),
  }),
});

export const { useGetStaffQuery } = staffApi;