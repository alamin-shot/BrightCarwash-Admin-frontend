import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Column } from "@/components/ui/DataTable";
import type { RecentInquiry } from "@/types/dashboard";

const depositStyles: Record<string, string> = {
  paid: "text-[#006F1F] border-[#E8E8E9] bg-white",
  pending: "text-[#FFAF00] border-[#E8E8E9] bg-white",
  refunded: "text-[#FF4345] border-[#E8E8E9] bg-white",
  none: "text-[#777980] border-[#E8E8E9] bg-white",
};

const stageStyles: Record<string, string> = {
  converted: "bg-[#DCF7EA] text-[#006F1F]",
  contracted: "bg-[#FFF7E6] text-[#FFAF00]",
  lost: "bg-[#FFE6E6] text-[#FF4345]",
  new: "bg-[#8ad7ff] text-[#0098E8]",
};

const stageIcons: Record<string, string> = {
  converted: "convert",
  contracted: "contract",
  lost: "lost",
  new: "new",
};

const stageColors: Record<string, string> = {
  converted: "#006F1F",
  contracted: "#FFAF00",
  lost: "#FF4345",
  new: "#0098E8",
};

export const recentInquiriesColumns: Column<RecentInquiry>[] = [
  {
    key: "leadName",
    header: "Lead Name",
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full overflow-hidden border border-white">
          <Image
            src={row.avatar}
            alt={row.name}
            width={24}
            height={24}
            className="object-cover"
          />
        </div>
        <span className="text-[#1B1B1B] font-inter text-sm font-normal leading-[150%] truncate max-w-[120px]">
          {row.name}
        </span>
      </div>
    ),
  },
  {
    key: "service",
    header: "Service",
    render: (row) => (
      <span className="text-[#1B1B1B] font-inter text-sm">{row.service}</span>
    ),
  },
  {
    key: "vehicle",
    header: "Vehicle",
    render: (row) => (
      <span className="text-[#1B1B1B] font-inter text-sm">{row.vehicle}</span>
    ),
  },
  {
    key: "source",
    header: "Source",
    render: (row) => (
      <span className="text-[#1B1B1B] font-inter text-sm">{row.source}</span>
    ),
  },
  {
    key: "deposit",
    header: "Deposit",
    render: (row) => (
      <span
        className={`inline-flex py-[6px] px-2 justify-center items-center gap-1 rounded border text-sm capitalize ${depositStyles[row.deposit]}`}
      >
        {row.deposit}
      </span>
    ),
  },
  {
    key: "stage",
    header: "Stage",
    render: (row) => (
      <span
        className={`inline-flex py-[6px] px-2 justify-center items-center gap-1 rounded text-sm capitalize ${stageStyles[row.stage]}`}
      >
        <Icon name={stageIcons[row.stage]} width={14} height={14} color={stageColors[row.stage]} />
        {row.stage}
      </span>
    ),
  },
  {
    key: "date",
    header: "Date",
    render: (row) => (
      <span className="text-[#1B1B1B] font-inter text-sm">{row.date}</span>
    ),
  },
];