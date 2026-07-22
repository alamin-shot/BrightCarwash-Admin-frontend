'use client';

import { useCallback } from 'react';
import { exportToExcel } from '@/lib/excel-export';
import { toast } from 'react-toastify';
import { formatCurrency } from '@/lib/payment-utils';

interface UseExportExcelProps<T> {
	data: T[];
	columns: { key: string; header: string }[];
	filename: string;
	format?: 'xlsx' | 'csv';
}

export function useExportExcel<T>({
	data,
	columns,
	filename,
	format = 'xlsx',
}: UseExportExcelProps<T>) {
	const handleExport = useCallback(
		(selectedIds?: Set<string>) => {
			let dataToExport =
				selectedIds && selectedIds.size > 0
					? data.filter((item) =>
						selectedIds.has((item as Record<string, unknown>).id as string),
					)
					: data;

			if (dataToExport.length === 0) {
				toast.warning('No data to export');
				return;
			}


			const formattedData = dataToExport.map((item) => {
				const record = item as Record<string, unknown>;
				// Check if it's a payment transaction (has amount and currency)
				if ('amount' in record && 'currency' in record) {
					return {
						...record,
						amount: formatCurrency(record.amount as number, record.currency as string),
					};
				}
				return record;
			});

			exportToExcel(
				formattedData as Record<string, unknown>[],
				columns,
				`${filename}.${format === 'csv' ? 'csv' : 'xlsx'}`,
			);
			toast.success(`Exported ${dataToExport.length} ${filename}`);
		},
		[data, columns, filename, format],
	);

	return { handleExport };
}