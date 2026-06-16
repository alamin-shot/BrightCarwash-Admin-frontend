import { APP_CONFIG } from "@/configs/app.config";
import type { DashboardData } from "@/types/dashboard";
import { mockDashboardData } from "@/mocks/dashboard.mock";
import axiosInstance from "@/lib/axios-instance";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDashboardData(): Promise<DashboardData> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    return mockDashboardData;
  }

  const { data } = await axiosInstance.get<DashboardData>("/dashboard");
  return data;
}