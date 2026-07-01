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
}: Props) {
	const totalPages = meta?.totalPages || 1;

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

			<DataTable
				columns={paymentsColumns}
				data={payments}
				rowKey={(row) => row.id}
				className="w-full border border-[#E8E8E9] rounded-lg"
			/>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={onPageChange}
				totalItems={meta?.totalItems || payments.length}
				itemsPerPage={ITEMS_PER_PAGE}
			/>
		</div>
	);
}