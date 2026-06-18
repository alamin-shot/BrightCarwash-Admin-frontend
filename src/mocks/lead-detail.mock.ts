import type { LeadDetail, ActivityItem } from '@/types/lead-detail';

export const mockLeadDetail: LeadDetail = {
	id: 'inq_001',
	name: 'John Smith',
	email: 'john.smith@example.com',
	phone: '0980945309485',
	service: 'Engine Bay Clean',
	vehicle: 'Coupe',
	source: 'Website Form',
	priority: 'HIGH',
	depositStatus: 'PAID',
	stage: 'Converted',
	stageId: 'stage_converted',
	stageColor: '#006F1F',
	assignedToId: null,
	assignedToName: 'Alex Carter',
	avatar: '/images/avatar-placeholder.png',
	notes: [
		{
			id: 'note_1',
			content: 'Customer requested extra polish on the rims.',
			author: 'Madun Laduni',
			date: '12 May, 2026',
		},
		{
			id: 'note_2',
			content: 'Follow up call scheduled for next week.',
			author: 'Alex Carter',
			date: '13 May, 2026',
		},
	],
	date: '12 May, 2026',
};

export const mockActivities: ActivityItem[] = [
	{
		id: 'act_1',
		type: 'stage',
		title: 'Stage changed to Converted',
		user: 'Madun Laduni',
		date: '12 May, 2026',
	},
	{
		id: 'act_2',
		type: 'coupon',
		title: 'Coupon Code*: Paid',
		user: 'Madun Laduni',
		date: '12 May, 2026',
	},
	{
		id: 'act_3',
		type: 'staff',
		title: 'Staff assigned: ',
		subtitle: 'Alex Carter',
		user: 'Madun Laduni',
		date: '14 May, 2026',
	},
	{
		id: 'act_4',
		type: 'lead',
		title: 'Lead created',
		description: 'via Website Form',
		user: '',
		date: '12 May, 2026',
	},
];
