'use client';

import { useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { paymentsColumns } from '@/components/pages/payments/PaymentsColumns';
import type { PaymentTransaction } from '@/types/payment';
import { Search } from 'lucide-react';

interface Props {
	payments: PaymentTransaction[];
	meta?: { totalItems: number; itemsPerPage: number; totalPages: number; currentPage: number; hasNextPage: boolean; hasPreviousPage: boolean } | null;
	search: string;
	status: string;
	onSearchChange: (value: string) => void;
	onStatusChange: (value: string) => void;
	currentPage: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean; // ✅ Added loading prop
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
	onStatusChange,
	currentPage,
	onPageChange,
	isLoading = false, // ✅ Default to false
}: Props) {
	const totalPages = meta?.totalPages || 1;
	const totalItems = meta?.totalItems || payments.length;

	// ✅ Check if we have data to show (for initial load)
	const hasData = payments.length > 0;
	const showLoadingOverlay = isLoading && hasData;

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="flex justify-between items-center gap-4">
				<div className="flex px-4 py-3 items-center gap-3 rounded-lg border border-[#E8E8E9] bg-white flex-1 max-w-[400px]">
					<Search size={20} className="text-[#777980] shrink-0" />
					<input
						type="text"
						placeholder="Search payments..."
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent"
					/>
				</div>
				<FilterDropdown
					label="All Status"
					options={STATUS_OPTIONS}
					value={status}
					onChange={onStatusChange}
					dropdownOffsetX={-50}
				/>
			</div>

			{/* ✅ Table with loading overlay */}
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