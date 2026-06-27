"use client";

import { useState } from "react";
import { LeadInfoCard } from "@/components/pages/lead-detail/LeadInfoCard";
import { NotesSection } from "@/components/pages/lead-detail/NotesSection";
import { ActivityTimeline } from "@/components/pages/lead-detail/ActivityTimeline";
import { AssignmentHistory } from "@/components/pages/lead-detail/AssignmentHistory";
import { AssignMemberModal } from "@/components/pages/lead-detail/AssignMemberModal";
import { LeadDetailHeader } from "@/components/pages/lead-detail/LeadDetailHeader";
import { useLeadDetail } from "@/hooks/useLeadDetail";
import { useLeadAssignment } from "@/hooks/useLeadAssignment";
import { toast } from "react-toastify";

interface Props {
	leadId: string;
}

export function LeadDetailContent({ leadId }: Props) {
	const [modalOpen, setModalOpen] = useState(false);

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

	const handleNoteAdded = () => {
		triggerRefresh();
	};

	// ✅ Pass the note content (not id) to delete
	const handleDeleteNote = async (noteContent: string) => {
		try {
			await deleteNote(noteContent);
			toast.success("Note deleted");
		} catch {
			toast.error("Failed to delete note");
		}
	};

	if (initialLoading)
		return <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />;
	if (!lead) return <div className="text-[#FF4345]">Lead not found</div>;

	return (
		<div className="flex flex-col gap-4 w-full">
			<LeadDetailHeader onAssignClick={() => setModalOpen(true)} />

			<div className="flex items-start gap-5 self-stretch max-lg:flex-col">
				<div className="flex flex-col gap-5 flex-1 min-w-0">
					<LeadInfoCard lead={lead} />
					<NotesSection
						leadId={leadId}
						notes={lead.notes}
						onNoteAdded={handleNoteAdded}
						onDeleteNote={handleDeleteNote} // ✅ Now passes content
					/>
				</div>

				<div className="flex flex-col gap-5 w-[320px] max-lg:w-full shrink-0">
					<ActivityTimeline activities={activities} />
					<AssignmentHistory activities={activities} />
				</div>
			</div>

			<AssignMemberModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				leadId={leadId}
				currentAssigneeId={lead.assignedToId}
				currentAssigneeName={lead.assignedToName}
				onAssign={handleAssign}
			/>
		</div>
	);
}