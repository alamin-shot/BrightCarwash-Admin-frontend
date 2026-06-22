'use client';

import { Search } from 'lucide-react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface LeadsFiltersProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	sourceFilter: string;
	onSourceChange: (val: string) => void;
	depositFilter: string;
	onDepositChange: (val: string) => void;
	uniqueSources: string[];
	groupMode?: "all" | "groups";
}

export function LeadsFilters({
	searchQuery,
	onSearchChange,
	sourceFilter,
	onSourceChange,
	depositFilter,
	onDepositChange,
	uniqueSources,
	groupMode
}: LeadsFiltersProps) {
	const depositOptions = ['PAID', 'PENDING', 'REFUNDED', 'NONE'];

	return (
		<>
			{groupMode !== "groups" && (
				<div className='flex items-center gap-2 flex-1 min-w-0 flex-wrap'>
					<div className='flex px-4 py-3 items-center gap-3 rounded-lg border border-[#E8E8E9] bg-white flex-1 min-w-[200px] max-w-[400px]'>
						<Search size={20} className='text-[#777980] shrink-0' />
						<input
							type='text'
							placeholder='Search leads...'
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className='flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent'
						/>
					</div>
					<FilterDropdown
						label='All sources'
						options={uniqueSources.map((s) => ({ value: s, label: s }))}
						value={sourceFilter}
						onChange={onSourceChange}
					/>
					<FilterDropdown
						label='All deposits'
						options={depositOptions.map((d) => ({ value: d, label: d }))}
						value={depositFilter}
						onChange={onDepositChange}
					/>
				</div>
			)}
		</>
	);
}
