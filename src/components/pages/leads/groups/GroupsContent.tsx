'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';
import { useExportExcel } from '@/hooks/useExportExcel';
import { useGroupsContent } from '@/hooks/useGroupsContent';
import { GroupsHeader } from './GroupsHeader';
import { GroupsList } from './GroupsList';
import { CreateGroupModal } from './CreateGroupModal';
import { AddLeadModal } from '../kanban/AddLeadModal';

export interface GroupsContentRef {
    exportExcel: () => void;
    exportCSV: () => void;
    exportData: () => void;
}

export const GroupsContent = forwardRef<GroupsContentRef, { groupModalOpen: boolean; onGroupModalClose: () => void }>(
    function GroupsContent({ groupModalOpen, onGroupModalClose }, ref) {
        const router = useRouter();
        const {
            groups,
            groupLeads,
            isLoading,
            searchQuery,
            setSearchQuery,
            stages,
            leadModalOpen,
            setLeadModalOpen,
            targetGroupId,
            setTargetGroupId,
            createGroupModalOpen,
            setCreateGroupModalOpen,
            handleStageChange,
            handleDeleteLead,
            handleDeleteGroup,
            handleLeadAdded,
            handleGroupCreated,
        } = useGroupsContent();

        const exportColumns = [
            { key: 'groupName', header: 'Group Name' },
            { key: 'name', header: 'Lead Name' },
            { key: 'service', header: 'Service' },
            { key: 'email', header: 'Email' },
            { key: 'source', header: 'Source' },
            { key: 'depositStatus', header: 'Deposit' },
            { key: 'stage', header: 'Stage' },
            { key: 'date', header: 'Date' },
        ];

        const buildGroupExportData = () => {
            const exportData: Record<string, unknown>[] = [];
            groups.forEach((group) => {
                const groupLeadsList = groupLeads.filter((lead) => group.leadIds.includes(lead.id));
                if (groupLeadsList.length === 0) {
                    exportData.push({ groupName: group.name, name: '', service: '', email: '', source: '', depositStatus: '', stage: '', date: '' });
                } else {
                    groupLeadsList.forEach((lead) => {
                        exportData.push({
                            groupName: group.name,
                            name: lead.name,
                            service: lead.service,
                            email: lead.email,
                            source: lead.source,
                            depositStatus: lead.depositStatus,
                            stage: lead.stage,
                            date: lead.date,
                        });
                    });
                }
            });
            return exportData;
        };

        const { handleExport: exportExcel } = useExportExcel({
            data: buildGroupExportData(),
            columns: exportColumns,
            filename: 'groups-export',
        });

        useImperativeHandle(ref, () => ({
            exportExcel,
            exportCSV: () => { const data = buildGroupExportData(); if (data.length === 0) return; /* CSV logic here */ },
            exportData: () => exportExcel(),
        }), [exportExcel, buildGroupExportData]);

        if (isLoading) {
            return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#0098E8] border-t-transparent rounded-full animate-spin" /></div>;
        }

        return (
            <div className="flex flex-col gap-3 w-full">
                <GroupsHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onExport={exportExcel}
                    exportDisabled={groups.length === 0}
                    onAddGroup={() => setCreateGroupModalOpen(true)}
                />
                <GroupsList
                    groups={groups}
                    leads={groupLeads}
                    stages={stages}
                    onStageChange={handleStageChange}
                    onDelete={handleDeleteLead}
                    onAddLead={(gid: string) => { setTargetGroupId(gid); setLeadModalOpen(true); }}
                    onDeleteGroup={handleDeleteGroup}
                    router={router}
                />
                <CreateGroupModal isOpen={createGroupModalOpen} onClose={() => setCreateGroupModalOpen(false)} selectedLeads={[]} onGroupCreated={handleGroupCreated} />
                <AddLeadModal isOpen={leadModalOpen} onClose={() => { setLeadModalOpen(false); setTargetGroupId(null); }} onLeadCreated={handleLeadAdded} stages={stages} title="Add New Member" />
            </div>
        );
    }
);