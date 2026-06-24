"use client";

import { Search } from "lucide-react";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import type { CampaignType, CampaignStatus } from "@/types/campaign";
import { TYPE_FILTERS, STATUS_FILTERS } from "@/types/campaign";

interface CampaignsFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    typeFilter: CampaignType;
    onTypeChange: (value: CampaignType) => void;
    statusFilter: CampaignStatus | "All";
    onStatusChange: (value: CampaignStatus | "All") => void;
}

export function CampaignsFilters({
    searchQuery,
    onSearchChange,
    typeFilter,
    onTypeChange,
    statusFilter,
    onStatusChange,
}: CampaignsFiltersProps) {
    return (
        <div className="flex justify-between items-center w-full gap-4 flex-wrap">
            {/* Type tabs */}
            <div className="flex p-1 items-center gap-0.5 rounded-lg bg-[#F6F6F6]">
                {TYPE_FILTERS.map((type) => (
                    <button
                        key={type}
                        onClick={() => onTypeChange(type)}
                        className={`flex py-2 px-4 justify-center items-center gap-1 rounded-md text-sm font-inter transition-all ${typeFilter === type
                                ? "bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] text-[#1B1B1B] font-medium"
                                : "text-[#777980] hover:text-[#1B1B1B]"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Search & Status */}
            <div className="flex items-center gap-2">
                <SearchInput value={searchQuery} onChange={onSearchChange} />
                <FilterDropdown
                    label="All Status"
                    options={STATUS_FILTERS.map((s) => ({ value: s, label: s }))}
                    value={statusFilter === "All" ? "" : statusFilter}
                    onChange={(val: string) =>
                        onStatusChange((val || "All") as CampaignStatus | "All")
                    }
                />
            </div>
        </div>
    );
}

// Search input component
function SearchInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex px-4 py-3 items-center gap-3 rounded-lg border border-[#E8E8E9] bg-white min-w-65">
            <Search size={20} className="text-[#777980] shrink-0" />
            <input
                type="text"
                placeholder="Search campaigns..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent"
            />
        </div>
    );
}