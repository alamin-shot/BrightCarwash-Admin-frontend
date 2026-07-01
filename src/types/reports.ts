export interface StageSummaryData {
    totalLeads: { current: number; lastPeriod: number; percentageChange: number };
    stagedLeads: { current: number; lastPeriod: number; percentageChange: number };
    stagedLeadRate: { current: number; lastPeriod: number; pointDifference: number };
}

export interface StageBreakdownItem {
    stageName: string;
    count: number;
}
export interface LeadStageDatum {
    month: string;
    converted: number;
    contacted: number;
    lost: number;
}
export interface LeadSourceItem {
    source: string;
    count: number;
}

export interface LeadSourcesResponse {
    totalLeads: number;
    eachCount: LeadSourceItem[];
}

export interface ReportsState {
    tab: 'lead-conversion' | 'deposit-revenue' | 'campaign-performance' | 'member-activity';
    period: string;
}