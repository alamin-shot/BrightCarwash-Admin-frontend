"use client";

import { useRouter } from "next/navigation";
import { useGetCampaignsQuery } from "@/services/campaign.api";
import { useCampaignFilters } from "@/hooks/useCampaignFilters";
import { useCampaignActions } from "@/hooks/useCampaignActions";
import { CampaignsHeader } from "./CampaignsHeader";
import { CampaignsFilters } from "./CampaignsFilters";
import { CampaignsTable } from "./CampaignsTable";

export function CampaignsContent() {
	const router = useRouter();
	const query = useGetCampaignsQuery();
	const { data: campaigns = [], isLoading, error } = query;
	const filters = useCampaignFilters(campaigns);
	const actions = useCampaignActions();

	// ✅ Override handleEdit to navigate with campaign data
	const handleEdit = (campaign: any) => {
		const params = new URLSearchParams({
			id: campaign.id,
			name: campaign.name,
			tags: JSON.stringify(campaign.tags || []),
			subject: campaign.emailConfig?.subject || "",
			senderName: campaign.emailConfig?.senderName || "",
			senderEmail: campaign.emailConfig?.senderEmail || "",
			leadGroupId: campaign.emailConfig?.leadGroup?.id || "",
			leadGroupName: campaign.emailConfig?.leadGroup?.name || "",
			scheduledAt: campaign.scheduledAt || "",
			status: campaign.status || "DRAFT",
			templateId: campaign.templateId || "",
		});
		router.push(`/campaigns/create?edit=true&${params.toString()}`);
	};

	if (isLoading) {
		return <CampaignsSkeleton />;
	}

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
				onEdit={handleEdit}
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