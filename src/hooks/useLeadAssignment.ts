"use client";

import { useCallback } from "react";
import { assignLeadToMember } from "@/services/lead-detail.service";
import { toast } from "react-toastify";
import type { LeadDetail, ActivityItem } from "@/types/lead-detail";

export function useLeadAssignment(
    leadId: string,
    currentLead: LeadDetail | null,
    addLocalActivity: (activity: ActivityItem) => void,
    triggerRefresh: () => void
) {
    const handleAssign = useCallback(
        async (memberId: string | null) => {
            try {
                await assignLeadToMember(leadId, memberId);
                toast.success(memberId ? "Member assigned successfully" : "Member unassigned successfully");

                const now = new Date();
                const dateStr = now.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });
                const newActivity: ActivityItem = {
                    id: `local_${Date.now()}`,
                    type: "staff",
                    title: "Lead assigned",
                    subtitle: `to ${currentLead?.assignedToName || "Unknown"}`,
                    user: "You",
                    date: dateStr,
                };
                addLocalActivity(newActivity);
                triggerRefresh();
            } catch (error: any) {
                toast.error(error.message || "Failed to assign member");
                throw error;
            }
        },
        [leadId, currentLead, addLocalActivity, triggerRefresh]
    );

    return { handleAssign };
}