'use client';

import { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { createStaffColumns } from '@/components/pages/staff/StaffColumns';
import type { Staff } from '@/types/staffs';
import { toast } from 'react-toastify';

interface Props {
	staff: Staff[];
}

const ITEMS_PER_PAGE = 10;

export function StaffTable({ staff }: Props) {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.max(1, Math.ceil(staff.length / ITEMS_PER_PAGE));

	const paginated = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return staff.slice(start, start + ITEMS_PER_PAGE);
	}, [staff, currentPage]);

	const handleEditRole = (s: Staff) =>
		toast.info(`Edit role for ${s.name} — coming soon`);
	const handleDelete = (s: Staff) =>
		toast.info(`Delete ${s.name} — coming soon`);
	const handleResendInvite = (s: Staff) =>
		toast.info(`Resend invite to ${s.name} — coming soon`);

	const columns = useMemo(
		() =>
			createStaffColumns({
				onEditRole: handleEditRole,
				onDelete: handleDelete,
				onResendInvite: handleResendInvite,
			}),
		[],
	);

	return (
		<div className='flex flex-col gap-4 w-full'>
			<DataTable
				columns={columns}
				data={paginated}
				rowKey={(row) => row.id}
				className='w-full'
			/>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				totalItems={staff.length}
				itemsPerPage={ITEMS_PER_PAGE}
			/>
		</div>
	);
}
