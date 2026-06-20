'use client';

import { useCallback } from 'react';
import { exportToExcel } from '@/lib/excel-export';
import { toast } from 'react-toastify';

interface UseExportExcelProps<T> {
	data: T[];
	columns: { key: string; header: string }[];
	filename: string;
}

export function useExportExcel<T>({
	data,
	columns,
	filename,
}: UseExportExcelProps<T>) {
	const handleExport = useCallback(
		(selectedIds?: Set<string>) => {
			const dataToExport =
				selectedIds && selectedIds.size > 0
					? data.filter((item) =>
							selectedIds.has((item as Record<string, unknown>).id as string),
						)
					: data;

			if (dataToExport.length === 0) {
				toast.warning('No data to export');
				return;
			}

			exportToExcel(
				dataToExport as Record<string, unknown>[],
				columns,
				filename,
			);
			toast.success(`Exported ${dataToExport.length} ${filename}`);
		},
		[data, columns, filename],
	);

	return { handleExport };
}
