'use client';

import { DepositRevenueStats } from './DepositRevenueStats';
import { DepositRevenueTrendChart } from './DepositRevenueTrendChart';
import { mockDepositRevenueSummary, mockDepositRevenueTrend } from '@/mocks/reports.mock';

export function DepositRevenueContent() {
    return (
        <div className="flex flex-col gap-6">
            <DepositRevenueStats data={mockDepositRevenueSummary} />
            <DepositRevenueTrendChart data={mockDepositRevenueTrend} />
        </div>
    );
}