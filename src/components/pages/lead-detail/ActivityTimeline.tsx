import type { ActivityItem, ActivityType } from '@/types/lead-detail';

interface Props {
	activities: ActivityItem[];
}

const dotColors: Record<ActivityType, string> = {
	stage: 'bg-[#B23730]',
	staff: 'bg-[#B23730]',
	lead: 'bg-[#0098E8]',
	coupon: '',
};

function TimelineDot({ type }: { type: ActivityType }) {
	if (type === 'coupon')
		return (
			<div className='shrink-0 bg-[#0098E8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm'>
				Coupon
			</div>
		);
	return (
		<div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${dotColors[type]}`} />
	);
}

export function ActivityTimeline({ activities }: Props) {
	return (
		<div className='flex p-5 flex-col items-start gap-4 self-stretch rounded-lg border border-[#DFE1E7] bg-white'>
			<h3 className='text-[#1A1C21] font-inter text-lg font-semibold'>
				Activity Timeline
			</h3>
			<div className='w-full h-px bg-[#DFE1E7]' />
			<div className='relative pl-1'>
				{activities.map((item, i) => (
					<div key={item.id} className='relative flex gap-4 pb-6 last:pb-0'>
						{i !== activities.length - 1 && (
							<div
								className='absolute left-[5px] top-4 bottom-0 w-px bg-[#DFE1E7]'
								style={{ height: 'calc(100% + 8px)' }}
							/>
						)}
						<TimelineDot type={item.type} />
						<div className='flex flex-col -mt-0.5'>
							<span className='text-[15px] font-medium text-[#1B1B1B]'>
								{item.title}
								{item.subtitle && (
									<span className='font-semibold'>{item.subtitle}</span>
								)}
							</span>
							{item.description && (
								<span className='text-sm text-[#777980]'>
									{item.description}
								</span>
							)}
							{(item.user || item.date) && (
								<span className='text-[13px] text-[#777980] mt-0.5'>
									{item.user && (
										<>
											by <span className='text-[#4A4C56]'>{item.user}</span>
											{item.date && ' • '}
										</>
									)}
									{item.date}
								</span>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
