"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { createCampaignColumns } from "@/components/pages/campaigns/CampaignColumns";
import type { Campaign } from "@/types/campaign";

interface Props {
	campaigns: Campaign[];
	onEdit: (c: Campaign) => void;
	onDelete: (c: Campaign) => void;
	onLaunch?: (c: Campaign) => void;
	onStatusAction?: (c: Campaign, action: "SUSPEND" | "RESTART") => void;
	deletingId?: string | null;
}

const ITEMS_PER_PAGE = 8;

export function CampaignTable({
	campaigns,
	onEdit,
	onDelete,
	onLaunch,
	onStatusAction,
	deletingId,
}: Props) {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.max(1, Math.ceil(campaigns.length / ITEMS_PER_PAGE));
	const paginated = useMemo(
		() =>
			campaigns.slice(
				(currentPage - 1) * ITEMS_PER_PAGE,
				currentPage * ITEMS_PER_PAGE
			),
		[campaigns, currentPage]
	);

	const columns = useMemo(
		() =>
			createCampaignColumns({
				onEdit,
				onDelete,
				onLaunch,
				onStatusAction,
			}),
		[onEdit, onDelete, onLaunch, onStatusAction]
	);

	return (
		<div className="flex flex-col gap-4 w-full">
			<DataTable
				columns={columns}
				data={paginated}
				rowKey={(row) => row.id}
				className="w-full"
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