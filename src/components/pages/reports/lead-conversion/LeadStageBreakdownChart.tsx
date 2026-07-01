'use client';

import { useState, useMemo } from 'react';
import { ChartCard } from '@/components/ui/ChartCard';
import { LeadStageHeader } from './LeadStageHeader';
import type { LeadStageDatum } from '@/types/reports';

export type StageVisibility = Record<string, boolean>;

interface Props {
    data: LeadStageDatum[];
}

const defaultVisibility: StageVisibility = {
    converted: true,
    contacted: true,
    lost: true,
};

const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fillMonths(data: LeadStageDatum[]): LeadStageDatum[] {
    return ALL_MONTHS.map((m) => {
        const found = data.find((d) => d.month === m);
        return found || { month: m, converted: 0, contacted: 0, lost: 0 };
    });
}

// Trim trailing months that have all zero values
function trimTrailingEmpty(data: LeadStageDatum[]): LeadStageDatum[] {
    let lastIndex = data.length - 1;
    while (lastIndex >= 0) {
        const d = data[lastIndex];
        if (d.converted > 0 || d.contacted > 0 || d.lost > 0) break;
        lastIndex--;
    }
    return lastIndex >= 0 ? data.slice(0, lastIndex + 1) : data.slice(0, 6); // fallback to 6 months
}

export function LeadStageBreakdownChart({ data }: Props) {
    const [visibility, setVisibility] = useState<StageVisibility>(defaultVisibility);

    const filledData = useMemo(() => {
        const filled = fillMonths(data);
        return trimTrailingEmpty(filled);
    }, [data]);

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
            plotOptions: { bar: { borderRadius: 4, grouped: true } }, // no fixed columnWidth
            grid: { borderColor: '#e5e7eb', strokeDashArray: 3, position: 'back' },
            xaxis: {
                categories: filledData.map((d) => d.month),
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
        [filledData, visibleSeries],
    );

    const series = useMemo(
        () =>
            visibleSeries.map((s) => ({
                name: s.name,
                data: filledData.map((d) => d[s.key as keyof LeadStageDatum] as number),
            })),
        [filledData, visibleSeries],
    );

    return (
        <div className="rounded-2xl border border-[#DFE1E7] bg-white p-6 shadow-sm">
            <LeadStageHeader
                visibility={visibility}
                onToggleStage={(key) =>
                    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
                }
            />
            <div className="mt-6 ">
                <div className="min-w-[300px] h-[420px]">
                    <ChartCard options={options} series={series} type="bar" height={420} />
                </div>
            </div>
        </div>
    );
}