export interface Template {
	id: string;
	name: string;
	thumbnail: string | null;
	html: string;
	createdAt: string;
	type: 'saved' | 'campaign';
}
