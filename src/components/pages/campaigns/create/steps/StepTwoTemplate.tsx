"use client";

import { StepTwoHeader } from "@/components/pages/campaigns/create/steps_cards/StepTwoHeader";
import { StepTwoCards } from "@/components/pages/campaigns/create/steps_cards/StepTwoCards";
import { StepTwoActions } from "@/components/pages/campaigns/create/steps_cards/StepTwoActions";
import { useStepTwoState } from "@/hooks/useStepTwoState";

interface StepTwoTemplateProps {
	campaignName: string;
	setCampaignName: (v: string) => void;
	onBack: () => void;
	onNextStep: () => void;
	designFilled?: boolean;
	selectedTemplateName?: string;
	templateId?: string | null;
	onDesignClick?: () => void;
	selectedGroupId?: string | null;
	selectedGroupName?: string | null;
	onRecipientsSave?: (groupId: string, groupName: string) => void;
	senderName?: string;
	senderEmail?: string;
	subject?: string;
	previewText?: string;
	filled?: { sender: boolean; recipients: boolean; subject: boolean; design: boolean };
	onSenderSave?: (name: string, email: string) => void;
	onSubjectSave?: (subject: string, preview: string) => void;
	tags?: string[];
}

export function StepTwoTemplate({
	campaignName,
	setCampaignName,
	onBack,
	selectedTemplateName,
	templateId,
	onDesignClick,
	selectedGroupId,
	selectedGroupName,
	onRecipientsSave,
	senderName = "Foysal Hasan",
	senderEmail = "foysalhasan.bdcalling@gmail.com",
	subject = "",
	previewText = "",
	filled: initialFilled,
	onSenderSave,
	onSubjectSave,
	tags = [],
}: StepTwoTemplateProps) {
	const { filled, toggleFilled, allFilled } = useStepTwoState({
		designFilled: initialFilled?.design || false,
		initialFilled,
	});

	const handleRecipientsSave = (groupId: string, groupName: string) => {
		if (onRecipientsSave) {
			onRecipientsSave(groupId, groupName);
		}
		if (!filled.recipients) {
			toggleFilled("recipients");
		}
	};

	const handleSenderSave = (name: string, email: string) => {
		if (onSenderSave) {
			onSenderSave(name, email);
		}
		if (!filled.sender) {
			toggleFilled("sender");
		}
	};

	const handleSubjectSave = (subj: string, preview: string) => {
		if (onSubjectSave) {
			onSubjectSave(subj, preview);
		}
		if (!filled.subject) {
			toggleFilled("subject");
		}
	};

	const campaignData = {
		name: campaignName,
		tags: tags,
		subject: subject,
		templateId: templateId || "",
		senderName: senderName,
		senderEmail: senderEmail,
		leadGroupId: selectedGroupId,
	};

	return (
		<div className="flex flex-col justify-end items-start gap-6 self-stretch">
			<div className="flex justify-between items-center self-stretch">
				<StepTwoHeader
					campaignName={campaignName}
					setCampaignName={setCampaignName}
					onBack={onBack}
				/>
				<StepTwoActions allFilled={allFilled} campaignData={campaignData} />
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
				senderName={senderName}
				senderEmail={senderEmail}
				subject={subject}
				previewText={previewText}
				onSenderSave={handleSenderSave}
				onSubjectSave={handleSubjectSave}
			/>
		</div>
	);
}