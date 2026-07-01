'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { LeadStageHeader } from './LeadStageHeader';
import type { LeadStageDatum } from '@/types/reports'; // we'll define that

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <div className="h-[420px] bg-gray-100 animate-pulse rounded-lg" />,
});

export type StageVisibility = Record<string, boolean>;

interface Props {
    data: LeadStageDatum[];
}

const defaultVisibility: StageVisibility = {
    converted: true,
    contacted: true,
    lost: true,
};

export function LeadStageBreakdownChart({ data }: Props) {
    const [visibility, setVisibility] = useState<StageVisibility>(defaultVisibility);

    const visibleSeries = useMemo(
        () =>
            [
                { key: 'converted', name: 'Converted', color: '#0f7a3c' },
                { key: 'contacted', name: 'Contacted', color: '#f5a623' },
                { key: 'lost', name: 'Lost', color: '#f74646' },
            ].filter((s) => visibility[s.key]),
        [visibility],
    );

    const options: ApexCharts.ApexOptions = useMemo(
        () => ({
            chart: {
                type: 'bar',
                toolbar: { show: false },
                fontFamily: 'Inter, sans-serif',
            },
            plotOptions: { bar: { borderRadius: 4, columnWidth: '32px', grouped: true } },
            grid: { borderColor: '#e5e7eb', strokeDashArray: 3, position: 'back' },
            xaxis: {
                categories: data.map((d) => d.month),
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { style: { colors: '#6b7280', fontSize: '14px' } },
            },
            yaxis: {
                tickAmount: 6,
                labels: {
                    style: { colors: '#9ca3af', fontSize: '13px' },
                    formatter: (val: number) => val.toLocaleString('en-US'),
                },
            },
            colors: visibleSeries.map((s) => s.color),
            tooltip: {
                y: { formatter: (val: number) => val.toLocaleString('en-US') },
            },
            legend: { show: false },
        }),
        [data, visibleSeries],
    );

    const series = useMemo(
        () =>
            visibleSeries.map((s) => ({
                name: s.name,
                data: data.map((d) => d[s.key as keyof LeadStageDatum] as number),
            })),
        [data, visibleSeries],
    );

    return (
        <div className="rounded-2xl border border-[#DFE1E7] bg-white p-6 shadow-sm">
            <LeadStageHeader
                visibility={visibility}
                onToggleStage={(key) =>
                    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
                }
            />
            <div className="mt-6 h-[420px] w-full">
                <Chart options={options} series={series} type="bar" height="100%" width="100%" />
            </div>
        </div>
    );
}