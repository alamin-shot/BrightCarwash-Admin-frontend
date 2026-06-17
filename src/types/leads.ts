export interface Lead {
  id: string;
  name: string;
  avatar: string;
  service: string;
  vehicle: string;
  source: string;
  deposit: "paid" | "pending" | "refunded" | "none";
  stage: "converted" | "contracted" | "lost" | "new";
  date: string;
  [key: string]: string; // index signature for CSV export
}

export type LeadDeposit = Lead["deposit"];
export type LeadStage = Lead["stage"];