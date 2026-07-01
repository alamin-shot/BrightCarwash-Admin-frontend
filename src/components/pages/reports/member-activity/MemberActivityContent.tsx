'use client';

import { MemberActivityStats } from './MemberActivityStats';
import { MemberActivityTable } from './MemberActivityTable';
import { useGetMemberHighlightsQuery, useGetMemberTableQuery } from '@/services/reports.api';
import { usePaymentPageState } from '@/hooks/usePaymentPageState';

interface Props {
    startDate: string;
    endDate: string;
}

export function MemberActivityContent({ startDate, endDate }: Props) {
    const { page, setPage } = usePaymentPageState();

    const { data: highlights, isLoading: highlightsLoading } = useGetMemberHighlightsQuery({ startDate, endDate });
    const { data: tableData, isLoading: tableLoading } = useGetMemberTableQuery({ page, limit: 10 });

    if (highlightsLoading || tableLoading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-lg" />
                    ))}
                </div>
                <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <MemberActivityStats data={highlights!} />
            <MemberActivityTable
                data={tableData?.data || []}
                currentPage={page}
                totalPages={tableData?.meta.totalPages || 1}
                totalItems={tableData?.meta.totalItems || 0}
                onPageChange={setPage}
            />
        </div>
    );
}