"use client";

import { useState, useMemo, useCallback } from "react";
import type { Campaign, CampaignType, CampaignStatus } from "@/types/campaign";
import { CHANNEL_TO_TYPE } from "@/types/campaign";

export function useCampaignFilters(campaigns: Campaign[]) {
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<CampaignType>("All Campaign");
	const [statusFilter, setStatusFilter] = useState<CampaignStatus | "All">("All");

	const filtered = useMemo(
		() =>
			campaigns.filter((campaign) => {
				// Search
				if (searchQuery) {
					const q = searchQuery.toLowerCase();
					const match =
						campaign.name.toLowerCase().includes(q) ||
						campaign.emailConfig.subject.toLowerCase().includes(q);
					if (!match) return false;
				}

				// Type
				if (typeFilter !== "All Campaign") {
					const displayType = CHANNEL_TO_TYPE[campaign.channelType];
					if (displayType !== typeFilter) return false;
				}

				// Status
				if (statusFilter !== "All" && campaign.status !== statusFilter) {
					return false;
				}

				return true;
			}),
		[campaigns, searchQuery, typeFilter, statusFilter]
	);

	const setSearchQueryMemo = useCallback((value: string) => setSearchQuery(value), []);
	const setTypeFilterMemo = useCallback((value: CampaignType) => setTypeFilter(value), []);
	const setStatusFilterMemo = useCallback(
		(value: CampaignStatus | "All") => setStatusFilter(value),
		[]
	);

	return {
		searchQuery,
		setSearchQuery: setSearchQueryMemo,
		typeFilter,
		setTypeFilter: setTypeFilterMemo,
		statusFilter,
		setStatusFilter: setStatusFilterMemo,
		filtered,
	};
}