"use client";

import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

const STATUS_OPTIONS = [

    { value: 'true', label: 'Published' },
    { value: 'false', label: 'Draft' },
];

const SORT_OPTIONS = [
    { value: 'created_at_desc', label: 'Newest' },
    { value: 'created_at_asc', label: 'Oldest' },

];

interface TestimonialsFiltersProps {
    searchInput: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    onSearchKeyDown: (e: React.KeyboardEvent) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    sortFilter: string;
    onSortChange: (value: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function TestimonialsFilters({
    searchInput,
    onSearchChange,
    onSearchSubmit,
    onSearchKeyDown,
    statusFilter,
    onStatusChange,
    sortFilter,
    onSortChange,
    viewMode,
    onViewModeChange,
}: TestimonialsFiltersProps) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="flex">
                    <div className="flex px-4 py-3 items-center gap-3 rounded-l-lg border border-[#E8E8E9] bg-white flex-1 border-r-0 w-56">
                        <Icon name="search" width={20} height={20} color="#777980" />
                        <input
                            type="text"
                            placeholder="Search testimonials…"
                            value={searchInput}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={onSearchKeyDown}
                            className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent"
                        />
                    </div>
                    <Button
                        onClick={onSearchSubmit}
                        className="rounded-l-none rounded-r-lg px-4 py-3 bg-[#0098E8] text-white hover:bg-[#0088D8] transition-colors"
                    >
                        Search
                    </Button>
                </div>

                <FilterDropdown
                    label="All Status"
                    options={STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={onStatusChange}
                />

                <FilterDropdown
                    label="Sort by"
                    options={SORT_OPTIONS}
                    value={sortFilter}
                    onChange={onSortChange}
                />
            </div>

            {/* View Toggle */}
            <div className="flex p-1 bg-[#F1F1F1] rounded-lg border border-[#DFE1E7]">
                <Button
                    variant="icon"
                    onClick={() => onViewModeChange('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                        ? 'bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.05)]'
                        : 'hover:bg-white/50'
                        }`}
                >
                    <Icon
                        name="grid"
                        width={20}
                        height={20}
                        color={viewMode === 'grid' ? '#1B1B1B' : '#777980'}
                    />
                </Button>
                <Button
                    variant="icon"
                    onClick={() => onViewModeChange('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                        ? 'bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.05)]'
                        : 'hover:bg-white/50'
                        }`}
                >
                    <Icon
                        name="list"
                        width={20}
                        height={20}
                        color={viewMode === 'list' ? '#1B1B1B' : '#777980'}
                    />
                </Button>
            </div>
        </div>
    );
}