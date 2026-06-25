"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGetLeadsQuery, useUpdateLeadStageMutation, useDeleteLeadMutation } from "@/services/leads.api";
import { getStages } from "@/services/stage.service";
import { useExportExcel } from "@/hooks/useExportExcel";
import { useGroupsData } from "@/hooks/useGroupsData";
import { GroupsHeader } from "./GroupsHeader";
import { GroupsList } from "./GroupsList";
import { AddLeadModal } from "@/components/pages/leads/kanban/AddLeadModal";
import { getAccessToken } from "@/lib/auth-client";
import { APP_CONFIG } from "@/configs/app.config";
import type { StageOption } from "@/components/ui/StageDropdown";
import type { Stage } from "@/types/stage";
import type { Lead } from "@/types/leads";
import { toast } from "react-toastify";
import { CreateGroupModal } from "./CreateGroupModal";

function mapStagesToOptions(stages: Stage[]): StageOption[] {
    const nameToValue: Record<string, string> = { "new lead": "new", contracted: "contracted", converted: "converted", lost: "lost" };
    return stages.map((s) => ({
        value: nameToValue[s.name.toLowerCase()] ?? s.name.toLowerCase().replace(/\s+/g, "_"),
        label: s.name, color: s.color, stageId: s.id,
    }));
}

interface GroupsContentProps {
    groupModalOpen: boolean;
    onGroupModalClose: () => void;
}

export function GroupsContent({ groupModalOpen, onGroupModalClose }: GroupsContentProps) {
    const router = useRouter();
    const { data: leads = [], refetch: refetchLeads } = useGetLeadsQuery();
    const { groups, leads: groupLeads, isLoading, refetch, fetchGroupLeads, addLeadToGroup } = useGroupsData();
    const [updateStage] = useUpdateLeadStageMutation();
    const [deleteLead] = useDeleteLeadMutation();
    const [searchQuery, setSearchQuery] = useState("");
    const [stages, setStages] = useState<StageOption[]>([]);
    const [leadModalOpen, setLeadModalOpen] = useState(false);
    const [targetGroupId, setTargetGroupId] = useState<string | null>(null);

    console.log("🎯 GroupsContent - groups:", groups);
    console.log("🎯 GroupsContent - groupLeads:", groupLeads);

    useEffect(() => { getStages().then((s) => setStages(mapStagesToOptions(s))); }, []);
    useEffect(() => { if (!groupModalOpen) { refetch(); refetchLeads(); } }, [groupModalOpen, refetch, refetchLeads]);

    const handleStageChange = useCallback(async (id: string, stageName: string) => {
        try { await updateStage({ id, stageName }).unwrap(); toast.success("Stage updated"); } catch { toast.error("Failed"); }
    }, [updateStage]);

    const handleDelete = useCallback(async (lead: Lead) => {
        try { await deleteLead(lead.id).unwrap(); toast.success(`${lead.name} deleted`); refetchLeads(); } catch { toast.error("Failed"); }
    }, [deleteLead, refetchLeads]);

    const handleDeleteGroup = useCallback(async (groupId: string) => {
        try {
            const token = getAccessToken();
            const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead-groups/${groupId}`, {
                method: "DELETE", headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed");
            toast.success("Group deleted");
            refetch();
        } catch { toast.error("Failed to delete group"); }
    }, [refetch]);

    const handleLeadAdded = useCallback((leadId: string) => {
        if (!targetGroupId) return;
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
            addLeadToGroup(targetGroupId, leadId);
            toast.success("Lead added to group");
        }
        setTargetGroupId(null);
    }, [targetGroupId, leads, addLeadToGroup]);

    const filteredGroups = groups.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
    console.log("🎯 Filtered groups:", filteredGroups);

    const exportableLeads = groupLeads;
    const exportColumns = [
        { key: "name", header: "Lead Name" }, { key: "service", header: "Service" },
        { key: "vehicle", header: "Vehicle" }, { key: "source", header: "Source" },
        { key: "depositStatus", header: "Deposit" }, { key: "stage", header: "Stage" }, { key: "date", header: "Date" },
    ];
    const { handleExport } = useExportExcel({ data: exportableLeads, columns: exportColumns, filename: "group-leads-export" });

    if (isLoading) {
        return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#0098E8] border-t-transparent rounded-full animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <GroupsHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onExport={handleExport}
                exportDisabled={exportableLeads.length === 0}
            />
            <GroupsList
                groups={filteredGroups}
                leads={groupLeads}
                stages={stages}
                onStageChange={handleStageChange}
                onDelete={handleDelete}
                onAddLead={(gid) => { setTargetGroupId(gid); setLeadModalOpen(true); }}
                onDeleteGroup={handleDeleteGroup}
                onGroupExpand={fetchGroupLeads}
                router={router}
            />
            <CreateGroupModal isOpen={groupModalOpen} onClose={onGroupModalClose} selectedLeads={[]} onGroupCreated={() => { refetch(); onGroupModalClose(); }} />
            <AddLeadModal isOpen={leadModalOpen} onClose={() => { setLeadModalOpen(false); setTargetGroupId(null); }} onLeadCreated={handleLeadAdded} stages={stages} />
        </div>
    );
}