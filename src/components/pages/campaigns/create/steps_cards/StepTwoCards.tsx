'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SenderModal } from '@/components/pages/campaigns/create/modals/SenderModal';
import { SubjectModal } from '../modals/SubjectModal';

interface CardState {
	sender: boolean;
	recipients: boolean;
	subject: boolean;
	design: boolean;
}

interface StepTwoCardsProps {
	filled: CardState;
	onToggle: (key: keyof CardState) => void;
	campaignName: string;
	onDesignClick: () => void;
}

const cardConfig = [
	{
		key: 'sender' as const,
		icon: 'convert',
		title: 'Sender',
		desc: 'Who is sending this email campaign?',
		btn: 'Add Sender',
	},
	{
		key: 'recipients' as const,
		icon: 'leads',
		title: 'Recipients',
		desc: 'The people who receive your campaign.',
		btn: 'Add Recipients',
	},
	{
		key: 'subject' as const,
		icon: 'contract',
		title: 'Subject',
		desc: 'Add a subject line for this campaign.',
		btn: 'Add Subject',
	},
	{
		key: 'design' as const,
		icon: 'new',
		title: 'Design',
		desc: 'Create your email content.',
		btn: 'Start designing',
	},
];

export function StepTwoCards({
	filled,
	onToggle,
	campaignName,
	onDesignClick,
}: StepTwoCardsProps) {
	const [senderModalOpen, setSenderModalOpen] = useState(false);
	const [subjectModalOpen, setSubjectModalOpen] = useState(false);

	const handleCardClick = (key: keyof CardState) => {
		if (key === 'sender') {
			setSenderModalOpen(true);
			if (!filled.sender) onToggle('sender');
		} else if (key === 'subject') {
			setSubjectModalOpen(true);
			if (!filled.subject) onToggle('subject');
		} else if (key === 'design') {
			onDesignClick();
		} else {
			onToggle(key);
		}
	};

	return (
		<>
			<div className='flex p-4 flex-col justify-end items-end gap-4 self-stretch rounded-xl border border-[#DFE1E7] bg-[#F8FAFB]'>
				{cardConfig.map((card) => (
					<div
						key={card.key}
						className='flex p-4 justify-between items-center self-stretch rounded-lg border border-[#DFE1E7] bg-white'
					>
						<div className='flex items-start gap-3'>
							<Icon
								name={card.icon}
								width={24}
								height={24}
								color={filled[card.key] ? '#006F1F' : '#A5A5AB'}
							/>
							<div className='flex flex-col items-start gap-1'>
								<span className='text-[#1D1F2C] font-inter text-2xl font-medium leading-[100%]'>
									{card.title}
								</span>
								<span className='text-[#777980] font-inter text-sm font-normal leading-[132%]'>
									{card.desc}
								</span>
							</div>
						</div>
						<Button
							variant='outline'
							onClick={() => handleCardClick(card.key)}
							className={`flex py-2.5 px-4 justify-center items-center gap-2 rounded border text-sm w-auto! ${
								filled[card.key]
									? 'border-[#006F1F] text-[#006F1F] bg-[#DCF7EA]'
									: 'border-[#DFE1E7] text-[#1B1B1B]'
							}`}
						>
							{filled[card.key] ? '✓ Added' : card.btn}
						</Button>
					</div>
				))}
			</div>

			<SenderModal
				isOpen={senderModalOpen}
				onClose={() => setSenderModalOpen(false)}
				campaignName={campaignName}
			/>
			<SubjectModal
				isOpen={subjectModalOpen}
				onClose={() => setSubjectModalOpen(false)}
			/>
		</>
	);
}
