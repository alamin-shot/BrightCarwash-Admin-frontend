"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { LeadInfoCard } from "@/components/pages/lead-detail/LeadInfoCard";
import { NotesSection } from "@/components/pages/lead-detail/NotesSection";
import { QuickActions } from "@/components/pages/lead-detail/QuickActions";
import { ActivityTimeline } from "@/components/pages/lead-detail/ActivityTimeline";
import {
	getLeadDetail,
	getLeadActivities,
} from "@/services/lead-detail.service";
import type { LeadDetail, ActivityItem } from "@/types/lead-detail";

interface Props {
	leadId: string;
}

export function LeadDetailContent({ leadId }: Props) {
	const [lead, setLead] = useState<LeadDetail | null>(null);
	const [activities, setActivities] = useState<ActivityItem[]>([]);
	const [initialLoading, setInitialLoading] = useState(true);
	const [refresh, setRefresh] = useState(0);

	const fetchData = useCallback(async () => {
		const [l, a] = await Promise.all([
			getLeadDetail(leadId),
			getLeadActivities(leadId),
		]);
		setLead(l);
		setActivities(a);
	}, [leadId]);

	// Initial load – show skeleton
	useEffect(() => {
		fetchData().finally(() => setInitialLoading(false));
	}, [fetchData]);

	// Subsequent refreshes – no skeleton
	useEffect(() => {
		if (refresh > 0) {
			fetchData();
		}
	}, [refresh, fetchData]);

	const handleNoteAdded = useCallback(() => {
		setRefresh((prev) => prev + 1);
	}, []);

	if (initialLoading)
		return <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />;
	if (!lead) return <div className="text-[#FF4345]">Lead not found</div>;

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="flex items-center gap-2 text-sm text-[#777980] font-inter">
				<Link href="/leads" className="hover:text-[#0098E8]">
					Leads
				</Link>
				<ChevronRight size={14} />
				<span className="text-[#1B1B1B]">Lead Detail</span>
			</div>

			<div className="flex items-start gap-5 self-stretch max-lg:flex-col">
				<div className="flex flex-col gap-5 flex-1 min-w-0">
					<LeadInfoCard lead={lead} />
					<NotesSection
						leadId={leadId}
						notes={lead.notes}
						onNoteAdded={handleNoteAdded}
					/>
				</div>

				<div className="flex flex-col gap-5 w-[320px] max-lg:w-full shrink-0">
					<QuickActions />
					<ActivityTimeline activities={activities} />
				</div>
			</div>
		</div>
	);
}