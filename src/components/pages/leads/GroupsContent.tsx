"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { GroupAccordion } from "@/components/pages/leads/GroupAccordion";
import { CreateGroupModal } from "@/components/pages/leads/CreateGroupModal";
import { AddLeadModal } from "@/components/pages/leads/kanban/AddLeadModal";
import { useGetLeadsQuery, useUpdateLeadStageMutation } from "@/services/leads.api";
import { getStages } from "@/services/stage.service";
import { useExportExcel } from "@/hooks/useExportExcel";
import type { StageOption } from "@/components/ui/StageDropdown";
import type { Stage } from "@/types/stage";
import type { Lead } from "@/types/leads";
import { toast } from "react-toastify";
import { useDeleteLeadMutation } from "@/services/leads.api";


interface Group {
    id: string;
    name: string;
    leadIds: string[];
}

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
    const { data: leads = [] } = useGetLeadsQuery();
    const [updateStage] = useUpdateLeadStageMutation();
    const [groups, setGroups] = useState<Group[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [stages, setStages] = useState<StageOption[]>([]);
    const [leadModalOpen, setLeadModalOpen] = useState(false);
    const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
    const [deleteLead] = useDeleteLeadMutation();
    const loadGroups = useCallback(() => {
        setGroups(JSON.parse(localStorage.getItem("leadGroups") || "[]"));
    }, []);

    useEffect(() => { loadGroups(); }, [loadGroups]);
    useEffect(() => { if (!groupModalOpen) loadGroups(); }, [groupModalOpen, loadGroups]);
    useEffect(() => { getStages().then((s) => setStages(mapStagesToOptions(s))); }, []);

    const handleStageChange = useCallback(async (id: string, stageName: string) => {
        try {
            await updateStage({ id, stageName }).unwrap();
            toast.success("Stage updated");
        } catch {
            toast.error("Failed to update stage");
        }
    }, [updateStage]);

    const handleDelete = useCallback(async (lead: Lead) => {
        try {
            await deleteLead(lead.id).unwrap();
            toast.success(`${lead.name || lead.email} deleted`);
        } catch {
            toast.error("Failed to delete lead");
        }
    }, [deleteLead]);

    const handleAddLeadToGroup = useCallback((groupId: string) => {
        setTargetGroupId(groupId);
        setLeadModalOpen(true);
    }, []);
    const handleDeleteGroup = useCallback((groupId: string) => {
        const stored = JSON.parse(localStorage.getItem("leadGroups") || "[]");
        const updated = stored.filter((g: Group) => g.id !== groupId);
        localStorage.setItem("leadGroups", JSON.stringify(updated));
        loadGroups();
        toast.success("Group deleted");
    }, [loadGroups]);

    const handleLeadAdded = useCallback((leadId: string) => {
        if (!targetGroupId) return;
        const stored = JSON.parse(localStorage.getItem("leadGroups") || "[]");
        const updated = stored.map((g: Group) =>
            g.id === targetGroupId && !g.leadIds.includes(leadId)
                ? { ...g, leadIds: [...g.leadIds, leadId] }
                : g
        );
        localStorage.setItem("leadGroups", JSON.stringify(updated));
        loadGroups();
        setTargetGroupId(null);
    }, [targetGroupId, loadGroups]);

    const allGroupLeadIds = useMemo(() => {
        const ids = new Set<string>();
        groups.forEach((g) => g.leadIds.forEach((id) => ids.add(id)));
        return ids;
    }, [groups]);

    const exportableLeads = useMemo(() => leads.filter((l) => allGroupLeadIds.has(l.id)), [leads, allGroupLeadIds]);

    const exportColumns = useMemo(() => [
        { key: "name", header: "Lead Name" }, { key: "service", header: "Service" },
        { key: "vehicle", header: "Vehicle" }, { key: "source", header: "Source" },
        { key: "depositStatus", header: "Deposit" }, { key: "stage", header: "Stage" }, { key: "date", header: "Date" },
    ], []);

    const { handleExport } = useExportExcel({ data: exportableLeads, columns: exportColumns, filename: "group-leads-export" });

    const filteredGroups = groups.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3">
                <div className="flex px-4 py-3 items-center gap-3 rounded-lg border border-[#E8E8E9] bg-white max-w-[400px] flex-1">
                    <Search size={20} className="text-[#777980] shrink-0" />
                    <input type="text" placeholder="Search groups..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent" />
                </div>
                <Button variant="outline" onClick={() => handleExport()} className="flex py-2.5 px-4 items-center gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-sm w-auto!">
                    <Icon name="export" width={14} height={14} /> Export
                </Button>
            </div>

            <GroupAccordion groups={filteredGroups} leads={leads} stages={stages} onStageChange={handleStageChange} onDelete={handleDelete} router={router} onAddLead={handleAddLeadToGroup} onDeleteGroup={handleDeleteGroup} />

            <CreateGroupModal isOpen={groupModalOpen} onClose={onGroupModalClose} selectedLeads={[]} onGroupCreated={loadGroups} />
            <AddLeadModal isOpen={leadModalOpen} onClose={() => { setLeadModalOpen(false); setTargetGroupId(null); }} onLeadCreated={handleLeadAdded} stages={stages} />
        </div>
    );
}