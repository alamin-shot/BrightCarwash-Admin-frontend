'use client';

import { Icon } from '@/components/ui/Icon';

const cards = [
	{
		key: 'saved',
		icon: 'convert',
		title: 'Your saved templates',
		desc: 'Start building your email using a previously saved template.',
	},
	{
		key: 'ready',
		icon: 'new',
		title: 'Ready-to-use',
		desc: 'Explore our professionally designed templates, pick your favorite',
	},
	{
		key: 'campaign',
		icon: 'leads',
		title: 'Campaign emails',
		desc: 'Create a new email starting from a past campaign.',
	},
];

export function StepThreeCards() {
	return (
		<div className='flex p-4 items-stretch gap-4 self-stretch rounded-xl border border-[#DFE1E7] bg-[#F8FAFB]'>
			{cards.map((card) => (
				<div
					key={card.key}
					className='flex p-8 flex-col justify-between items-start gap-3 flex-1 rounded-lg border border-[#DFE1E7] bg-white cursor-pointer hover:border-[#0098E8] transition-colors min-w-0 overflow-hidden'
				>
					<div className='flex flex-col items-start gap-3 flex-1 min-w-0 w-full'>
						<Icon name={card.icon} width={24} height={24} color='#0098E8' />
						<span className='text-[#1D1F2C] font-inter text-2xl font-medium leading-[100%] wrap-break-word! w-full'>
							{card.title}
						</span>
						<span className='text-[#4A4C56] font-inter text-sm font-normal leading-[150%] tracking-[0.28px] wrap-break-word! w-full'>
							{card.desc}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
