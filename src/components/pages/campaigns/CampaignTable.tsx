'use client';

import { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Pagination } from '@/components/ui/Pagination';
import { createCampaignColumns } from '@/components/pages/campaigns/CampaignColumns';
import type { Campaign } from '@/types/campaign';
import { toast } from 'react-toastify';

interface Props {
	campaigns: Campaign[];
}
const ITEMS_PER_PAGE = 8;

export function CampaignTable({ campaigns }: Props) {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.max(1, Math.ceil(campaigns.length / ITEMS_PER_PAGE));
	const paginated = useMemo(
		() =>
			campaigns.slice(
				(currentPage - 1) * ITEMS_PER_PAGE,
				currentPage * ITEMS_PER_PAGE,
			),
		[campaigns, currentPage],
	);

	const columns = useMemo(
		() =>
			createCampaignColumns({
				onEdit: (c) => toast.info(`Edit ${c.name} — coming soon`),
				onDelete: (c) => toast.info(`Delete ${c.name} — coming soon`),
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
				totalItems={campaigns.length}
				itemsPerPage={ITEMS_PER_PAGE}
			/>
		</div>
	);
}
