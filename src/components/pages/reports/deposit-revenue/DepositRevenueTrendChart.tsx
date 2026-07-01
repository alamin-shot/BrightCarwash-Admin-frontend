'use client';

import { useMemo } from 'react';
import { ChartCard } from '@/components/ui/ChartCard';
import type { DepositRevenueTrendPoint } from '@/types/reports';

interface Props {
    data: DepositRevenueTrendPoint[];
}

export function DepositRevenueTrendChart({ data }: Props) {
    const months = data.map((d) => d.month);
    const revenues = data.map((d) => d.revenue);

    const options: ApexCharts.ApexOptions = useMemo(
        () => ({
            chart: {
                type: 'area',
                toolbar: { show: false },
                fontFamily: 'Inter, sans-serif',
            },
            stroke: { curve: 'smooth', width: 2 },
            colors: ['#0098E8'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 100],
                },
            },
            dataLabels: { enabled: false },
            grid: { borderColor: '#E8E8E9', strokeDashArray: 4 },
            xaxis: {
                categories: months,
                labels: { style: { colors: '#777980', fontSize: '10px' } },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: {
                labels: {
                    style: { colors: '#777980', fontSize: '10px' },
                    formatter: (val: number) => `$${val.toLocaleString()}`,
                },
            },
            tooltip: {
                y: { formatter: (val: number) => `$${val.toLocaleString()}` },
            },
            legend: { show: false },
        }),
        [months, revenues],
    );

    const series = useMemo(
        () => [{ name: 'Revenue', data: revenues }],
        [revenues],
    );

    return (
        <div className="p-3 sm:p-4 rounded-lg border border-[#DFE1E7] bg-white flex flex-col gap-2 sm:gap-3">
            <div className="flex justify-between items-end flex-wrap gap-2 shrink-0">
                <h3 className="text-[#1A1C21] font-inter text-base sm:text-lg font-semibold leading-[130%]">
                    Deposit Revenue Collected
                </h3>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0098E8] shrink-0" />
                    <span className="text-[#777980] font-inter text-[10px] sm:text-xs">Revenue</span>
                </div>
            </div>
            <div className="flex-1 w-full min-h-0">
                <ChartCard options={options} series={series} type="area" height={300} />
            </div>
        </div>
    );
}