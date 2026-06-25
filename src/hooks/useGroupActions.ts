"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUpdateLeadStageMutation, useDeleteLeadMutation } from "@/services/leads.api";
import { getAccessToken } from "@/lib/auth-client";
import { APP_CONFIG } from "@/configs/app.config";
import type { Lead } from "@/types/leads";

export function useGroupActions({
    refetch,
    refetchLeads,
    fetchGroupLeads,
    addLeadToGroupOptimistic,
    updateLeadStageOptimistic
}: any) {
    const router = useRouter();
    const [updateStage] = useUpdateLeadStageMutation();
    const [deleteLead] = useDeleteLeadMutation();

    // ✅ Optimistic stage update
    const handleStageChange = useCallback(async (id: string, stageName: string) => {
        // ✅ Update UI immediately
        updateLeadStageOptimistic(id, stageName);

        try {
            await updateStage({ id, stageName }).unwrap();
            toast.success("Stage updated");
            // ✅ Refetch in background to sync
            await refetchLeads();
        } catch {
            toast.error("Failed to update stage");
            // ✅ Revert on error
            await refetchLeads();
        }
    }, [updateStage, refetchLeads, updateLeadStageOptimistic]);

    const handleDeleteLead = useCallback(async (lead: Lead) => {
        try {
            await deleteLead(lead.id).unwrap();
            toast.success(`${lead.name} deleted`);
            await refetchLeads();
            await refetch();
        } catch {
            toast.error("Failed to delete lead");
        }
    }, [deleteLead, refetchLeads, refetch]);

    const handleDeleteGroup = useCallback(async (groupId: string) => {
        try {
            const token = getAccessToken();
            const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead-groups/${groupId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed");
            toast.success("Group deleted");
            await refetch();
        } catch {
            toast.error("Failed to delete group");
        }
    }, [refetch]);

    // ✅ Optimistic add lead to group
    const handleAddLeadToGroup = useCallback(async (groupId: string, leadId: string, leadData?: Lead) => {
        try {
            const token = getAccessToken();

            // ✅ If we have lead data, add it optimistically
            if (leadData) {
                addLeadToGroupOptimistic(groupId, leadData);
            }

            const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead-groups/connect-leads`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ groupId, leadIds: [leadId] }),
            });

            if (!res.ok) throw new Error("Failed");
            toast.success("Lead added to group");

            // ✅ Refresh in background
            await Promise.all([refetch(), refetchLeads()]);
            await fetchGroupLeads(groupId);
            return true;
        } catch {
            toast.error("Failed to add lead to group");
            // ✅ Revert on error
            await refetch();
            await fetchGroupLeads(groupId);
            return false;
        }
    }, [refetch, refetchLeads, fetchGroupLeads, addLeadToGroupOptimistic]);

    return {
        router,
        handleStageChange,
        handleDeleteLead,
        handleDeleteGroup,
        handleAddLeadToGroup,
    };
}