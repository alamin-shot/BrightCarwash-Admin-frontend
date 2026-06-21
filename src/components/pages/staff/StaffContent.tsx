'use client';

import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { RoleToggle } from '@/components/pages/staff/RoleToggle';
import { StaffTable } from '@/components/pages/staff/StaffTable';
import { useGetStaffQuery } from '@/services/staff.api';
import { useStaffFilters } from '@/hooks/useStaffFilters';
import type { StaffStatus } from '@/types/staffs';
import { toast } from 'react-toastify';

export function StaffContent() {
	const { data: staff = [], isLoading, error } = useGetStaffQuery();
	const {
		searchQuery,
		setSearchQuery,
		roleFilter,
		setRoleFilter,
		statusFilter,
		setStatusFilter,
		filteredStaff,
	} = useStaffFilters(staff);

	if (isLoading) {
		return (
			<div className='flex flex-col gap-6 w-full'>
				<div className='flex justify-between items-end'>
					<div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
					<div className='h-9 w-32 bg-gray-200 rounded animate-pulse' />
				</div>
				<div className='flex justify-between items-center'>
					<div className='h-9 w-64 bg-gray-200 rounded animate-pulse' />
					<div className='flex gap-2'>
						<div className='h-9 w-48 bg-gray-200 rounded animate-pulse' />
						<div className='h-9 w-36 bg-gray-200 rounded animate-pulse' />
					</div>
				</div>
				<div className='h-100 bg-gray-100 rounded-lg animate-pulse' />
			</div>
		);
	}

	if (error)
		return (
			<div className='flex items-center justify-center py-12 text-[#FF4345] font-inter'>
				Failed to load staff.
			</div>
		);

	return (
		<div className='flex flex-col gap-6 w-full'>
			<div className='flex justify-between items-end gap-3'>
				<h2 className='text-[#0B1220] font-lora text-xl font-bold leading-[100%]'>
					Staff & Permissions
				</h2>
				<Button
					className='flex py-2.5 px-4 items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors w-auto!'
					onClick={() => toast.info('Invite Staff — coming soon')}
				>
					<Icon name='plus' width={14} height={14} /> Invite Staff
				</Button>
			</div>

			<div className='flex justify-between items-center w-full gap-4 flex-wrap'>
				<RoleToggle value={roleFilter} onChange={setRoleFilter} />

				<div className='flex items-center gap-2'>
					<div className='flex px-4 py-3 items-center gap-3 rounded-lg border border-[#E8E8E9] bg-white min-w-65'>
						<Search size={20} className='text-[#777980] shrink-0' />
						<input
							type='text'
							placeholder='Search staff by name, email, role...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent'
						/>
					</div>
					<FilterDropdown
						label='All Status'
						options={[
							{ value: 'Active', label: 'Active' },
							{ value: 'Inactive', label: 'Inactive' },
							{ value: 'Pending', label: 'Pending' },
							{ value: 'Invited', label: 'Invited' },
						]}
						value={statusFilter === 'All' ? '' : statusFilter}
						onChange={(val: string) =>
							setStatusFilter((val || 'All') as StaffStatus | 'All')
						}
					/>
				</div>
			</div>

			<StaffTable staff={filteredStaff} />
		</div>
	);
}
