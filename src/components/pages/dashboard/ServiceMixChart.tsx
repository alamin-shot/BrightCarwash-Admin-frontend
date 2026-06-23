"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { ServiceMixItem } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-full min-h-[350px] bg-gray-100 animate-pulse rounded-lg w-full" />,
});

interface ServiceMixChartProps {
  data: ServiceMixItem[];
}

const donutColors = ["#0098E8", "#B23730", "#777980", "#1B1B1B", "#DFE1E7"];

export function ServiceMixChart({ data }: ServiceMixChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const labels = data.map((d) => d.name);
  const series = data.map((d) => d.percentage);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
    },
    labels,
    colors: donutColors,
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 1,
        opacityTo: 0.6,
        stops: [0, 100],
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Services",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              color: "#777980",
              formatter: () => `${series.reduce((a, b) => a + b, 0)}%`,
            },
            value: {
              fontSize: "24px",
              fontFamily: "Lora, serif",
              fontWeight: 500,
              color: "#0B1220",
              formatter: (val: string) => `${val}%`,
            },
            name: {
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              color: "#777980",
            },
          },
        },
      },
    },
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: "right",
      fontSize: "12px",
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      labels: { colors: "#1B1B1B", useSeriesColors: false },
      markers: { size: 8, shape: "circle", offsetX: -2, offsetY: 0 },
      itemMargin: { horizontal: 0, vertical: 6 },
    },
    tooltip: {
      enabled: true,
      y: { formatter: (val: number) => `${val}%` },
    },
  };

  if (!mounted) {
    return <div className="h-full min-h-[350px] bg-gray-100 animate-pulse rounded-lg w-full" />;
  }

  return (
    <div className="w-full h-auto p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 rounded-lg border border-[#DFE1E7] bg-white">
      <h3 className="shrink-0 text-[#1A1C21] font-inter text-base sm:text-lg font-semibold leading-[130%] tracking-[0.09px]">
        Status Distribution
      </h3>
      <div className="flex-1 w-full min-h-0" style={{ maxWidth: "400px" }}>
        <Chart options={options} series={series} type="donut" height={200} width="100%" />
      </div>
    </div>
  );
}