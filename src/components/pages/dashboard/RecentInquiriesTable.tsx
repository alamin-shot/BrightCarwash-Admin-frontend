import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { recentInquiriesColumns } from "@/components/pages/dashboard/RecentInquiriesColumns";
import type { RecentInquiry } from "@/types/dashboard";
import Link from "next/link";

interface RecentInquiriesTableProps {
  data: RecentInquiry[];
}

export function RecentInquiriesTable({ data }: RecentInquiriesTableProps) {
  return (
    <div className="flex flex-col items-start gap-4 flex-1 self-stretch">
      <div className="flex justify-between items-center self-stretch">
        <h3 className="text-[#1A1C21] font-inter text-lg font-semibold leading-[130%] tracking-[0.09px]">
          Recent Inquiries
        </h3>
        <Link href="/leads">
          <Button
            variant="outline"
            className="flex py-[10px] px-4 justify-center items-center gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-sm font-normal"
          >
            <Icon name="view-all" width={16} height={16} />
            View all
          </Button>
        </Link>
      </div>

      <DataTable
        columns={recentInquiriesColumns}
        data={data}
        rowKey={(row: RecentInquiry) => row.id}
      />
    </div>
  );
}