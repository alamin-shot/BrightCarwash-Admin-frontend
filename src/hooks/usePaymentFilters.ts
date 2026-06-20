'use client';

import { useState, useMemo } from 'react';
import type { Payment } from '@/types/payment';

export function usePaymentFilters(payments: Payment[]) {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('');

	const filteredPayments = useMemo(
		() =>
			payments
				.filter((p) => {
					if (!searchQuery) return true;
					const q = searchQuery.toLowerCase();
					return (
						p.customerName.toLowerCase().includes(q) ||
						p.service.toLowerCase().includes(q) ||
						p.transactionId.toLowerCase().includes(q)
					);
				})
				.filter((p) => !statusFilter || p.status === statusFilter),
		[payments, searchQuery, statusFilter],
	);

	return {
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		filteredPayments,
	};
}
