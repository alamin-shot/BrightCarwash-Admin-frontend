"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SenderModal } from "@/components/pages/campaigns/create/modals/SenderModal";
import { SubjectModal } from "@/components/pages/campaigns/create/modals/SubjectModal";
import { RecipientsModal } from "@/components/pages/campaigns/create/modals/RecipientsModal";

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
	onDesignClick?: () => void;
	selectedTemplateName?: string;
	// ✅ Add recipients state
	selectedGroupId?: string | null;
	selectedGroupName?: string | null;
	onRecipientsSave?: (groupId: string, groupName: string) => void;
}

const cardConfig = [
	{ key: "sender" as const, icon: "convert", title: "Sender", desc: "Who is sending this email campaign?", btn: "Add Sender" },
	{ key: "recipients" as const, icon: "leads", title: "Recipients", desc: "The people who receive your campaign.", btn: "Add Recipients" },
	{ key: "subject" as const, icon: "contract", title: "Subject", desc: "Add a subject line for this campaign.", btn: "Add Subject" },
	{ key: "design" as const, icon: "new", title: "Design", desc: "Create your email content.", btn: "Start designing" },
];

export function StepTwoCards({
	filled,
	onToggle,
	campaignName,
	onDesignClick,
	selectedTemplateName,
	selectedGroupId,
	selectedGroupName,
	onRecipientsSave,
}: StepTwoCardsProps) {
	const [senderModalOpen, setSenderModalOpen] = useState(false);
	const [subjectModalOpen, setSubjectModalOpen] = useState(false);
	const [recipientsModalOpen, setRecipientsModalOpen] = useState(false);

	const handleCardClick = (key: keyof CardState) => {
		if (key === "sender") {
			setSenderModalOpen(true);
			if (!filled.sender) onToggle("sender");
		} else if (key === "subject") {
			setSubjectModalOpen(true);
			if (!filled.subject) onToggle("subject");
		} else if (key === "design") {
			onToggle("design");
			onDesignClick?.();
		} else if (key === "recipients") {
			setRecipientsModalOpen(true);
			if (!filled.recipients) onToggle("recipients");
		} else {
			onToggle(key);
		}
	};

	const handleRecipientsSave = (groupId: string, groupName: string) => {
		if (onRecipientsSave) {
			onRecipientsSave(groupId, groupName);
		}
		if (!filled.recipients) {
			onToggle("recipients");
		}
	};

	// Get the description text for recipients
	const getRecipientsDesc = () => {
		if (filled.recipients && selectedGroupName) {
			return `Selected: ${selectedGroupName}`;
		}
		return "The people who receive your campaign.";
	};

	return (
		<>
			<div className="flex p-4 flex-col justify-end items-end gap-4 self-stretch rounded-xl border border-[#DFE1E7] bg-[#F8FAFB]">
				{cardConfig.map((card) => {
					// Override description for recipients if selected
					let desc = card.desc;
					if (card.key === "recipients" && filled.recipients && selectedGroupName) {
						desc = `Selected: ${selectedGroupName}`;
					}
					if (card.key === "design" && filled.design && selectedTemplateName) {
						desc = `Using: ${selectedTemplateName}`;
					}

					return (
						<div key={card.key} className="flex p-4 justify-between items-center self-stretch rounded-lg border border-[#DFE1E7] bg-white">
							<div className="flex items-start gap-3">
								<Icon name={card.icon} width={24} height={24} color={filled[card.key] ? "#006F1F" : "#A5A5AB"} />
								<div className="flex flex-col items-start gap-1">
									<span className="text-[#1D1F2C] font-inter text-2xl font-medium leading-[100%]">{card.title}</span>
									<span className="text-[#777980] font-inter text-sm font-normal leading-[132%]">
										{desc}
									</span>
								</div>
							</div>
							<Button variant="outline" onClick={() => handleCardClick(card.key)}
								className={`flex py-2.5 px-4 justify-center items-center gap-2 rounded border text-sm w-auto! ${filled[card.key] ? "border-[#006F1F] text-[#006F1F] bg-[#DCF7EA]" : "border-[#DFE1E7] text-[#1B1B1B]"
									}`}>
								{filled[card.key] ? "✓ Added" : card.btn}
							</Button>
						</div>
					);
				})}
			</div>

			<SenderModal isOpen={senderModalOpen} onClose={() => setSenderModalOpen(false)} campaignName={campaignName} />
			<SubjectModal isOpen={subjectModalOpen} onClose={() => setSubjectModalOpen(false)} />
			<RecipientsModal
				isOpen={recipientsModalOpen}
				onClose={() => setRecipientsModalOpen(false)}
				selectedGroupId={selectedGroupId}
				onSave={handleRecipientsSave}
			/>
		</>
	);
}