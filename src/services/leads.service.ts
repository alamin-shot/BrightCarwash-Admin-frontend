import { APP_CONFIG } from "@/configs/app.config";
import type { Lead } from "@/types/leads";
import { mockLeads } from "@/mocks/leads.mock";
import axiosInstance from "@/lib/axios-instance";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getLeads(): Promise<Lead[]> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    return [...mockLeads];
  }

  const { data } = await axiosInstance.get<Lead[]>("/leads");
  return data;
}

export async function updateLeadStage(
  leadId: string,
  stage: Lead["stage"]
): Promise<Lead> {
  if (APP_CONFIG.MOCK_MODE) {
    await delay(APP_CONFIG.MOCK_DELAY_MS);
    const lead = mockLeads.find((l) => l.id === leadId);
    if (!lead) throw new Error("Lead not found");
    lead.stage = stage;
    return { ...lead };
  }

  const { data } = await axiosInstance.patch<Lead>(`/leads/${leadId}/stage`, { stage });
  return data;
}