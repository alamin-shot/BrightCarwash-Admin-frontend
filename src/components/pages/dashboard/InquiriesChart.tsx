"use client";

import dynamic from "next/dynamic";
import type { ChartDataPoint } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg" />,
});

interface InquiriesChartProps {
  data: ChartDataPoint[];
}

export function InquiriesChart({ data }: InquiriesChartProps) {
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
      width: 3,
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
      labels: { style: { colors: "#777980", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#777980", fontSize: "12px" } },
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" },
      marker: { show: false },
    },
    legend: { show: false },
  };

  return (
    <div className="flex-[2] max-md:flex-none max-md:w-full p-4 rounded-lg border border-[#DFE1E7] bg-white flex flex-col gap-3">
      <div className="flex justify-between items-end self-stretch">
        <h3 className="text-[#1A1C21] font-inter text-lg font-semibold leading-[130%] tracking-[0.09px]">
          Inquiries & deposits
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0098E8]" />
            <span className="text-[#777980] font-inter text-xs">Inquiries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B23730]" />
            <span className="text-[#777980] font-inter text-xs">Deposits</span>
          </div>
        </div>
      </div>
      <Chart
        options={options}
        series={[
          { name: "Inquiries", data: inquiries },
          { name: "Deposits", data: deposits },
        ]}
        type="area"
        height={300}
      />
    </div>
  );
}