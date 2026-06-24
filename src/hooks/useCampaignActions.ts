"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
    useDeleteCampaignMutation,
    useLaunchCampaignMutation,
    useCampaignStatusActionMutation,
} from "@/services/campaign.api";
import type { Campaign } from "@/types/campaign";

export function useCampaignActions() {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteCampaign] = useDeleteCampaignMutation();
    const [launchCampaign] = useLaunchCampaignMutation();
    const [statusAction] = useCampaignStatusActionMutation();

    const handleEdit = useCallback(
        (campaign: Campaign) => router.push(`/campaigns/edit/${campaign.id}`),
        [router]
    );

    const handleDelete = useCallback(
        async (campaign: Campaign) => {
            if (!confirm(`Delete "${campaign.name}"?`)) return;
            setDeletingId(campaign.id);
            try {
                await deleteCampaign(campaign.id).unwrap();
                toast.success(`"${campaign.name}" deleted`);
            } catch {
                toast.error("Failed to delete campaign");
            } finally {
                setDeletingId(null);
            }
        },
        [deleteCampaign]
    );

    const handleLaunch = useCallback(
        async (campaign: Campaign) => {
            if (!confirm(`Launch "${campaign.name}"?`)) return;
            try {
                await launchCampaign(campaign.id).unwrap();
                toast.success(`"${campaign.name}" launched`);
            } catch (error: any) {
                toast.error(error?.data || "Failed to launch campaign");
            }
        },
        [launchCampaign]
    );

    const handleStatusAction = useCallback(
        async (campaign: Campaign, action: "SUSPEND" | "RESTART") => {
            const label = action === "SUSPEND" ? "Suspend" : "Restart";
            if (!confirm(`${label} "${campaign.name}"?`)) return;
            try {
                await statusAction({ id: campaign.id, action }).unwrap();
                toast.success(`"${campaign.name}" ${label.toLowerCase()}ed`);
            } catch (error: any) {
                toast.error(error?.data || `Failed to ${label.toLowerCase()} campaign`);
            }
        },
        [statusAction]
    );

    return {
        handleEdit,
        handleDelete,
        handleLaunch,
        handleStatusAction,
        deletingId,
    };
}