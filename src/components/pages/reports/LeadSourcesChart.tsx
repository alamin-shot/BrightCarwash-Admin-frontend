'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { LeadSourceItem } from '@/types/reports';

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
});

interface Props {
    data: LeadSourceItem[];
}

const donutColors = ['#0098E8', '#B23730', '#777980', '#1B1B1B', '#DFE1E7'];

export function LeadSourcesChart({ data }: Props) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const labels = data.map((d) => d.source);
    const series = data.map((d) => d.count);

    const options: ApexCharts.ApexOptions = useMemo(() => ({
        chart: { type: 'donut', fontFamily: 'Inter' },
        labels,
        colors: donutColors,
        plotOptions: {
            pie: {
                donut: {
                    size: '55%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Leads',
                            formatter: () => String(data.reduce((s, i) => s + i.count, 0)),
                        },
                    },
                },
            },
        },
        legend: { position: 'right' },
        dataLabels: { enabled: false },
    }), [labels, series]);

    if (!mounted) return <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />;

    return (
        <div className="p-4 rounded-lg border border-[#DFE1E7] bg-white flex flex-col gap-3">
            <h3 className="text-[#1A1C21] font-inter text-lg font-semibold">Lead Sources</h3>
            <Chart options={options} series={series} type="donut" height={250} />
        </div>
    );
}