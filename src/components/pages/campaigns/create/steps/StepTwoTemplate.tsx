"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { StepTwoHeader } from "@/components/pages/campaigns/create/steps_cards/StepTwoHeader";
import { StepTwoCards } from "@/components/pages/campaigns/create/steps_cards/StepTwoCards";
import { StepTwoActions } from "@/components/pages/campaigns/create/steps_cards/StepTwoActions";

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
	designFilled?: boolean;
	selectedTemplateName?: string;
	onDesignClick?: () => void;
	selectedGroupId?: string | null;
	selectedGroupName?: string | null;
	onRecipientsSave?: (groupId: string, groupName: string) => void;
}

export function StepTwoTemplate({
	campaignName,
	setCampaignName,
	onBack,
	selectedTemplateName,
	designFilled = false,
	onDesignClick,
	selectedGroupId,
	selectedGroupName,
	onRecipientsSave,
}: StepTwoTemplateProps) {
	const [filled, setFilled] = useState<CardState>({
		sender: false,
		recipients: false,
		subject: false,
		design: designFilled,
	});
	const allFilled = filled.sender && filled.recipients && filled.subject && filled.design;

	const toggleFilled = (key: keyof CardState) => {
		setFilled((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleRecipientsSave = (groupId: string, groupName: string) => {
		if (onRecipientsSave) {
			onRecipientsSave(groupId, groupName);
		}
		if (!filled.recipients) {
			toggleFilled("recipients");
		}
	};

	const handleSendNow = async () => {
		// ✅ Your send logic here
		toast.success("Campaign sent successfully!");
		// TODO: Integrate with actual send API
	};

	const handleScheduleLater = async () => {
		// ✅ Your schedule logic here
		toast.success("Campaign scheduled successfully!");
		// TODO: Integrate with actual schedule API
	};

	return (
		<div className="flex flex-col justify-end items-start gap-6 self-stretch">
			<div className="flex justify-between items-center self-stretch">
				<StepTwoHeader campaignName={campaignName} setCampaignName={setCampaignName} onBack={onBack} />
				<StepTwoActions
					allFilled={allFilled}
					onSendNow={handleSendNow}
					onScheduleLater={handleScheduleLater}
				/>
			</div>
			<StepTwoCards
				filled={filled}
				onToggle={toggleFilled}
				campaignName={campaignName}
				selectedTemplateName={selectedTemplateName}
				onDesignClick={onDesignClick}
				selectedGroupId={selectedGroupId}
				selectedGroupName={selectedGroupName}
				onRecipientsSave={handleRecipientsSave}
			/>
		</div>
	);
}