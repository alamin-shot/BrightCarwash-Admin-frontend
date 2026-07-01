'use client';

import { MetricCard } from '@/components/ui/MetricCard';
import type { DepositRevenueSummary } from '@/types/reports';

interface Props {
    data: DepositRevenueSummary;
}

export function DepositRevenueStats({ data }: Props) {
    const metrics = [
        {
            id: 'totalDepositRevenue',
            heading: 'Total Deposit Revenue',
            value: `$${data.totalDepositRevenue.current.toLocaleString()}`,
            changePercent: `${data.totalDepositRevenue.percentageChange}%`,
            changeDirection: (data.totalDepositRevenue.percentageChange >= 0 ? 'up' : 'down') as 'up' | 'down',
            vsLabel: 'vs last period',
        },
        {
            id: 'paidDeposits',
            heading: 'Paid Deposits',
            value: String(data.paidDeposits.current),
            changePercent: `${data.paidDeposits.percentageChange}%`,
            changeDirection: (data.paidDeposits.percentageChange >= 0 ? 'up' : 'down') as 'up' | 'down',
            vsLabel: 'vs last period',
        },
        {
            id: 'refunded',
            heading: 'Refunded',
            value: String(data.refunded.current),
            changePercent: `${data.refunded.percentageChange}%`,
            changeDirection: (data.refunded.percentageChange >= 0 ? 'up' : 'down') as 'up' | 'down',
            vsLabel: 'vs last period',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {metrics.map((m) => (
                <MetricCard key={m.id} data={m} />
            ))}
        </div>
    );
}