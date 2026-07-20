import { createApi } from "@reduxjs/toolkit/query/react";
import type { notificationInterfece } from "@/types/notification";
import axiosInstance from "@/lib/axios-instance";

export interface GetNotificationParams {
  page?: number;
  limit?: number;
}

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: async () => ({ data: null }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotification: builder.query<notificationInterfece, GetNotificationParams>({
      queryFn: async (params = { page: 1, limit: 10 }) => {
        try {
          const { data } = await axiosInstance.get<notificationInterfece>(
            `/admin/notifications/offset-feed?page=${params.page}&limit=${params.limit}`,
          );
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error?.response?.status || 500,
              data: error?.response?.data?.message || "Failed to fetch notifications",
            },
          };
        }
      },
      providesTags: ["Notification"],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetNotificationQuery } = notificationApi;
