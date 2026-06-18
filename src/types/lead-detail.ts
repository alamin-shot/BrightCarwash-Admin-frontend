export interface LeadDetail {
	id: string;
	name: string;
	email: string;
	phone: string;
	service: string;
	vehicle: string;
	source: string;
	priority: string;
	depositStatus: string;
	stage: string;
	stageId: string;
	stageColor: string;
	assignedToId: string | null;
	assignedToName: string | null;
	avatar: string;
	notes: Note[];
	date: string;
}

export interface Note {
	id: string;
	content: string;
	author: string;
	date: string;
}

export type ActivityType = 'lead' | 'stage' | 'staff' | 'coupon';

export interface ActivityItem {
	id: string;
	type: ActivityType;
	title?: string;
	subtitle?: string;
	description?: string;
	user: string;
	date: string;
}

export interface LeadDetailApiResponse {
	id: string;
	name: string;
	email: string;
	phone: string;
	service: string;
	vehicle: string;
	source: string;
	priority: string;
	deposit_status: string;
	stage_id: string;
	stage?: { id: string; name: string; color: string };
	assigned_to?: { id: string; first_name: string; last_name: string } | null;
	notes?: {
		id: string;
		content: string;
		author?: { first_name: string; last_name: string };
		created_at: string;
	}[];
	created_at: string;
}
