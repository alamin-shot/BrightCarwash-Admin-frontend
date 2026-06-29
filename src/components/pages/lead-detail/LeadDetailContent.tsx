"use client";

import { useState, useEffect } from "react";
import { LeadInfoCard } from "@/components/pages/lead-detail/LeadInfoCard";
import { NotesSection } from "@/components/pages/lead-detail/NotesSection";
import { ActivityTimeline } from "@/components/pages/lead-detail/ActivityTimeline";
import { AssignmentHistory } from "@/components/pages/lead-detail/AssignmentHistory";
import { AssignMemberModal } from "@/components/pages/lead-detail/AssignMemberModal";
import { LeadDetailHeader } from "@/components/pages/lead-detail/LeadDetailHeader";
import { useLeadDetail } from "@/hooks/useLeadDetail";
import { useLeadAssignment } from "@/hooks/useLeadAssignment";
import { updateLeadDetails } from "@/services/lead-detail.service";
import { getStages } from "@/services/stage.service";
import { mapStagesToOptions } from "@/lib/stage-utils";
import type { StageOption } from "@/components/ui/StageDropdown";
import { toast } from "react-toastify";
import { EditLeadModal } from "@/components/ui/EditLeadModal";

interface Props {
	leadId: string;
}

export function LeadDetailContent({ leadId }: Props) {
	const [assignModalOpen, setAssignModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [stages, setStages] = useState<StageOption[]>([]);

	const {
		lead,
		activities,
		initialLoading,
		triggerRefresh,
		deleteNote,
		addLocalActivity,
	} = useLeadDetail(leadId);

	const { handleAssign } = useLeadAssignment(
		leadId,
		lead,
		addLocalActivity,
		triggerRefresh
	);

	useEffect(() => {
		getStages().then((s) => {
			setStages(mapStagesToOptions(s));
		});
	}, []);

	const handleNoteAdded = () => {
		triggerRefresh();
	};

	const handleDeleteNote = async (noteContent: string) => {
		try {
			await deleteNote(noteContent);
			toast.success("Note deleted");
		} catch {
			toast.error("Failed to delete note");
		}
	};

	const handleEditSave = async (data: any) => {
		await updateLeadDetails(leadId, data);

		const now = new Date();
		const dateStr = now.toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
		addLocalActivity({
			id: `local_${Date.now()}`,
			type: "lead",
			title: "Lead details updated",
			subtitle: "by You",
			user: "You",
			date: dateStr,
		});

		triggerRefresh();
	};

	if (initialLoading)
		return <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />;
	if (!lead) return <div className="text-[#FF4345]">Lead not found</div>;

	return (
		<div className="flex flex-col gap-4 w-full">
			{/* ✅ Header with buttons */}
			<LeadDetailHeader
				onAssignClick={() => setAssignModalOpen(true)}
				onEditClick={() => setEditModalOpen(true)}
			/>

			{/* Main content */}
			<div className="flex items-start gap-5 self-stretch max-lg:flex-col">
				<div className="flex flex-col gap-5 flex-1 min-w-0">
					<LeadInfoCard lead={lead} />
					<NotesSection
						leadId={leadId}
						notes={lead.notes}
						onNoteAdded={handleNoteAdded}
						onDeleteNote={handleDeleteNote}
					/>
				</div>

				<div className="flex flex-col gap-5 w-[320px] max-lg:w-full shrink-0">
					<ActivityTimeline activities={activities} />
					<AssignmentHistory activities={activities} />
				</div>
			</div>

			<AssignMemberModal
				isOpen={assignModalOpen}
				onClose={() => setAssignModalOpen(false)}
				leadId={leadId}
				currentAssigneeId={lead.assignedToId}
				currentAssigneeName={lead.assignedToName}
				onAssign={handleAssign}
			/>

			<EditLeadModal
				isOpen={editModalOpen}
				onClose={() => setEditModalOpen(false)}
				lead={lead}
				stages={stages}
				onSave={handleEditSave}
			/>
		</div>
	);
}