'use client';

import { useMemo } from 'react';
import { useGetStageSummaryQuery, useGetStageBreakdownQuery, useGetLeadSourcesQuery } from '@/services/reports.api';
import { LeadConversionStats } from './LeadConversionStats';
import { LeadStageBreakdownChart } from './LeadStageBreakdownChart';
import { LeadSourcesChart } from './LeadSourcesChart';

interface Props {
    startDate: string;
    endDate: string;
}

export function LeadConversionContent({ startDate, endDate }: Props) {
    const { data: summary, isLoading: summaryLoading } = useGetStageSummaryQuery({
        stageName: 'Converted', startDate, endDate,
    });

    const stages = ['Converted', 'Contacted', 'Lost'];
    const { data: breakdown, isLoading: breakdownLoading } = useGetStageBreakdownQuery({ stages });

    const { data: sources, isLoading: sourcesLoading } = useGetLeadSourcesQuery({ startDate, endDate });

    if (summaryLoading || breakdownLoading || sourcesLoading) {
        return <div className="flex flex-col gap-6"><div className="h-16 bg-gray-200 animate-pulse rounded" /><div className="h-[420px] bg-gray-100 animate-pulse rounded" /></div>;
    }

    if (!summary || !breakdown || !sources) {
        return <div className="text-gray-500 py-10 text-center">Failed to load data or no data available.</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <LeadConversionStats summary={summary} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LeadStageBreakdownChart data={breakdown} />
                </div>
                <LeadSourcesChart data={sources} />
            </div>
        </div>
    );
}