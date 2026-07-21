import { createApi } from "@reduxjs/toolkit/query/react";
import type { notificationInterfece } from "@/types/notification";
import axiosInstance from "@/lib/axios-instance";
import { ReadAllNotificationInterface } from "@/types/navigation";
import { quoteInterfece } from "@/types/queries";

export interface GetQuotesParams {
  page?: number;
  limit?: number;
}

export const queriesApi = createApi({
  reducerPath: "queriesApi",
  baseQuery: async () => ({ data: null }),
  tagTypes: ["Queries"],
  
  endpoints: (builder) => ({
    getQuotes: builder.query<quoteInterfece, GetQuotesParams>({
      queryFn: async (params = { page: 1, limit: 10 }) => {
        try {
          const { data } = await axiosInstance.get<quoteInterfece>(
            `/admin/quotes?page=${params.page}&limit=${params.limit}`,
          );
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error?.response?.status || 500,
              data: error?.response?.data?.message || "Failed to fetch quotes",
            },
          };
        }
      },
      providesTags: ["Queries"],
      keepUnusedDataFor: 60,
    }),

    // getNotificationMetrics: builder.query<any, void>({
    //   queryFn: async () => {
    //     try {
    //       const { data } = await axiosInstance.get<any>(
    //         "/admin/notifications/metrics",
    //       );
    //       return { data };
    //     } catch (error: any) {
    //       return {
    //         error: {
    //           status: error?.response?.status || 500,
    //           data: error?.response?.data?.message || "Failed to fetch metrics",
    //         },
    //       };
    //     }
    //   },
    // }),
  }),
});

export const { useGetQuotesQuery } = queriesApi;
