"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Stepper } from "@/components/ui/Stepper";
import { useCampaignCreation } from "@/hooks/useCampaignCreation";
import { CampaignBreadcrumb } from "./components/CampaignBreadcrumb";
import { StepOneDetails } from "./steps/StepOneDetails";
import { StepTwoTemplate } from "./steps/StepTwoTemplate";
import { StepThreeDesign } from "./steps/StepThreeDesign";
import { loadCampaignForEdit, resetCampaignCreation } from "@/store/slices/campaignCreationSlice";

const steps = [
	{ id: 1, title: "Details" },
	{ id: 2, title: "Template" },
	{ id: 3, title: "Recipients" },
	{ id: 4, title: "Review" },
];

export function CampaignCreateContent() {
	const dispatch = useDispatch();
	const searchParams = useSearchParams();
	const isEdit = searchParams.get("edit") === "true";
	const stepFromUrl = searchParams.get("step");

	const [currentStep, setCurrentStep] = useState(() => {
		if (stepFromUrl === "3") return 3;
		if (stepFromUrl === "2") return 2;
		return 1;
	});

	const campaign = useCampaignCreation();

	// Load edit data
	useEffect(() => {
		if (isEdit) {
			const tagsParam = searchParams.get("tags");
			const tags = tagsParam ? JSON.parse(tagsParam) : [];

			dispatch(loadCampaignForEdit({
				campaignName: searchParams.get("name") || "",
				tags: tags,
				senderName: searchParams.get("senderName") || "Foysal Hasan",
				senderEmail: searchParams.get("senderEmail") || "foysalhasan.bdcalling@gmail.com",
				subject: searchParams.get("subject") || "",
				selectedGroupId: searchParams.get("leadGroupId") || null,
				selectedGroupName: searchParams.get("leadGroupName") || null,
				filled: {
					sender: !!searchParams.get("senderName"),
					recipients: !!searchParams.get("leadGroupId"),
					subject: !!searchParams.get("subject"),
					design: false,
				},
				isEdit: true,
				campaignId: searchParams.get("id") || null,
			}));
		}

		return () => {
			dispatch(resetCampaignCreation());
		};
	}, [isEdit, searchParams, dispatch]);

	const handleTemplateSelect = (name: string, id: string) => {
		campaign.setSelectedTemplateName(name);
		campaign.setTemplateId(id);
		campaign.setDesignFilled(true);
		setCurrentStep(2);
	};

	return (
		<div className="flex flex-col gap-6 w-full">
			<div className="flex justify-between items-start self-stretch">
				<CampaignBreadcrumb
					isEdit={isEdit}
					currentStep={currentStep}
					campaignName={campaign.campaignName}
				/>
				<Stepper steps={steps} currentStep={currentStep} />
			</div>

			{currentStep === 1 && (
				<StepOneDetails
					campaignName={campaign.campaignName}
					setCampaignName={campaign.setCampaignName}
					tagInput={campaign.tagInput}
					setTagInput={campaign.setTagInput}
					tags={campaign.tags}
					addTag={() => campaign.addTag(campaign.tagInput || "")}
					removeTag={campaign.removeTag}
					handleTagKeyDown={(e: React.KeyboardEvent) => {
						if (e.key === "Enter") {
							e.preventDefault();
							campaign.addTag(campaign.tagInput || "");
						}
					}}
					onContinue={() => setCurrentStep(2)}
				/>
			)}

			{currentStep === 2 && (
				<StepTwoTemplate
					campaignName={campaign.campaignName}
					setCampaignName={campaign.setCampaignName}
					onBack={() => setCurrentStep(1)}
					onNextStep={() => setCurrentStep(3)}
					designFilled={campaign.designFilled}
					selectedTemplateName={campaign.selectedTemplateName}
					templateId={campaign.templateId}
					onDesignClick={() => {
						setCurrentStep(3);
						campaign.setDesignFilled(true);
					}}
					selectedGroupId={campaign.selectedGroupId}
					selectedGroupName={campaign.selectedGroupName}
					onRecipientsSave={campaign.setSelectedGroup}
					senderName={campaign.senderName}
					senderEmail={campaign.senderEmail}
					subject={campaign.subject}
					previewText={campaign.previewText}
					filled={campaign.filled}
					onSenderSave={campaign.setSender}
					onSubjectSave={campaign.setSubject}
					tags={campaign.tags}
				/>
			)}

			{currentStep === 3 && (
				<StepThreeDesign
					onBack={() => setCurrentStep(2)}
					onTemplateSelect={handleTemplateSelect}
				/>
			)}
		</div>
	);
}