export type CampaignType = 'All Campaign' | 'E-mail Template';
export type CampaignStatus = 'Active' | 'Completed' | 'Draft' | 'Scheduled';

export interface Campaign {
	id: string;
	name: string;
	subject: string;
	recipients: number;
	clicks: number;
	status: CampaignStatus;
	type: CampaignType;
	date: string;
}

export interface CampaignFormData {
	name: string;
	tags: string[];
}
