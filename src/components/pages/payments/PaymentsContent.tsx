'use client';

import { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/MetricCard';
import { PaymentsTable } from '@/components/pages/payments/PaymentsTable';
import { useGetPaymentDataQuery } from '@/services/payment.api';
import { useExportExcel } from '@/hooks/useExportExcel';
import { usePaymentFilters } from '@/hooks/usePaymentFilters';
import { toast } from 'react-toastify';

export function PaymentsContent() {
	const { data, isLoading, error } = useGetPaymentDataQuery();
	const payments = data?.payments || [];
	const { filteredPayments } = usePaymentFilters(payments);

	const exportColumns = useMemo(
		() => [
			{ key: 'customerName', header: 'Customer Name' },
			{ key: 'service', header: 'Service' },
			{ key: 'transactionId', header: 'Transaction ID' },
			{ key: 'amount', header: 'Amount' },
			{ key: 'status', header: 'Status' },
			{ key: 'date', header: 'Date' },
		],
		[],
	);

	const { handleExport } = useExportExcel({
		data: filteredPayments,
		columns: exportColumns,
		filename: 'payments-export',
	});

	if (isLoading) {
		return (
			<div className='flex flex-col gap-6 w-full'>
				<div className='flex justify-between items-end'>
					<div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
					<div className='flex gap-3'>
						<div className='h-9 w-24 bg-gray-200 rounded animate-pulse' />
						<div className='h-9 w-40 bg-gray-200 rounded animate-pulse' />
					</div>
				</div>
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className='h-35 bg-gray-100 rounded-lg animate-pulse'
						/>
					))}
				</div>
				<div className='h-75 bg-gray-100 rounded-lg animate-pulse' />
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className='flex items-center justify-center py-12 text-[#FF4345] font-inter'>
				Failed to load payments.
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-6 w-full'>
			<div className='flex justify-between items-end gap-3'>
				<h2 className='text-[#0B1220] font-lora text-xl font-bold leading-[100%]'>
					Payments Overview
				</h2>
				<div className='flex items-center gap-3 shrink-0'>
					<Button
						variant='outline'
						className='flex py-2.5 px-4 items-center gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-sm w-auto'
						onClick={() => handleExport()}
					>
						<Icon name='export' width={14} height={14} /> Export
					</Button>
					<Button
						className='flex py-2.5 px-8 items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors w-auto'
						onClick={() => toast.info('Square sync coming soon')}
					>
						<Icon name='square' width={16} height={16} /> Sync with Square
					</Button>
				</div>
			</div>

			<div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
				{data.metrics.map((m) => (
					<MetricCard key={m.id} data={m} />
				))}
			</div>

			<PaymentsTable payments={filteredPayments} />
		</div>
	);
}
