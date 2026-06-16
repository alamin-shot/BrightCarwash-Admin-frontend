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
      <div className="flex flex-col gap-4 p-4 w-full">
        <div className="flex justify-between items-end self-stretch">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-3 self-stretch max-md:flex-col">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 h-[140px] bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="flex gap-4 self-stretch max-md:flex-col">
          <div className="flex-[2] h-[300px] bg-gray-100 rounded-lg animate-pulse" />
          <div className="flex-1 h-[300px] bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse self-stretch" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center p-8 text-[#FF4345] font-inter">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <div className="flex justify-between items-end self-stretch">
        <h2 className="text-[#0B1220] font-lora text-xl font-bold leading-[100%]">
          Key Metrics
        </h2>
        <Link href="/leads">
          <Button className="flex py-[10px] px-4 justify-center items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm font-normal hover:bg-[#0088D8] transition-colors">
            <Icon name="plus" width={16} height={16} />
            New Lead
          </Button>
        </Link>
      </div>

      <MetricsRow metrics={data.metrics} />

      <div className="flex items-start gap-4 self-stretch max-md:flex-col">
        <InquiriesChart data={data.chartData} />
        <ServiceMixChart data={data.serviceMix} />
      </div>

      <RecentInquiriesTable data={data.recentInquiries} />
    </div>
  );
}