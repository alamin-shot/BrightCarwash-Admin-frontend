'use client';

import { useState } from 'react';
import { StepTwoHeader } from '@/components/pages/campaigns/create/steps_cards/StepTwoHeader';
import { StepTwoCards } from '@/components/pages/campaigns/create/steps_cards/StepTwoCards';
import { StepTwoActions } from '@/components/pages/campaigns/create/steps_cards/StepTwoActions';

interface CardState {
	sender: boolean;
	recipients: boolean;
	subject: boolean;
	design: boolean;
}

interface StepTwoTemplateProps {
	campaignName: string;
	setCampaignName: (v: string) => void;
	onBack: () => void;
	onNextStep: () => void;
}

export function StepTwoTemplate({
	campaignName,
	setCampaignName,
	onBack,
	onNextStep,
}: StepTwoTemplateProps) {
	const [filled, setFilled] = useState<CardState>({
		sender: false,
		recipients: false,
		subject: false,
		design: false,
	});
	const [scheduleType, setScheduleType] = useState('');
	const allFilled =
		filled.sender && filled.recipients && filled.subject && filled.design;

	return (
		<div className='flex flex-col justify-end items-start gap-6 self-stretch'>
			<div className='flex justify-between items-center self-stretch'>
				<StepTwoHeader
					campaignName={campaignName}
					setCampaignName={setCampaignName}
					onBack={onBack}
				/>
				<StepTwoActions
					allFilled={allFilled}
					scheduleType={scheduleType}
					onScheduleChange={setScheduleType}
				/>
			</div>
			<StepTwoCards
				filled={filled}
				onToggle={(key) =>
					setFilled((prev) => ({ ...prev, [key]: !prev[key] }))
				}
				campaignName={campaignName}
				onDesignClick={onNextStep}
			/>
		</div>
	);
}
