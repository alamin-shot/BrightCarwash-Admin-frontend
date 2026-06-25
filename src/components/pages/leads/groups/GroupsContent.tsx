"use client";

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";
import { useGetLeadsQuery } from "@/services/leads.api";
import { useGroupsData } from "@/hooks/useGroupsData";
import { useGroupActions } from "@/hooks/useGroupActions";
import { getStages } from "@/services/stage.service";
import { useExportExcel } from "@/hooks/useExportExcel";
import { GroupsHeader } from "./GroupsHeader";
import { GroupsList } from "./GroupsList";
import { AddLeadModal } from "../kanban/AddLeadModal";
import type { StageOption } from "@/components/ui/StageDropdown";
import type { Stage } from "@/types/stage";
import { toast } from "react-toastify";
import { CreateGroupModal } from "./CreateGroupModal";
import { getAccessToken } from "@/lib/auth-client";
import { APP_CONFIG } from "@/configs/app.config";

export interface GroupsContentRef {
    exportData: () => void;
}

function mapStagesToOptions(stages: Stage[]): StageOption[] {
    const nameToValue: Record<string, string> = {
        "new lead": "new", contracted: "contracted",
        converted: "converted", lost: "lost"
    };
    return stages.map((s) => ({
        value: nameToValue[s.name.toLowerCase()] ?? s.name.toLowerCase().replace(/\s+/g, "_"),
        label: s.name, color: s.color, stageId: s.id,
    }));
}

export const GroupsContent = forwardRef<GroupsContentRef, { groupModalOpen: boolean; onGroupModalClose: () => void }>(
    function GroupsContent({ groupModalOpen, onGroupModalClose }, ref) {
        const router = useRouter();
        const { data: leads = [], refetch: refetchLeads } = useGetLeadsQuery();
        const {
            groups,
            leads: groupLeads,
            isLoading,
            refetch,
            fetchGroupLeads,
            addGroupOptimistic,
            removeOptimisticGroup,
            addLeadToGroupOptimistic,
            updateLeadStageOptimistic,
        } = useGroupsData();
        const [searchQuery, setSearchQuery] = useState("");
        const [stages, setStages] = useState<StageOption[]>([]);
        const [leadModalOpen, setLeadModalOpen] = useState(false);
        const [targetGroupId, setTargetGroupId] = useState<string | null>(null);

        const { handleStageChange, handleDeleteLead, handleDeleteGroup, handleAddLeadToGroup } = useGroupActions({
            refetch,
            refetchLeads,
            fetchGroupLeads,
            addLeadToGroupOptimistic,
            updateLeadStageOptimistic,
        });

        const exportColumns = [
            { key: "name", header: "Lead Name" }, { key: "service", header: "Service" },
            { key: "vehicle", header: "Vehicle" }, { key: "source", header: "Source" },
            { key: "depositStatus", header: "Deposit" }, { key: "stage", header: "Stage" }, { key: "date", header: "Date" },
        ];
        const { handleExport } = useExportExcel({ data: groupLeads, columns: exportColumns, filename: "group-leads-export" });

        useImperativeHandle(ref, () => ({
            exportData: () => {
                handleExport();
            },
        }), [handleExport]);

        useEffect(() => {
            getStages().then((s) => setStages(mapStagesToOptions(s)));
        }, []);

        useEffect(() => {
            if (!groupModalOpen) {
                refetch();
                refetchLeads();
            }
        }, [groupModalOpen, refetch, refetchLeads]);

        const handleLeadAdded = useCallback(async (leadId: string) => {
            if (!targetGroupId) return;

            const leadData = leads.find(l => l.id === leadId);
            const success = await handleAddLeadToGroup(targetGroupId, leadId, leadData);

            if (success) {
                setTargetGroupId(null);
                setLeadModalOpen(false);
            }
        }, [targetGroupId, leads, handleAddLeadToGroup]);

        // ✅ Optimistic group creation
        const handleGroupCreated = useCallback(async (newGroup: any) => {
            // ✅ Immediately add group to UI
            const optimisticGroup: any = {
                id: newGroup.id || `temp_${Date.now()}`,
                name: newGroup.name,
                description: newGroup.description || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                brevoListId: newGroup.brevoListId || null,
                _count: { leads: 0 },
            };

            addGroupOptimistic(optimisticGroup);

            // ✅ Close modal immediately
            onGroupModalClose();
            toast.success(`Group "${newGroup.name}" created`);

            // ✅ Refetch in background to get real ID and sync
            try {
                await refetch();
                await refetchLeads();
                // ✅ Remove optimistic version if API returned real one
                if (newGroup.id && !newGroup.id.startsWith('temp_')) {
                    removeOptimisticGroup(optimisticGroup.id);
                }
            } catch (error) {
                console.error('Error syncing groups after creation:', error);
            }
        }, [addGroupOptimistic, removeOptimisticGroup, refetch, refetchLeads, onGroupModalClose]);

        const filteredGroups = groups.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

        if (isLoading) {
            return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#0098E8] border-t-transparent rounded-full animate-spin" /></div>;
        }

        return (
            <div className="flex flex-col gap-3 w-full">
                <GroupsHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onExport={handleExport}
                    exportDisabled={groupLeads.length === 0}
                    onAddGroup={() => onGroupModalClose()}
                />
                <GroupsList
                    groups={filteredGroups}
                    leads={groupLeads}
                    stages={stages}
                    onStageChange={handleStageChange}
                    onDelete={handleDeleteLead}
                    onAddLead={(gid: string) => {
                        setTargetGroupId(gid);
                        setLeadModalOpen(true);
                    }}
                    onDeleteGroup={handleDeleteGroup}
                    router={router}
                />
                <CreateGroupModal
                    isOpen={groupModalOpen}
                    onClose={() => { }}
                    selectedLeads={[]}
                    onGroupCreated={handleGroupCreated}
                />
                <AddLeadModal
                    isOpen={leadModalOpen}
                    onClose={() => { setLeadModalOpen(false); setTargetGroupId(null); }}
                    onLeadCreated={handleLeadAdded}
                    stages={stages}
                />
            </div>
        );
    }
);