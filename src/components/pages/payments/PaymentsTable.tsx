'use client';

import { useState } from 'react';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { paymentsColumns } from '@/components/pages/payments/PaymentsColumns';
import type { PaymentTransaction } from '@/types/payment';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
	payments: PaymentTransaction[];
	meta?: { totalItems: number; itemsPerPage: number; totalPages: number; currentPage: number; hasNextPage: boolean; hasPreviousPage: boolean } | null;
	search: string;
	status: string;
	onSearchChange: (value: string) => void;
	onSearchSubmit: () => void; // ✅ Added
	onStatusChange: (value: string) => void;
	currentPage: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = [
	{ value: 'PAID', label: 'Paid' },
	{ value: 'PENDING', label: 'Pending' },
	{ value: 'FAILED', label: 'Failed' },
	{ value: 'REFUNDED', label: 'Refunded' },
];

export function PaymentsTable({
	payments,
	meta,
	search,
	status,
	onSearchChange,
	onSearchSubmit,
	onStatusChange,
	currentPage,
	onPageChange,
	isLoading = false,
}: Props) {
	const [inputValue, setInputValue] = useState(search);
	const totalPages = meta?.totalPages || 1;
	const totalItems = meta?.totalItems || payments.length;

	const hasData = payments.length > 0;
	const showLoadingOverlay = isLoading && hasData;

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onSearchChange(inputValue);
			onSearchSubmit();
		}
	};

	const handleSearchClick = () => {
		onSearchChange(inputValue);
		onSearchSubmit();
	};

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="flex justify-between items-center gap-4">
				{/* Search Input with Button */}
				<div className="flex flex-1 max-w-[400px]">
					<div className="flex px-4 py-3 items-center gap-3 rounded-l-lg border border-[#E8E8E9] bg-white flex-1 border-r-0">
						<Search size={20} className="text-[#777980] shrink-0" />
						<input
							type="text"
							placeholder="Search payments..."
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleKeyDown}
							className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent"
						/>
					</div>
					<Button
						onClick={handleSearchClick}
						className="rounded-l-none rounded-r-lg px-4 py-3 bg-[#0098E8] text-white hover:bg-[#0088D8] transition-colors whitespace-nowrap"
					>
						Search
					</Button>
				</div>

				<FilterDropdown
					label="All Status"
					options={STATUS_OPTIONS}
					value={status}
					onChange={onStatusChange}
					dropdownOffsetX={-50}
				/>
			</div>

			{/* Table with loading overlay */}
			<div className="w-full border border-[#E8E8E9] rounded-lg overflow-visible relative">
				{showLoadingOverlay && (
					<div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 border-2 border-[#0098E8] border-t-transparent rounded-full animate-spin" />
							<span className="text-[#777980] font-inter text-sm">Loading...</span>
						</div>
					</div>
				)}
				<DataTable
					columns={paymentsColumns}
					data={payments}
					rowKey={(row) => row.id}
					className="w-full"
				/>
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={onPageChange}
				totalItems={totalItems}
				itemsPerPage={ITEMS_PER_PAGE}
				isLoading={isLoading}
			/>
		</div>
	);
}