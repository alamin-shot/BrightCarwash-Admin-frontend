"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Button } from '@/components/ui/Button';

interface LeadsFiltersProps {
	searchQuery: string;
	onSearchChange: (val: string) => void;
	onSearchSubmit: () => void;
	sourceFilter: string;
	onSourceChange: (val: string) => void;
	priorityFilter: string;
	onPriorityChange: (val: string) => void;
	depositFilter: string;
	onDepositChange: (val: string) => void;
	uniqueSources: string[];
}

const PRIORITY_OPTIONS = [
	{ value: 'LOW', label: 'Low' },
	{ value: 'MEDIUM', label: 'Medium' },
	{ value: 'HIGH', label: 'High' },
	{ value: 'URGENT', label: 'Urgent' },
];

const DEPOSIT_OPTIONS = [
	{ value: '', label: 'All Deposits' },
	{ value: 'PAID', label: 'Paid' },
	{ value: 'PENDING', label: 'Pending' },
	{ value: 'REFUNDED', label: 'Refunded' },
	{ value: 'NONE', label: 'None' },
];

export function LeadsFilters({
	searchQuery,
	onSearchChange,
	onSearchSubmit,
	sourceFilter,
	onSourceChange,
	priorityFilter,
	onPriorityChange,
	depositFilter,
	onDepositChange,
	uniqueSources,
}: LeadsFiltersProps) {
	const [inputValue, setInputValue] = useState(searchQuery);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onSearchSubmit();
		}
	};

	const handleSearchClick = () => {
		onSearchChange(inputValue);
		onSearchSubmit();
	};

	return (
		<div className='flex items-center gap-2 flex-1 min-w-0 flex-wrap'>
			{/* Search Input with Button */}
			<div className='flex flex-1 min-w-[200px] max-w-[400px]'>
				<div className='flex px-4 py-3 items-center gap-3 rounded-l-lg border border-[#E8E8E9] bg-white flex-1 border-r-0'>
					<Search size={20} className='text-[#777980] shrink-0' />
					<input
						type='text'
						placeholder='Search leads...'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						className='flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent'
					/>
				</div>
				<Button
					onClick={handleSearchClick}
					className='rounded-l-none rounded-r-lg px-4 py-3 bg-[#0098E8] text-white hover:bg-[#0088D8] transition-colors whitespace-nowrap'
				>
					Search
				</Button>
			</div>

			<FilterDropdown
				label='All sources'
				options={uniqueSources.map((s) => ({ value: s, label: s }))}
				value={sourceFilter}
				onChange={onSourceChange}
				scrollable
				maxHeight={200}
			/>

			<FilterDropdown
				label='All Priorities'
				options={PRIORITY_OPTIONS}
				value={priorityFilter}
				onChange={onPriorityChange}
			/>
			{/* 
			<FilterDropdown
				label='All Deposits'
				options={DEPOSIT_OPTIONS}
				value={depositFilter}
				onChange={onDepositChange}
			/> */}
		</div>
	);
}