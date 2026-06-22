import type { Template } from '@/types/template';

export const mockCampaignTemplates: Template[] = [
	{
		id: 'ctmp_001',
		name: 'Welcome Series',
		thumbnail:
			'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=400&h=300&fit=crop',
		html: '<h1>Welcome!</h1><p>Thanks for joining us.</p>',
		createdAt: '2026-06-01',
		type: 'campaign',
	},
	{
		id: 'ctmp_002',
		name: 'Product Launch',
		thumbnail:
			'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
		html: '<h1>New Product</h1><p>Check out our latest release.</p>',
		createdAt: '2026-06-01',
		type: 'campaign',
	},
	{
		id: 'ctmp_003',
		name: 'Monthly Newsletter',
		thumbnail:
			'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=400&h=300&fit=crop',
		html: "<h1>Monthly Update</h1><p>Here's what happened this month.</p>",
		createdAt: '2026-06-01',
		type: 'campaign',
	},
	{
		id: 'ctmp_004',
		name: 'Holiday Special',
		thumbnail:
			'https://images.unsplash.com/photo-1606945553457-83f18c6a6ff0?w=400&h=300&fit=crop',
		html: '<h1>Holiday Deals</h1><p>Special offers inside!</p>',
		createdAt: '2026-06-01',
		type: 'campaign',
	},
	{
		id: 'ctmp_005',
		name: 'Re-engagement',
		thumbnail:
			'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=400&h=300&fit=crop',
		html: "<h1>We Miss You!</h1><p>Come back and see what's new.</p>",
		createdAt: '2026-06-01',
		type: 'campaign',
	},
	{
		id: 'ctmp_006',
		name: 'Feedback Request',
		thumbnail:
			'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
		html: '<h1>Your Opinion Matters</h1><p>Please take our survey.</p>',
		createdAt: '2026-06-01',
		type: 'campaign',
	},
];

export const mockSavedTemplates: Template[] = [];
