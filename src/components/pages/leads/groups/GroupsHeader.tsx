"use client";

import { Search } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

interface GroupsHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onExport: () => void;  // Keep but hidden - parent handles it
    exportDisabled: boolean;
    onAddGroup: () => void;
}

export function GroupsHeader({
    searchQuery,
    onSearchChange,
    onExport,
    exportDisabled,
    onAddGroup,
}: GroupsHeaderProps) {
    return (
        <div className="flex items-center gap-3 flex-wrap">
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

        </div>
    );
}