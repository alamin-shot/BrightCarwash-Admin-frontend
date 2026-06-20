'use client';

import {
	useState,
	useMemo,
	useCallback,
	forwardRef,
	useImperativeHandle,
	useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { createLeadsColumns } from '@/components/pages/leads/LeadsColumns';
import { LeadsFilters } from '@/components/pages/leads/LeadsFilters';
import { ViewToggle } from '@/components/pages/leads/ViewToggle';
import { KanbanBoard } from '@/components/pages/leads/kanban/KanbanBoard';
import {
	useGetLeadsQuery,
	useUpdateLeadStageMutation,
} from '@/services/leads.api';
import { getStages } from '@/services/stage.service';
import { useExportExcel } from '@/hooks/useExportExcel';
import { useLeadFilters } from '@/hooks/useLeadFilters';
import { useLeadSelection } from '@/hooks/useLeadSelection';
import type { Lead } from '@/types/leads';
import type { StageOption } from '@/components/ui/StageDropdown';
import type { Stage } from '@/types/stage';
import { getAccessToken } from '@/lib/auth-client';
import { APP_CONFIG } from '@/configs/app.config';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

export interface LeadsTableHandle {
	exportCSV: () => void;
}

function mapStagesToOptions(stages: Stage[]): StageOption[] {
	const nameToValue: Record<string, string> = {
		'new lead': 'new',
		contracted: 'contracted',
		converted: 'converted',
		lost: 'lost',
	};
	return stages.map((s) => ({
		value:
			nameToValue[s.name.toLowerCase()] ??
			s.name.toLowerCase().replace(/\s+/g, '_'),
		label: s.name,
		color: s.color,
		stageId: s.id,
	}));
}

async function deleteLeadFromBackend(id: string): Promise<void> {
	const token = getAccessToken();
	const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead/${id}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error('Delete failed');
}

export const LeadsTable = forwardRef<LeadsTableHandle>(
	function LeadsTable(_props, ref) {
		const router = useRouter();
		const { data: leads = [], isLoading, error } = useGetLeadsQuery();
		const [updateStage] = useUpdateLeadStageMutation();
		const {
			searchQuery,
			setSearchQuery,
			sourceFilter,
			setSourceFilter,
			depositFilter,
			setDepositFilter,
			filteredLeads,
			uniqueSources,
		} = useLeadFilters(leads);
		const { selectedIds, handleSelectRow, handleSelectAll } =
			useLeadSelection();
		const [currentPage, setCurrentPage] = useState(1);
		const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
		const [stages, setStages] = useState<StageOption[]>([]);

		useEffect(() => {
			getStages().then((s) => setStages(mapStagesToOptions(s)));
		}, []);

		const refreshStages = useCallback(async () => {
			setStages(mapStagesToOptions(await getStages()));
		}, []);

		const handleStageChange = useCallback(
			async (id: string, stageId: string) => {
				const stageOption = stages.find((s) => s.stageId === stageId);
				const stageName =
					stageOption?.label.toLowerCase().replace(/\s+/g, '_') || undefined;
				try {
					await updateStage({ id, stageId, stageName }).unwrap();
					toast.success('Stage updated');
				} catch {
					toast.error('Failed to update stage');
				}
			},
			[updateStage, stages],
		);

		const handleDelete = useCallback(async (lead: Lead) => {
			try {
				if (APP_CONFIG.MOCK_MODE || APP_CONFIG.DASHBOARD_MOCK) {
					toast.success(`${lead.name} deleted (mock)`);
					return;
				}
				await deleteLeadFromBackend(lead.id);
				toast.success(`${lead.name} deleted`);
			} catch {
				toast.error('Failed to delete lead');
			}
		}, []);

		const totalPages = Math.max(
			1,
			Math.ceil(filteredLeads.length / ITEMS_PER_PAGE),
		);
		useEffect(() => {
			if (currentPage > totalPages) setCurrentPage(1);
		}, [totalPages, currentPage]);

		const paginatedLeads = useMemo(
			() =>
				filteredLeads.slice(
					(currentPage - 1) * ITEMS_PER_PAGE,
					currentPage * ITEMS_PER_PAGE,
				),
			[filteredLeads, currentPage],
		);

		const exportColumns = useMemo(
			() => [
				{ key: 'name', header: 'Lead Name' },
				{ key: 'service', header: 'Service' },
				{ key: 'vehicle', header: 'Vehicle' },
				{ key: 'source', header: 'Source' },
				{ key: 'depositStatus', header: 'Deposit' },
				{ key: 'stage', header: 'Stage' },
				{ key: 'date', header: 'Date' },
			],
			[],
		);

		const { handleExport } = useExportExcel({
			data: filteredLeads,
			columns: exportColumns,
			filename: 'leads-export',
		});
		useImperativeHandle(
			ref,
			() => ({ exportCSV: () => handleExport(selectedIds) }),
			[handleExport, selectedIds],
		);

		const columns = useMemo(
			() =>
				createLeadsColumns({
					onStageChange: handleStageChange,
					onView: (lead) => router.push(`/leads/${lead.id}`),
					onDelete: handleDelete,
					onSelectRow: handleSelectRow,
					onSelectAll: () => handleSelectAll(paginatedLeads.map((l) => l.id)),
					allSelected:
						paginatedLeads.length > 0 &&
						selectedIds.size === paginatedLeads.length,
					selectedIds,
					router,
					stages,
					onStageCreated: refreshStages,
				}),
			[
				handleStageChange,
				handleDelete,
				handleSelectRow,
				handleSelectAll,
				selectedIds,
				paginatedLeads,
				router,
				stages,
				refreshStages,
			],
		);

		if (isLoading)
			return (
				<div className='h-75 bg-gray-100 rounded-lg animate-pulse w-full' />
			);
		if (error)
			return (
				<div className='flex items-center justify-center py-12 text-[#FF4345] font-inter'>
					Failed to load leads.
				</div>
			);

		return (
			<div className='flex flex-col gap-4 w-full'>
				<div className='flex justify-between items-center w-full gap-4 flex-wrap'>
					<LeadsFilters
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						sourceFilter={sourceFilter}
						onSourceChange={setSourceFilter}
						depositFilter={depositFilter}
						onDepositChange={setDepositFilter}
						uniqueSources={uniqueSources}
					/>
					<ViewToggle viewMode={viewMode} onChange={setViewMode} />
				</div>
				{viewMode === 'list' ? (
					<>
						<DataTable
							columns={columns}
							data={paginatedLeads}
							rowKey={(row) => row.id}
							className='w-full'
						/>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
							totalItems={filteredLeads.length}
							itemsPerPage={ITEMS_PER_PAGE}
						/>
					</>
				) : (
					<div className='h-[calc(100vh-220px)] overflow-hidden'>
						<KanbanBoard
							leads={filteredLeads}
							stages={stages}
							onStageChange={handleStageChange}
						/>
					</div>
				)}
			</div>
		);
	},
);
