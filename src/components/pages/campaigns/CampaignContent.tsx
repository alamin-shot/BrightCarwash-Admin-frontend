'use client';

import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { CampaignTable } from '@/components/pages/campaigns/CampaignTable';
import { useGetCampaignsQuery } from '@/services/campaign.api';
import { useCampaignFilters } from '@/hooks/useCampaignFilters';
import type { CampaignType, CampaignStatus } from '@/types/campaign';
import Link from 'next/link';

export function CampaignContent() {
	const { data: campaigns = [], isLoading, error } = useGetCampaignsQuery();
	const {
		searchQuery,
		setSearchQuery,
		typeFilter,
		setTypeFilter,
		statusFilter,
		setStatusFilter,
		filtered,
	} = useCampaignFilters(campaigns);

	if (isLoading) {
		return (
			<div className='flex flex-col gap-6 w-full'>
				<div className='flex justify-between items-end'>
					<div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
					<div className='h-9 w-36 bg-gray-200 rounded animate-pulse' />
				</div>
				<div className='flex justify-between items-center'>
					<div className='h-9 w-48 bg-gray-200 rounded animate-pulse' />
					<div className='flex gap-2'>
						<div className='h-9 w-48 bg-gray-200 rounded animate-pulse' />
						<div className='h-9 w-36 bg-gray-200 rounded animate-pulse' />
					</div>
				</div>
				<div className='h-100 bg-gray-100 rounded-lg animate-pulse' />
			</div>
		);
	}

	if (error)
		return (
			<div className='flex items-center justify-center py-12 text-[#FF4345] font-inter'>
				Failed to load campaigns.
			</div>
		);

	const typeOptions: CampaignType[] = ['All Campaign', 'E-mail Template'];
	const statusOptions: CampaignStatus[] = [
		'Active',
		'Completed',
		'Draft',
		'Scheduled',
	];

	return (
		<div className='flex flex-col gap-6 w-full'>
			<div className='flex justify-between items-end gap-3'>
				<h2 className='text-[#0B1220] font-lora text-xl font-bold leading-[100%]'>
					E-mail Campaigns
				</h2>
				<Link href='/campaigns/create'>
					<Button className='flex py-2.5 px-4 items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors w-auto!'>
						<Icon name='plus' width={14} height={14} /> Create Campaign
					</Button>
				</Link>
			</div>

			<div className='flex justify-between items-center w-full gap-4 flex-wrap'>
				<div className='flex p-1 items-center gap-0.5 rounded-lg bg-[#F6F6F6]'>
					{typeOptions.map((t) => (
						<button
							key={t}
							onClick={() => setTypeFilter(t)}
							className={`flex py-2 px-4 justify-center items-center gap-1 rounded-md text-sm font-inter transition-all ${
								typeFilter === t
									? 'bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] text-[#1B1B1B] font-medium'
									: 'text-[#777980] hover:text-[#1B1B1B]'
							}`}
						>
							{t}
						</button>
					))}
				</div>

				<div className='flex items-center gap-2'>
					<div className='flex px-4 py-3 items-center gap-3 rounded-lg border border-[#E8E8E9] bg-white min-w-65'>
						<Search size={20} className='text-[#777980] shrink-0' />
						<input
							type='text'
							placeholder='Search campaigns...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent'
						/>
					</div>
					<FilterDropdown
						label='All Status'
						options={statusOptions.map((s) => ({ value: s, label: s }))}
						value={statusFilter === 'All' ? '' : statusFilter}
						onChange={(val: string) =>
							setStatusFilter((val || 'All') as CampaignStatus | 'All')
						}
					/>
				</div>
			</div>

			<CampaignTable campaigns={filtered} />
		</div>
	);
}
