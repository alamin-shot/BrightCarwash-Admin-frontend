import Image from 'next/image';
import { StageDropdown, type StageOption } from '@/components/ui/StageDropdown';
import { ActionsDropdown } from '@/components/ui/ActionsDropdown';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { getPriorityConfig } from '@/lib/priority-utils';
import type { Column } from '@/components/ui/DataTable';
import type { Lead } from '@/types/leads';

interface LeadsColumnsParams {
	onStageChange: (id: string, stageId: string) => void;
	onPriorityChange: (id: string, priority: string) => void;
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

const truncateToMaxWords = (text: string, maxWords: number = 8): string => {
	if (!text) return '';
	const words = text.split(' ');
	if (words.length <= maxWords) return text;
	return words.slice(0, maxWords).join(' ') + '...';
};

const PRIORITY_OPTIONS = [
	{ value: 'LOW', label: 'Low' },
	{ value: 'MEDIUM', label: 'Medium' },
	{ value: 'HIGH', label: 'High' },
	{ value: 'URGENT', label: 'Urgent' },
];

export function createLeadsColumns({
	onStageChange,
	onPriorityChange,
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
					className='w-5 h-5 rounded-md border border-[#E8E8E9] bg-white cursor-pointer accent-[#0098E8] no-row-click'
					checked={allSelected}
					onChange={onSelectAll}
				/>
			),
			className: 'w-12',
			render: (row) => (
				<input
					type='checkbox'
					className='w-5 h-5 rounded-md border border-[#E8E8E9] bg-white cursor-pointer accent-[#0098E8] no-row-click'
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
					{/* <div className='w-6 h-6 rounded-full overflow-hidden border border-white shrink-0'>
						<Image
							src={row.avatar}
							alt={row.name}
							width={24}
							height={24}
							className='object-cover'
						/>
					</div> */}
					<span className='text-[#1B1B1B] font-inter text-sm font-normal leading-[150%] truncate max-w-32'>
						{row.name}
					</span>
				</div>
			),
		},
		{
			key: 'service',
			header: 'Service',
			render: (row) => (
				<span
					className='text-[#1B1B1B] font-inter text-sm block max-w-[180px] truncate'
					title={row.service}
				>
					{truncateToMaxWords(row.service, 8)}
				</span>
			),
		},
		{
			key: 'email',
			header: 'Email',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm truncate block max-w-[180px]'>
					{row.email}
				</span>
			),
		},
		{
			key: 'source',
			header: 'Source',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm truncate block max-w-[140px]'>
					{row.source}
				</span>
			),
		},
		{
			key: 'priority',
			header: 'Priority',
			className: 'no-row-click',
			render: (row) => {
				const config = getPriorityConfig(row.priority);
				return (
					<FilterDropdown
						label={config.label}
						options={PRIORITY_OPTIONS}
						value={row.priority}
						onChange={(val) => onPriorityChange(row.id, val)}
						buttonClassName={`text-xs font-medium capitalize px-2 py-1 rounded-full border ${row.priority === 'URGENT' ? 'border-[#FF4345] text-[#FF4345] bg-[#FFE6E6]' :
							row.priority === 'HIGH' ? 'border-[#FF6B00] text-[#FF6B00] bg-[#FFF0E6]' :
								row.priority === 'MEDIUM' ? 'border-[#FFAF00] text-[#FFAF00] bg-[#FFF7E6]' :
									'border-[#DFE1E7] text-[#777980] bg-[#F1F1F1]'
							}`}
						dropdownOffsetX={-20}
					/>
				);
			},
		},
		{
			key: 'stage',
			header: 'Stage',
			className: 'no-row-click',
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
				<span className='text-[#1B1B1B] font-inter text-sm whitespace-nowrap'>
					{row.date}
				</span>
			),
		},
		{
			key: 'actions',
			header: '',
			className: 'w-12 no-row-click',
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