export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  service: string;
  vehicle: string;
  source: string;
  deposit: number;
  depositStatus: "paid" | "pending" | "refunded" | "none";
  stage: "converted" | "contracted" | "lost" | "new";
  date: string;
}

export interface CreateLeadRequest {
  name: string;
  phone: string;
  email: string;
  service: string;
  vehicle: string;
  source: string;
  deposit: number;
  depositStatus: Lead["depositStatus"];
  stage: Lead["stage"];
}

export type LeadDepositStatus = Lead["depositStatus"];
export type LeadStage = Lead["stage"];