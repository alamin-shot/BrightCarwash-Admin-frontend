"use client";

import { Search } from 'lucide-react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface ActivityLogFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    action: string;
    onActionChange: (value: string) => void;
    timeRange: string;
    onTimeRangeChange: (value: string) => void;
    actionOptions: string[];
    timeOptions: string[];
}

export function ActivityLogFilters({
    search,
    onSearchChange,
    action,
    onActionChange,
    timeRange,
    onTimeRangeChange,
    actionOptions,
    timeOptions,
}: ActivityLogFiltersProps) {
    return (
        <div className="flex justify-between items-center w-full gap-4 flex-wrap">
            {/* Search Input */}
            <div className="flex-1 max-w-[400px]">
                <div className="flex px-4 py-3 items-center gap-3 rounded-lg border border-[#DFE1E7] bg-white">
                    <Search size={18} className="text-[#777980] shrink-0" />
                    <input
                        type="text"
                        placeholder="Search activity, actor, or lead..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                <FilterDropdown
                    label="All types"
                    options={actionOptions.map((opt) => ({ value: opt, label: opt }))}
                    value={action}
                    onChange={(val: string) => onActionChange(val)}
                />
                <FilterDropdown
                    label="All Time"
                    options={timeOptions.map((opt) => ({ value: opt, label: opt }))}
                    value={timeRange}
                    onChange={(val: string) => onTimeRangeChange(val)}
                />
            </div>
        </div>
    );
}