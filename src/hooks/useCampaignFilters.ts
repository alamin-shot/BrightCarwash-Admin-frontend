'use client';

import { useState, useMemo } from 'react';
import type { Campaign, CampaignType, CampaignStatus } from '@/types/campaign';

export function useCampaignFilters(campaigns: Campaign[]) {
	const [searchQuery, setSearchQuery] = useState('');
	const [typeFilter, setTypeFilter] = useState<CampaignType>('All Campaign');
	const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'All'>(
		'All',
	);

	const filtered = useMemo(
		() =>
			campaigns
				.filter((c) => {
					if (!searchQuery) return true;
					const q = searchQuery.toLowerCase();
					return (
						c.name.toLowerCase().includes(q) ||
						c.subject.toLowerCase().includes(q)
					);
				})
				.filter((c) => typeFilter === 'All Campaign' || c.type === typeFilter)
				.filter((c) => statusFilter === 'All' || c.status === statusFilter),
		[campaigns, searchQuery, typeFilter, statusFilter],
	);

	return {
		searchQuery,
		setSearchQuery,
		typeFilter,
		setTypeFilter,
		statusFilter,
		setStatusFilter,
		filtered,
	};
}
