import Image from 'next/image';
import { StageDropdown, type StageOption } from '@/components/ui/StageDropdown';
import { ActionsDropdown } from '@/components/ui/ActionsDropdown';
import type { Column } from '@/components/ui/DataTable';
import type { Lead } from '@/types/leads';

const depositStatusStyles: Record<string, string> = {
	PAID: 'text-[#006F1F] border-[#E8E8E9] bg-white',
	PENDING: 'text-[#FFAF00] border-[#E8E8E9] bg-white',
	REFUNDED: 'text-[#FF4345] border-[#E8E8E9] bg-white',
	NONE: 'text-[#777980] border-[#E8E8E9] bg-white',
};

interface LeadsColumnsParams {
	onStageChange: (id: string, stageId: string) => void;
	onView: (lead: Lead) => void;
	onDelete: (lead: Lead) => void;
	onSelectRow: (id: string) => void;
	onSelectAll: () => void;
	allSelected: boolean;
	selectedIds: Set<string>;
	router: { push: (url: string) => void };
	stages: StageOption[];
	onStageCreated?: () => void;
}

export function createLeadsColumns({
	onStageChange,
	onDelete,
	onSelectRow,
	onSelectAll,
	allSelected,
	selectedIds,
	router,
	stages,
	onStageCreated,
}: LeadsColumnsParams): Column<Lead>[] {
	return [
		{
			key: 'checkbox',
			header: (
				<input
					type='checkbox'
					className='w-5 h-5 rounded-md border border-[#E8E8E9] bg-white cursor-pointer accent-[#0098E8]'
					checked={allSelected}
					onChange={onSelectAll}
				/>
			),
			className: 'w-12',
			render: (row) => (
				<input
					type='checkbox'
					className='w-5 h-5 rounded-md border border-[#E8E8E9] bg-white cursor-pointer accent-[#0098E8]'
					checked={selectedIds.has(row.id)}
					onChange={() => onSelectRow(row.id)}
				/>
			),
		},
		{
			key: 'leadName',
			header: 'Lead Name',
			render: (row) => (
				<div className='flex items-center gap-2'>
					<div className='w-6 h-6 rounded-full overflow-hidden border border-white'>
						<Image
							src={row.avatar}
							alt={row.name}
							width={24}
							height={24}
							className='object-cover'
						/>
					</div>
					<span className='text-[#1B1B1B] font-inter text-sm font-normal leading-[150%] truncate max-w-30'>
						{row.name}
					</span>
				</div>
			),
		},
		{
			key: 'service',
			header: 'Service',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm'>{row.service}</span>
			),
		},
		{
			key: 'vehicle',
			header: 'Vehicle',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm'>{row.vehicle}</span>
			),
		},
		{
			key: 'source',
			header: 'Source',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm'>{row.source}</span>
			),
		},
		{
			key: 'depositStatus',
			header: 'Deposit',
			render: (row) => (
				<span
					className={`inline-flex py-1.5 px-2 justify-center items-center gap-1 rounded border text-sm capitalize ${depositStatusStyles[row.depositStatus] || depositStatusStyles.NONE}`}
				>
					{row.depositStatus}
				</span>
			),
		},
		{
			key: 'stage',
			header: 'Stage',
			render: (row) => (
				<StageDropdown
					currentStage={row.stage}
					stages={stages}
					onSelect={(stageId) => onStageChange(row.id, stageId)}
					onStageCreated={onStageCreated}
				/>
			),
		},
		{
			key: 'date',
			header: 'Date',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm'>{row.date}</span>
			),
		},
		{
			key: 'actions',
			header: '',
			className: 'w-12',
			render: (row) => (
				<ActionsDropdown
					items={[
						{
							label: 'View Lead',
							onClick: () => router.push(`/leads/${row.id}`),
						},
						{
							label: 'Delete',
							onClick: () => onDelete(row),
							variant: 'danger' as const,
						},
					]}
				/>
			),
		},
	];
}
