'use client';

import { useState, useMemo } from 'react';
import type { Staff, StaffRole, StaffStatus } from '@/types/staffs';

export function useStaffFilters(staff: Staff[]) {
	const [searchQuery, setSearchQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState<StaffRole | 'All'>('All');
	const [statusFilter, setStatusFilter] = useState<StaffStatus | 'All'>('All');

	const filteredStaff = useMemo(
		() =>
			staff
				.filter((s) => {
					if (!searchQuery) return true;
					const q = searchQuery.toLowerCase();
					return (
						s.name.toLowerCase().includes(q) ||
						s.email.toLowerCase().includes(q) ||
						s.role.toLowerCase().includes(q)
					);
				})
				.filter((s) => roleFilter === 'All' || s.role === roleFilter)
				.filter((s) => statusFilter === 'All' || s.status === statusFilter),
		[staff, searchQuery, roleFilter, statusFilter],
	);

	return {
		searchQuery,
		setSearchQuery,
		roleFilter,
		setRoleFilter,
		statusFilter,
		setStatusFilter,
		filteredStaff,
	};
}
