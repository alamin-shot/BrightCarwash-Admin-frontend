import type { PaymentStatsData } from '@/types/payment';

export const PAYMENT_EXPORT_COLUMNS = [
    { key: 'customerName', header: 'Customer Name' },
    { key: 'service', header: 'Service' },
    { key: 'transactionId', header: 'Transaction ID' },
    { key: 'amount', header: 'Amount' },
    { key: 'status', header: 'Status' },
    { key: 'date', header: 'Date' },
];

interface MetricCardData {
    id: string;
    heading: string;
    value: string;
    changePercent: string;
    changeDirection: 'up' | 'down';
    vsLabel: string;
}

export function mapStatsToMetrics(stats: PaymentStatsData): MetricCardData[] {
    const toDirection = (s: string): 'up' | 'down' =>
        s === 'down' ? 'down' : 'up';

    return [
        {
            id: 'totalRevenue',
            heading: 'Total Revenue',
            value: `$${stats.totalRevenue.value}`,
            changePercent: stats.totalRevenue.percentage.replace(/^\+/, ''),
            changeDirection: toDirection(stats.totalRevenue.status),
            vsLabel: 'vs last month',
        },
        {
            id: 'paidDeposits',
            heading: 'Paid Deposits',
            value: String(stats.paidDeposits.value),
            changePercent: stats.paidDeposits.percentage.replace(/^\+/, ''),
            changeDirection: toDirection(stats.paidDeposits.status),
            vsLabel: 'vs last month',
        },
        {
            id: 'pending',
            heading: 'Pending',
            value: String(stats.pending.value),
            changePercent: stats.pending.percentage.replace(/^\+/, ''),
            changeDirection: toDirection(stats.pending.status),
            vsLabel: 'vs last month',
        },
        {
            id: 'failed',
            heading: 'Failed',
            value: String(stats.failed.value),
            changePercent: stats.failed.percentage.replace(/^\+/, ''),
            // Invert direction because an increase in failures is bad
            changeDirection: stats.failed.status === 'up' ? 'down' : 'up',
            vsLabel: 'vs last month',
        },
    ];
}