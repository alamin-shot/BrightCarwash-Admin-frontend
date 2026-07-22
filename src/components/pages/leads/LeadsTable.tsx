'use client';

import { forwardRef, useImperativeHandle, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { createLeadsColumns } from '@/components/pages/leads/LeadsColumns';
import { LeadsFilters } from '@/components/pages/leads/LeadsFilters';
import { KanbanBoard } from '@/components/pages/leads/kanban/KanbanBoard';
import { useLeadsData } from '@/hooks/useLeadsData';
import { useLeadsExport } from '@/hooks/useLeadsExport';

export interface LeadsTableHandle {
	exportExcel: () => void;
	exportCSV: () => void;
}

const ITEMS_PER_PAGE = 10;

interface LeadsTableExternalProps {
	viewMode: 'list' | 'kanban';
	onSelectionChange?: (count: number, ids: string[]) => void;
	searchQuery?: string;
	leadType?: 'all' | 'mine';
}

export const LeadsTable = forwardRef<LeadsTableHandle, LeadsTableExternalProps>(
	function LeadsTable({ viewMode, onSelectionChange, searchQuery: externalSearch, leadType = 'all' }, ref) {
		const router = useRouter();

		const {
			leads,
			totalItems,
			totalPages,
			isLoading,
			isPageLoading,
			error,
			paginatedData,
			currentPage,
			setCurrentPage,
			searchTerm,
			setSearchTerm,
			sourceFilter,
			setSourceFilter,
			priorityFilter,
			setPriorityFilter,
			depositFilter,
			setDepositFilter,
			uniqueSources,
			stages,
			refreshStages,
			selectedIds,
			handleSelectRow,
			handleSelectAll,
			handleStageChange,
			handlePriorityChange,
			handleDelete,
			handleSearchSubmit,
		} = useLeadsData(externalSearch, leadType);


		const { exportExcel, exportCSV } = useLeadsExport(leads, selectedIds, {
			search: searchTerm || externalSearch || undefined,
			source: sourceFilter || undefined,
			priority: priorityFilter || undefined,
			depositStatus: depositFilter || undefined,
		});

		useImperativeHandle(ref, () => ({
			exportExcel: () => exportExcel(),
			exportCSV: () => exportCSV()
		}), [exportExcel, exportCSV]);

		useEffect(() => {
			onSelectionChange?.(selectedIds.size, Array.from(selectedIds));
		}, [selectedIds, onSelectionChange]);

		const handleSelectAllCurrentPage = useCallback(() => {
			const allIds = leads.map((l) => l.id);
			const allSelected = allIds.every((id) => selectedIds.has(id));
			allIds.forEach((id) => { if (allSelected) { if (selectedIds.has(id)) handleSelectRow(id); } else { if (!selectedIds.has(id)) handleSelectRow(id); } });
		}, [leads, selectedIds, handleSelectRow]);

		const allCurrentPageSelected = useMemo(() => leads.length > 0 && leads.every((l) => selectedIds.has(l.id)), [leads, selectedIds]);

		const columns = useMemo(() => createLeadsColumns({
			onStageChange: handleStageChange,
			onPriorityChange: handlePriorityChange,
			onView: (lead) => router.push(`/leads/${lead.id}`),
			onDelete: handleDelete,
			onSelectRow: handleSelectRow,
			onSelectAll: handleSelectAllCurrentPage,
			allSelected: allCurrentPageSelected,
			selectedIds,
			router,
			stages,
			onStageCreated: refreshStages,
		}), [handleStageChange, handlePriorityChange, handleDelete, handleSelectRow, handleSelectAllCurrentPage, allCurrentPageSelected, selectedIds, leads, router, stages, refreshStages]);

		if (isLoading && !paginatedData) return <div className='h-75 bg-gray-100 rounded-lg animate-pulse w-full' />;
		if (error && !paginatedData) return <div className='flex items-center justify-center py-12 text-[#FF4345] font-inter'>Failed to load leads.</div>;

		return (
			<div className='flex flex-col gap-4 w-full'>
				<LeadsFilters
					searchQuery={searchTerm}
					onSearchChange={setSearchTerm}
					onSearchSubmit={handleSearchSubmit}
					sourceFilter={sourceFilter}
					onSourceChange={(val) => { setSourceFilter(val); setCurrentPage(1); }}
					priorityFilter={priorityFilter}
					onPriorityChange={(val) => { setPriorityFilter(val); setCurrentPage(1); }}
					depositFilter={depositFilter}
					onDepositChange={(val) => { setDepositFilter(val); setCurrentPage(1); }}
					uniqueSources={uniqueSources}
				/>
				{viewMode === 'list' ? (
					<>
						<div className="w-full border border-[#E8E8E9] rounded-lg overflow-visible relative">
							{isPageLoading && paginatedData && (
								<div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
									<div className="flex flex-col items-center gap-2">
										<div className="w-8 h-8 border-2 border-[#0098E8] border-t-transparent rounded-full animate-spin" />
										<span className="text-[#777980] font-inter text-sm">Loading...</span>
									</div>
								</div>
							)}
							<DataTable
								columns={columns}
								data={leads}
								rowKey={(row) => row.id}
								className="w-full"
							/>
						</div>
						<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={totalItems} itemsPerPage={ITEMS_PER_PAGE} isLoading={isPageLoading} />
					</>
				) : (
					<div className='h-[calc(100vh-220px)] overflow-hidden'>
						<KanbanBoard leads={leads} stages={stages} onStageChange={handleStageChange} />
					</div>
				)}
			</div>
		);
	}
);