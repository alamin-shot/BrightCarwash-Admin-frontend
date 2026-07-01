'use client';

import { CampaignHighlightCard } from './CampaignHighlightCard';
import { CampaignPerformanceTable } from './CampaignPerformanceTable';
import { useGetCampaignHighlightsQuery, useGetCampaignTableQuery } from '@/services/reports.api';
import { usePaymentPageState } from '@/hooks/usePaymentPageState';
import { useMemo } from 'react';

interface Props {
    startDate: string;
    endDate: string;
}

export function CampaignPerformanceContent({ startDate, endDate }: Props) {
    const { page, setPage } = usePaymentPageState();

    const { data: highlights, isLoading: highlightsLoading } = useGetCampaignHighlightsQuery({ startDate, endDate });

    const { data: tableData, isLoading: tableLoading } = useGetCampaignTableQuery({
        page,
        limit: 10,
        startDate,
        endDate,
    });

    if (highlightsLoading || tableLoading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl" />
                    ))}
                </div>
                <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-[#0B1220] font-lora text-xl font-bold">Campaign Performance</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {highlights?.map((h, i) => (
                    <CampaignHighlightCard key={h.id} highlight={h} index={i} />
                ))}
            </div>

            <CampaignPerformanceTable
                data={tableData?.data || []}
                currentPage={page}
                totalPages={tableData?.meta.totalPages || 1}
                totalItems={tableData?.meta.totalItems || 0}
                onPageChange={setPage}
            />
        </div>
    );
}