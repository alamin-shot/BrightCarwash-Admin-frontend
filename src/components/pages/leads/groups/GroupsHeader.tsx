"use client";

import { Search } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

interface GroupsHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onExport: () => void;
    exportDisabled: boolean;
}

export function GroupsHeader({ searchQuery, onSearchChange, onExport, exportDisabled }: GroupsHeaderProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex px-4 py-3 items-center gap-3 rounded-lg border border-[#E8E8E9] bg-white max-w-[400px] flex-1">
                <Search size={20} className="text-[#777980] shrink-0" />
                <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent"
                />
            </div>
            <Button
                variant="outline"
                onClick={onExport}
                disabled={exportDisabled}
                className="flex py-2.5 px-4 items-center gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-sm w-auto!"
            >
                <Icon name="export" width={14} height={14} /> Export
            </Button>
        </div>
    );
}