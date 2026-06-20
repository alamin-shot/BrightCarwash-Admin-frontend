'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Lead } from '@/types/leads';

export function useLeadFilters(leads: Lead[]) {
	const [searchQuery, setSearchQuery] = useState('');
	const [sourceFilter, setSourceFilter] = useState('');
	const [depositFilter, setDepositFilter] = useState('');

	const filteredLeads = useMemo(
		() =>
			leads
				.filter((lead) => {
					if (!searchQuery) return true;
					const q = searchQuery.toLowerCase();
					return (
						lead.name.toLowerCase().includes(q) ||
						lead.service.toLowerCase().includes(q) ||
						lead.vehicle.toLowerCase().includes(q)
					);
				})
				.filter((lead) => !sourceFilter || lead.source === sourceFilter)
				.filter(
					(lead) => !depositFilter || lead.depositStatus === depositFilter,
				),
		[leads, searchQuery, sourceFilter, depositFilter],
	);

	const uniqueSources = useMemo(
		() => [...new Set(leads.map((l) => l.source))],
		[leads],
	);

	const resetFilters = useCallback(() => {
		setSearchQuery('');
		setSourceFilter('');
		setDepositFilter('');
	}, []);

	return {
		searchQuery,
		setSearchQuery,
		sourceFilter,
		setSourceFilter,
		depositFilter,
		setDepositFilter,
		filteredLeads,
		uniqueSources,
		resetFilters,
	};
}
