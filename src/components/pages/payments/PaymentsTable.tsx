'use client';

import { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { paymentsColumns } from '@/components/pages/payments/PaymentsColumns';
import type { Payment } from '@/types/payment';

interface Props {
	payments: Payment[];
}

const ITEMS_PER_PAGE = 10;

export function PaymentsTable({ payments }: Props) {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.max(1, Math.ceil(payments.length / ITEMS_PER_PAGE));

	const paginated = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return payments.slice(start, start + ITEMS_PER_PAGE);
	}, [payments, currentPage]);

	return (
		<div className='flex flex-col gap-4 w-full'>
			<DataTable
				columns={paymentsColumns}
				data={paginated}
				rowKey={(row) => row.id}
				className='w-full'
			/>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				totalItems={payments.length}
				itemsPerPage={ITEMS_PER_PAGE}
			/>
		</div>
	);
}
