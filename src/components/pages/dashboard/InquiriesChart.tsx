"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { ChartDataPoint } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-full min-h-[250px] bg-gray-100 animate-pulse rounded-lg w-full" />,
});

interface InquiriesChartProps {
  data: ChartDataPoint[];
}

export function InquiriesChart({ data }: InquiriesChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const months = data.map((d) => d.month);
  const inquiries = data.map((d) => d.inquiries);
  const deposits = data.map((d) => d.deposits);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#0098E8", "#B23730"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100],
        colorStops: [
          [
            { offset: 0, color: "#0098E8", opacity: 0.5 },
            { offset: 100, color: "#0098E8", opacity: 0 },
          ],
          [
            { offset: 0, color: "#B23730", opacity: 0.5 },
            { offset: 100, color: "#B23730", opacity: 0 },
          ],
        ],
      },
    },
    dataLabels: { enabled: false },
    grid: { borderColor: "#E8E8E9", strokeDashArray: 4 },
    xaxis: {
      categories: months,
      labels: {
        style: { colors: "#777980", fontSize: "10px" },
        rotate: -45,
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: 6,
    },
    yaxis: {
      labels: { style: { colors: "#777980", fontSize: "10px" } },
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" },
      marker: { show: false },
    },
    legend: { show: false },
  };

  if (!mounted) {
    return <div className="h-full min-h-[250px] bg-gray-100 animate-pulse rounded-lg w-full" />;
  }

  return (
    <div className="w-full h-full p-3 sm:p-4 rounded-lg border border-[#DFE1E7] bg-white flex flex-col gap-2 sm:gap-3">
      <div className="flex justify-between items-end flex-wrap gap-2 shrink-0">
        <h3 className="text-[#1A1C21] font-inter text-base sm:text-lg font-semibold leading-[130%] tracking-[0.09px]">
          Inquiries & deposits
        </h3>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0098E8] shrink-0" />
            <span className="text-[#777980] font-inter text-[10px] sm:text-xs">Inquiries</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B23730] shrink-0" />
            <span className="text-[#777980] font-inter text-[10px] sm:text-xs">Deposits</span>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full min-h-0">
        <Chart
          options={options}
          series={[
            { name: "Inquiries", data: inquiries },
            { name: "Deposits", data: deposits },
          ]}
          type="area"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}