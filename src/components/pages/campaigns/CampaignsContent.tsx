"use client";

import { useGetCampaignsQuery } from "@/services/campaign.api";
import { useCampaignFilters } from "@/hooks/useCampaignFilters";
import { useCampaignActions } from "@/hooks/useCampaignActions";
import { CampaignsHeader } from "./CampaignsHeader";
import { CampaignsFilters } from "./CampaignsFilters";
import { CampaignsTable } from "./CampaignsTable";

export function CampaignsContent() {
	const { data: campaigns = [], isLoading, error } = useGetCampaignsQuery();
	const filters = useCampaignFilters(campaigns);
	const actions = useCampaignActions();

	// Loading state
	if (isLoading) {
		return <CampaignsSkeleton />;
	}

	// Error state
	if (error) {
		return (
			<div className="flex items-center justify-center py-12 text-[#FF4345] font-inter">
				Failed to load campaigns.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 w-full">
			<CampaignsHeader />
			<CampaignsFilters
				searchQuery={filters.searchQuery}
				onSearchChange={filters.setSearchQuery}
				typeFilter={filters.typeFilter}
				onTypeChange={filters.setTypeFilter}
				statusFilter={filters.statusFilter}
				onStatusChange={filters.setStatusFilter}
			/>
			<CampaignsTable
				campaigns={filters.filtered}
				onEdit={actions.handleEdit}
				onDelete={actions.handleDelete}
				onLaunch={actions.handleLaunch}
				onStatusAction={actions.handleStatusAction}
				deletingId={actions.deletingId}
			/>
		</div>
	);
}

// Skeleton component
function CampaignsSkeleton() {
	return (
		<div className="flex flex-col gap-6 w-full">
			<div className="flex justify-between items-end">
				<div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
				<div className="h-9 w-36 bg-gray-200 rounded animate-pulse" />
			</div>
			<div className="flex justify-between items-center">
				<div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
				<div className="flex gap-2">
					<div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
					<div className="h-9 w-36 bg-gray-200 rounded animate-pulse" />
				</div>
			</div>
			<div className="h-100 bg-gray-100 rounded-lg animate-pulse" />
		</div>
	);
}