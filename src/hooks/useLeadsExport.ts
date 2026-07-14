import { useCallback, useMemo } from 'react';
import { useExportExcel } from '@/hooks/useExportExcel';
import { toast } from 'react-toastify';
import type { Lead } from '@/types/leads';

const exportColumns = [
    { key: 'name', header: 'Lead Name' },
    { key: 'service', header: 'Service' },
    { key: 'email', header: 'Email' },
    { key: 'source', header: 'Source' },
    { key: 'depositStatus', header: 'Deposit' },
    { key: 'stage', header: 'Stage' },
    { key: 'date', header: 'Date' },
];

export function useLeadsExport(leads: Lead[], selectedIds: Set<string>) {
    const { handleExport: exportExcel } = useExportExcel({
        data: leads,
        columns: exportColumns,
        filename: 'leads-export',
    });

    const exportCSV = useCallback(() => {
        const dataToExport = selectedIds.size > 0
            ? leads.filter((item) => selectedIds.has(item.id))
            : leads;

        if (dataToExport.length === 0) {
            toast.warning('No data to export');
            return;
        }

        const headers = exportColumns.map(col => `"${col.header}"`).join(',');
        const rows = dataToExport.map(row =>
            exportColumns.map(col => {
                const value = row[col.key as keyof Lead];
                if (value === null || value === undefined) return '""';
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
        );

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'leads-export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Exported ${dataToExport.length} leads as CSV`);
    }, [leads, selectedIds]);

    return { exportExcel, exportCSV };
}