'use client';

import type { StaffRole } from '@/types/staffs';

interface RoleToggleProps {
	value: StaffRole | 'All';
	onChange: (role: StaffRole | 'All') => void;
}

const roles: (StaffRole | 'All')[] = [
	'All',
	'Admin',
	'Manager',
	'Staff',
	'View Only',
];

export function RoleToggle({ value, onChange }: RoleToggleProps) {
	return (
		<div className='flex p-1 items-center gap-0.5 rounded-lg bg-[#F6F6F6]'>
			{roles.map((role) => (
				<button
					key={role}
					onClick={() => onChange(role)}
					className={`flex py-2 px-4 justify-center items-center gap-1 rounded-md text-sm font-inter transition-all ${
						value === role
							? 'bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] text-[#1B1B1B] font-medium'
							: 'text-[#777980] hover:text-[#1B1B1B]'
					}`}
				>
					{role}
				</button>
			))}
		</div>
	);
}
