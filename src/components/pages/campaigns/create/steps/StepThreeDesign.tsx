'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { StepThreeCards } from '../steps_cards/StepThreeCards';
import { useRouter } from 'next/navigation';

interface StepThreeDesignProps {
	campaignName: string;
	setCampaignName: (v: string) => void;
	onBack: () => void;
}

export function StepThreeDesign({ onBack }: StepThreeDesignProps) {
	const [editorType, setEditorType] = useState('');
	const router = useRouter();
	return (
		<div className='flex flex-col gap-6 self-stretch min-w-0'>
			<div className='flex justify-between items-center self-stretch'>
				<div className='flex items-center gap-3'>
					<Button
						variant='icon'
						onClick={onBack}
						className='flex items-center text-[#777980] hover:text-[#1B1B1B] transition-colors p-0'
					>
						<ChevronLeft size={20} />
					</Button>
					<span className='text-[#1B1B1B] font-inter text-lg font-semibold'>
						Design
					</span>
				</div>
				<FilterDropdown
					label='Create from scratch'
					options={[
						{ value: 'drag', label: 'Drag and Drop' },
						{ value: 'simple', label: 'Simple Editor' },
					]}
					value={editorType}
					onChange={(val: string) => {
						setEditorType(val);
						if (val === 'drag') router.push('/campaigns/create/editor');
						if (val === 'simple')
							router.push('/campaigns/create/simple-editor');
					}}
					buttonClassName='bg-[#0098E8] text-white! border-[#0098E8] hover:bg-[#0088D8]'
				/>
			</div>
			<StepThreeCards />
		</div>
	);
}
