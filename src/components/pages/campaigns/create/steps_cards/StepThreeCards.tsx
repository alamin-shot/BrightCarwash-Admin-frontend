"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { TemplateCard } from "@/components/pages/campaigns/create/templates/TemplateCard";
import { getSavedTemplates } from "@/services/template.service";
import type { Template } from "@/types/template";
import { toast } from "react-toastify";

interface StepThreeCardsProps {
	onTemplateSelect: (name: string) => void;
}

export function StepThreeCards({ onTemplateSelect }: StepThreeCardsProps) {
	const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	useEffect(() => {
		getSavedTemplates().then(setSavedTemplates).finally(() => setLoading(false));
	}, []);

	const handleUse = (template: Template) => {
		setSelectedId(template.id);
		toast.success(`"${template.name}" selected for this campaign`);
		onTemplateSelect(template.name);
	};

	return (
		<div className="flex p-4 flex-col gap-4 self-stretch rounded-xl border border-[#DFE1E7] bg-[#F8FAFB]">
			<div className="flex items-start gap-3">
				<Icon name="convert" width={24} height={24} color="#0098E8" />
				<div className="flex flex-col gap-1">
					<span className="text-[#1D1F2C] font-inter text-2xl font-medium leading-[100%]">Your saved templates</span>
					<span className="text-[#4A4C56] font-inter text-sm font-normal leading-[150%] tracking-[0.28px]">Start building your email using a previously saved template.</span>
				</div>
			</div>
			{loading ? (
				<div className="grid grid-cols-3 gap-4">
					{[...Array(3)].map((_, i) => <div key={i} className="h-[340px] bg-gray-100 rounded-lg animate-pulse" />)}
				</div>
			) : savedTemplates.length === 0 ? (
				<div className="flex items-center justify-center py-12 text-[#777980] font-inter text-sm">No saved templates yet. Create one in the email editor.</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{savedTemplates.map((t) => (
						<TemplateCard
							key={t.id}
							template={t}
							onUse={handleUse}
							isSelected={t.id === selectedId}
						/>
					))}
				</div>
			)}
		</div>
	);
}