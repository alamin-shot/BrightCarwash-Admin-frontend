import { Mail, UserPlus } from 'lucide-react';

const actions = [
	{ icon: Mail, label: 'Send Email', color: 'text-[#B23730]' },
	{ icon: UserPlus, label: 'Assign staff', color: 'text-[#006F1F]' },
];

export function QuickActions() {
	return (
		<div className='flex p-6 flex-col items-start gap-4 self-stretch rounded-lg border border-[#DFE1E7] bg-white'>
			<h3 className='text-[#1A1C21] font-inter text-lg font-semibold'>
				Quick Actions
			</h3>
			<div className='w-full h-px bg-[#DFE1E7]' />
			<div className='grid grid-cols-2 gap-3 self-stretch'>
				{actions.map((a) => (
					<button
						key={a.label}
						className='flex p-3 flex-col justify-center items-center gap-2 rounded border border-[#DFE1E7] bg-white hover:bg-[#F8FAFB] transition-colors cursor-pointer'
					>
						<a.icon size={22} className={a.color} />
						<span className='text-xs text-[#1B1B1B] font-inter text-center'>
							{a.label}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}
