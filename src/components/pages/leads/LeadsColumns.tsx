import Image from "next/image";
import { StageDropdown } from "@/components/ui/StageDropdown";
import { ActionsDropdown } from "@/components/ui/ActionsDropdown";
import type { Column } from "@/components/ui/DataTable";
import type { Lead, LeadStage } from "@/types/leads";

const depositStatusStyles: Record<string, string> = {
  paid: "text-[#006F1F] border-[#E8E8E9] bg-white",
  pending: "text-[#FFAF00] border-[#E8E8E9] bg-white",
  refunded: "text-[#FF4345] border-[#E8E8E9] bg-white",
  none: "text-[#777980] border-[#E8E8E9] bg-white",
};

interface LeadsColumnsParams {
  onStageChange: (id: string, stage: LeadStage) => void;
  onView: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  allSelected: boolean;
  selectedIds: Set<string>;
}

const stageColors: Record<string, string> = {
  converted: "#006F1F",
  contracted: "#FFAF00",
  lost: "#FF4345",
  new: "#0098E8",
};

export function createLeadsColumns({
  onStageChange,
  onView,
  onDelete,
  onSelectRow,
  onSelectAll,
  allSelected,
  selectedIds,
}: LeadsColumnsParams): Column<Lead>[] {
  return [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          className="w-5 h-5 rounded-md border border-[#E8E8E9] bg-white cursor-pointer accent-[#0098E8]"
          checked={allSelected}
          onChange={onSelectAll}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded-md border border-[#E8E8E9] bg-white cursor-pointer accent-[#0098E8]"
          checked={selectedIds.has(row.id)}
          onChange={() => onSelectRow(row.id)}
        />
      ),
    },
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
      key: "depositStatus",
      header: "Deposit",
      render: (row) => (
        <span className={`inline-flex py-[6px] px-2 justify-center items-center gap-1 rounded border text-sm capitalize ${depositStatusStyles[row.depositStatus]}`}>
          {row.depositStatus}
        </span>
      ),
    },
    {
      key: "stage",
      header: "Stage",
      render: (row) => (
        <StageDropdown
          currentStage={row.stage}
          onSelect={(stage) => onStageChange(row.id, stage)}
        />
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (row) => (
        <span className="text-[#1B1B1B] font-inter text-sm">{row.date}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <ActionsDropdown
          items={[
            { label: "View details", onClick: () => onView(row) },
            { label: "Delete", onClick: () => onDelete(row), variant: "danger" },
          ]}
        />
      ),
    },
  ];
}