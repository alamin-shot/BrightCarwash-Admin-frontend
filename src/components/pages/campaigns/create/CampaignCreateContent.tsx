"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Stepper } from "@/components/ui/Stepper";
import { StepOneDetails } from "@/components/pages/campaigns/create/steps/StepOneDetails";
import { StepTwoTemplate } from "@/components/pages/campaigns/create/steps/StepTwoTemplate";
import { StepThreeDesign } from "./steps/StepThreeDesign";

const steps = [
	{ id: 1, title: "Details" },
	{ id: 2, title: "Template" },
	{ id: 3, title: "Recipients" },
	{ id: 4, title: "Review" },
];

export function CampaignCreateContent() {
	const searchParams = useSearchParams();
	const stepFromUrl = searchParams.get("step");
	const [currentStep, setCurrentStep] = useState(() => {
		if (stepFromUrl === "3") return 3;
		if (stepFromUrl === "2") return 2;
		return 1;
	});
	const [campaignName, setCampaignName] = useState("");
	const [tagInput, setTagInput] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [selectedTemplateName, setSelectedTemplateName] = useState<string>("");
	const [designFilled, setDesignFilled] = useState(stepFromUrl === "2" || stepFromUrl === "3");

	const addTag = () => {
		const trimmed = tagInput.trim();
		if (trimmed && !tags.includes(trimmed)) { setTags([...tags, trimmed]); setTagInput(""); }
	};
	const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));
	const handleTagKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") { e.preventDefault(); addTag(); }
	};

	return (
		<div className="flex flex-col gap-6 w-full whitespace-nowrap">
			<div className="flex justify-between items-start self-stretch">
				<div className="flex items-center gap-2 text-sm text-[#777980] font-inter">
					<Link href="/campaigns" className="hover:text-[#0098E8] transition-colors">Campaigns</Link>
					<ChevronRight size={14} />

					{currentStep >= 3 ? (
						<>
							<Link href="/campaigns/create" className="hover:text-[#0098E8] transition-colors">Create Campaign</Link>
							<ChevronRight size={14} />
							<span className="text-[#1B1B1B] whitespace-nowrap">{campaignName}</span>
							<ChevronRight size={14} />
							<span className="text-[#1B1B1B] whitespace-nowrap">Design Template</span>
						</>
					) : currentStep >= 2 ? (
						<>
							<Link href="/campaigns/create" className="hover:text-[#0098E8] transition-colors">Create Campaign</Link>
							<ChevronRight size={14} />
							<span className="text-[#1B1B1B] whitespace-nowrap">{campaignName}</span>
						</>
					) : (
						<span className="text-[#1B1B1B] whitespace-nowrap">Create Campaign</span>
					)}
				</div>
				<Stepper steps={steps} currentStep={currentStep} />
			</div>

			{currentStep === 1 && (
				<StepOneDetails
					campaignName={campaignName} setCampaignName={setCampaignName}
					tagInput={tagInput} setTagInput={setTagInput}
					tags={tags} addTag={addTag} removeTag={removeTag}
					handleTagKeyDown={handleTagKeyDown}
					onContinue={() => setCurrentStep(2)}
				/>
			)}
			{currentStep === 2 && (
				<StepTwoTemplate
					campaignName={campaignName} setCampaignName={setCampaignName}
					onBack={() => setCurrentStep(1)}
					onNextStep={() => setCurrentStep(3)}
					designFilled={designFilled}
					selectedTemplateName={selectedTemplateName}
					onDesignClick={() => setCurrentStep(3)}
				/>
			)}
			{currentStep === 3 && (
				<StepThreeDesign
					onBack={() => setCurrentStep(2)}
					onTemplateSelect={(name) => {
						setSelectedTemplateName(name);
						setDesignFilled(true);
						setCurrentStep(2);
					}}
				/>
			)}
		</div>
	);
}