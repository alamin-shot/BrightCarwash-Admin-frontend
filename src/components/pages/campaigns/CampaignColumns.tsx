import { ActionsDropdown } from '@/components/ui/ActionsDropdown';
import type { Column } from '@/components/ui/DataTable';
import type { Campaign } from '@/types/campaign';

const statusStyles: Record<string, string> = {
	Active: 'bg-[#DCF7EA] text-[#006F1F]',
	Completed: 'bg-[#EBF5FF] text-[#0098E8]',
	Draft: 'bg-[#F8FAFB] text-[#777980]',
	Scheduled: 'bg-[#FFF7E6] text-[#FFAF00]',
};

interface CampaignColumnsParams {
	onEdit: (c: Campaign) => void;
	onDelete: (c: Campaign) => void;
}

export function createCampaignColumns({
	onEdit,
	onDelete,
}: CampaignColumnsParams): Column<Campaign>[] {
	return [
		{
			key: 'checkbox',
			header: (
				<input
					type='checkbox'
					className='w-5 h-5 rounded-md border border-[#E8E8E9] bg-white cursor-pointer accent-[#0098E8]'
				/>
			),
			className: 'w-12',
			render: () => (
				<input
					type='checkbox'
					className='w-5 h-5 rounded-md border border-[#E8E8E9] bg-white cursor-pointer accent-[#0098E8]'
				/>
			),
		},
		{
			key: 'name',
			header: 'Campaign Name',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm font-medium'>
					{row.name}
				</span>
			),
		},
		{
			key: 'subject',
			header: 'Subject',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm truncate max-w-50 block'>
					{row.subject}
				</span>
			),
		},
		{
			key: 'recipients',
			header: 'Recipients',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm'>
					{row.recipients.toLocaleString()}
				</span>
			),
		},
		{
			key: 'clicks',
			header: 'Clicks',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm'>
					{row.clicks.toLocaleString()}
				</span>
			),
		},
		{
			key: 'status',
			header: 'Status',
			render: (row) => (
				<span
					className={`inline-flex py-1.5 px-3 justify-center items-center gap-1 rounded-md text-sm font-medium ${statusStyles[row.status]}`}
				>
					{row.status}
				</span>
			),
		},
		{
			key: 'actions',
			header: '',
			className: 'w-12',
			render: (row) => (
				<ActionsDropdown
					items={[
						{ label: 'Edit', onClick: () => onEdit(row) },
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
