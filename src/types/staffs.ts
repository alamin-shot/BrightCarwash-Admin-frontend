export type StaffRole = 'Admin' | 'Manager' | 'Staff' | 'View Only';
export type StaffStatus = 'Active' | 'Inactive' | 'Pending' | 'Invited';

export interface Staff {
	id: string;
	name: string;
	email: string;
	avatar: string;
	role: StaffRole;
	status: StaffStatus;
	lastActivity: string;
}
