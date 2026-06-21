'use client';

import { Button } from '@/components/ui/Button';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface StepTwoActionsProps {
	allFilled: boolean;
	scheduleType: string;
	onScheduleChange: (val: string) => void;
}

export function StepTwoActions({
	allFilled,
	scheduleType,
	onScheduleChange,
}: StepTwoActionsProps) {
	return (
		<div className='flex items-center gap-3'>
			{allFilled && (
				<Button
					variant='outline'
					className='flex py-2.5 px-4 items-center gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-sm w-auto!'
				>
					Preview
				</Button>
			)}
			<FilterDropdown
				label='Send now'
				options={[
					{ value: 'now', label: 'Send now' },
					{ value: 'later', label: 'Schedule for later' },
				]}
				value={scheduleType}
				onChange={onScheduleChange}
				className='flex'
				buttonClassName='bg-[#0098E8] text-white! border-[#0098E8] hover:bg-[#0088D8]'
				dropdownOffsetX={-45}
			/>
		</div>
	);
}
