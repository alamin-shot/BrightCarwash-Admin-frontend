"use client";

import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { MetricsRow } from "@/components/pages/dashboard/MetricsRow";
import { InquiriesChart } from "@/components/pages/dashboard/InquiriesChart";
import { ServiceMixChart } from "@/components/pages/dashboard/ServiceMixChart";
import { RecentInquiriesTable } from "@/components/pages/dashboard/RecentInquiriesTable";
import { useGetDashboardDataQuery } from "@/services/dashboard.api";
import Link from "next/link";

export function DashboardContent() {
  const { data, isLoading, error } = useGetDashboardDataQuery();

  if (isLoading) {
    return (
      <div className="w-full max-w-full flex flex-col gap-3 sm:gap-4">
        <div className="flex justify-between items-end">
          <div className="h-5 w-24 sm:w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 sm:h-9 w-24 sm:w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[100px] sm:h-[140px] bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="w-full lg:w-2/3 h-[250px] sm:h-[300px] bg-gray-100 rounded-lg animate-pulse" />
          <div className="w-full lg:w-1/3 h-[250px] sm:h-[300px] bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-[250px] sm:h-[300px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-[#FFE6E6] flex items-center justify-center mb-4">
          <span className="text-[#FF4345] text-2xl font-bold">!</span>
        </div>
        <h3 className="text-[#1B1B1B] font-inter text-lg font-semibold mb-1">Failed to load</h3>
        <p className="text-[#777980] font-inter text-sm">Please refresh the page or try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full flex flex-col gap-3 sm:gap-4">
      <div className="flex justify-between items-end gap-3">
        <h2 className="text-[#0B1220] font-lora text-lg sm:text-xl font-bold leading-[100%]">
          Key Metrics
        </h2>
        <Link href="/leads" className="shrink-0">
          <Button className="flex py-2 sm:py-[10px] px-3 sm:px-4 justify-center items-center gap-1.5 sm:gap-2 rounded bg-[#0098E8] text-white font-inter text-xs sm:text-sm font-normal hover:bg-[#0088D8] transition-colors">
            <Icon name="plus" width={14} height={14} className="sm:w-4 sm:h-4" />
            <span>New Lead</span>
          </Button>
        </Link>
      </div>

      <MetricsRow metrics={data.metrics} />

      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 !w-full items-stretch">
        <div className="w-full lg:w-2/3">
          <InquiriesChart data={data.chartData} />
        </div>
        <div className="w-full lg:w-1/3">
          <ServiceMixChart data={data.serviceMix} />
        </div>
      </div>

      <RecentInquiriesTable data={data.recentInquiries} />
    </div>
  );
}