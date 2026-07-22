"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StepThreeCards } from "../steps_cards/StepThreeCards";

interface StepThreeDesignProps {
	onBack: () => void;
	onTemplateSelect: (name: string, id: string) => void;
}

export function StepThreeDesign({ onBack, onTemplateSelect }: StepThreeDesignProps) {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-6 self-stretch min-w-0">
			<div className="flex justify-between items-center self-stretch">
				<div className="flex items-center gap-3">
					<Button variant="icon" onClick={onBack} className="flex items-center text-[#777980] hover:text-[#1B1B1B] transition-colors p-0">
						<ChevronLeft size={20} />
					</Button>
					<span className="text-[#1B1B1B] font-inter text-lg font-semibold">Design</span>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={() => router.push("/campaigns/create/simple-editor")} className="flex py-2.5 px-4 items-center gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-sm w-auto!">
						Simple Editor
					</Button>
					<Button onClick={() => router.push("/campaigns/create/editor")} className="flex py-2.5 px-4 items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors w-auto!">
						Drag and Drop Editor
					</Button>
				</div>
			</div>
			<StepThreeCards onTemplateSelect={onTemplateSelect} />
		</div>
	);
}