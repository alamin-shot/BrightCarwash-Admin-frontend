import Image from 'next/image';
import { ActionsDropdown } from '@/components/ui/ActionsDropdown';
import type { Column } from '@/components/ui/DataTable';
import type { Staff } from '@/types/staffs';

const roleStyles: Record<string, string> = {
	Admin: 'bg-[#FFE6E6] text-[#FF4345]',
	Manager: 'bg-[#DCF7EA] text-[#006F1F]',
	Staff: 'bg-[#FFF7E6] text-[#FFAF00]',
	'View Only': 'bg-[#F8FAFB] text-[#777980]',
};

const statusStyles: Record<string, string> = {
	Active: 'bg-[#DCF7EA] text-[#006F1F]',
	Inactive: 'bg-[#F8FAFB] text-[#777980]',
	Pending: 'bg-[#FFF7E6] text-[#FFAF00]',
	Invited: 'bg-[#EBF5FF] text-[#0098E8]',
};

interface StaffColumnsParams {
	onEditRole: (staff: Staff) => void;
	onDelete: (staff: Staff) => void;
	onResendInvite: (staff: Staff) => void;
}

export function createStaffColumns({
	onEditRole,
	onDelete,
	onResendInvite,
}: StaffColumnsParams): Column<Staff>[] {
	return [
		{
			key: 'staffName',
			header: 'Staff Name',
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
					<div>
						<span className='text-[#1B1B1B] font-inter text-sm truncate max-w-30 block'>
							{row.name}
						</span>
						<span className='text-[#777980] font-inter text-xs'>
							{row.email}
						</span>
					</div>
				</div>
			),
		},
		{
			key: 'role',
			header: 'Role',
			render: (row) => (
				<span
					className={`inline-flex py-1.5 px-3 justify-center items-center gap-1 rounded-md text-sm font-medium ${roleStyles[row.role]}`}
				>
					{row.role}
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
			key: 'lastActivity',
			header: 'Last Activity',
			render: (row) => (
				<span className='text-[#1B1B1B] font-inter text-sm'>
					{row.lastActivity}
				</span>
			),
		},
		{
			key: 'actions',
			header: '',
			className: 'w-12',
			render: (row) => {
				const items = [
					{ label: 'Edit Role', onClick: () => onEditRole(row) },
					{
						label: 'Delete Staff',
						onClick: () => onDelete(row),
						variant: 'danger' as const,
					},
				];
				if (row.status === 'Invited') {
					items.splice(1, 0, {
						label: 'Resend Invite',
						onClick: () => onResendInvite(row),
					});
				}
				return <ActionsDropdown items={items} />;
			},
		},
	];
}
