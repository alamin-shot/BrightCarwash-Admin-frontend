"use client";

import Image from "next/image";
import type { LeadDetail } from "@/types/lead-detail";
import { MailIcon } from "lucide-react";

const depositStyles: Record<string, string> = {
	PAID: "text-[#006F1F] border-[#E8E8E9] bg-white",
	PENDING: "text-[#FFAF00] border-[#E8E8E9] bg-white",
	REFUNDED: "text-[#FF4345] border-[#E8E8E9] bg-white",
	NONE: "text-[#777980] border-[#E8E8E9] bg-white",
};

interface Props {
	lead: LeadDetail;
}

const detailFields = [
	{ label: "Service", key: "service" as const },
	{ label: "Source", key: "source" as const },
	{ label: "Vehicle", key: "vehicle" as const },
	{ label: "Date", key: "date" as const },
	{ label: "Phone Number", key: "phone" as const },
];

export function LeadInfoCard({ lead }: Props) {
	// ✅ Debug: log the assignedToName
	console.log("LeadInfoCard - assignedToName:", lead.assignedToName);

	return (
		<div className="flex p-6 flex-col items-start gap-4 self-stretch rounded-lg border border-[#DFE1E7] bg-white">
			<div className="flex justify-between items-start self-stretch gap-4 flex-wrap">
				<div className="flex items-center gap-3">
					<Image
						src={lead.avatar}
						alt={lead.name}
						width={48}
						height={48}
						className="rounded-full object-cover"
					/>
					<div className="flex flex-col gap-1">
						<span className="text-[#4A4C56] font-inter text-2xl font-medium leading-[100%] truncate">
							{lead.name}
						</span>
						<div className="flex items-center gap-2 px-1.5 py-1.5 rounded border border-[#DFE1E7] bg-white">
							<MailIcon className="text-[#777980]" size={16} />
							<span className="text-[#777980] font-inter text-xs">
								{lead.email}
							</span>
						</div>
					</div>
				</div>

				<span
					className="inline-flex py-1.5 px-3 rounded text-sm capitalize text-white"
					style={{ backgroundColor: lead.stageColor }}
				>
					{lead.stage}
				</span>

			</div>

			<div className="w-full h-px bg-[#DFE1E7]" />

			<div className="grid grid-cols-3 gap-4 self-stretch max-md:grid-cols-2 max-sm:grid-cols-1">
				{/* Assigned To field - placed first */}
				<div className="flex flex-col gap-1">
					<span className="text-[#777980] font-inter text-sm">Assigned To</span>
					<span className="text-[#1D1F2C] font-inter text-base">
						{lead.assignedToName || "—"}
					</span>
				</div>
				{detailFields.map((f) => (
					<div key={f.key} className="flex flex-col gap-1">
						<span className="text-[#777980] font-inter text-sm">{f.label}</span>
						<span className="text-[#1D1F2C] font-inter text-base">
							{lead[f.key] || "-"}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}