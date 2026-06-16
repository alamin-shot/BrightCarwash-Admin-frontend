export interface MetricCard {
  id: string;
  heading: string;
  value: string;
  changePercent: string;
  changeDirection: "up" | "down";
  vsLabel: string;
}

export interface ChartDataPoint {
  month: string;
  inquiries: number;
  deposits: number;
}

export interface ServiceMixItem {
  name: string;
  percentage: number;
}

export interface RecentInquiry {
  id: string;
  name: string;
  avatar: string;
  service: string;
  vehicle: string;
  source: string;
  deposit: "paid" | "pending" | "refunded" | "none";
  stage: "converted" | "contracted" | "lost" | "new";
  date: string;
}

export interface DashboardData {
  metrics: MetricCard[];
  chartData: ChartDataPoint[];
  serviceMix: ServiceMixItem[];
  recentInquiries: RecentInquiry[];
}