// "use client";

// import { useState, useEffect } from "react";
// import { GroupAccordionRow } from "./GroupAccordionRow";
// import type { Lead } from "@/types/leads";
// import type { StageOption } from "@/components/ui/StageDropdown";

// interface Group {
//     id: string;
//     name: string;
//     leadIds: string[];
//     _count?: { leads: number };
// }

// interface GroupAccordionProps {
//     groups: Group[];
//     leads: Lead[];
//     stages: StageOption[];
//     onStageChange: (id: string, stageId: string) => void;
//     onDelete: (lead: Lead) => void;
//     router: { push: (url: string) => void };
//     onAddLead: (groupId: string) => void;
//     onDeleteGroup: (groupId: string) => void;
//     onGroupExpand?: (groupId: string) => void; // ✅ NEW: callback when group expands
// }

// export function GroupAccordion({
//     groups,
//     leads,
//     stages,
//     onStageChange,
//     onDelete,
//     router,
//     onAddLead,
//     onDeleteGroup,
//     onGroupExpand,
// }: GroupAccordionProps) {
//     const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

//     useEffect(() => {
//         if (groups.length > 0 && expandedGroups.size === 0) {
//             const firstGroupId = groups[0].id;
//             setExpandedGroups(new Set([firstGroupId]));
//             onGroupExpand?.(firstGroupId);
//         }
//     }, [groups, expandedGroups.size, onGroupExpand]);

//     const toggleGroup = (groupId: string) => {
//         setExpandedGroups((prev) => {
//             const next = new Set(prev);
//             if (next.has(groupId)) {
//                 next.delete(groupId);
//             } else {
//                 next.add(groupId);
//                 onGroupExpand?.(groupId);
//             }
//             return next;
//         });
//     };

//     const getLeadsForGroup = (group: Group): Lead[] => {
//         return leads.filter((l) => group.leadIds.includes(l.id));
//     };

//     if (groups.length === 0) {
//         return (
//             <div className="flex items-center justify-center py-20 text-[#777980] font-inter text-sm">
//                 No groups yet. Select leads and create a group.
//             </div>
//         );
//     }

//     return (
//         <div className="w-full overflow-x-auto rounded-lg border border-[#E8E8E9]">
//             <table className="w-full border-collapse">
//                 <colgroup>
//                     {["22%", "15%", "12%", "13%", "11%", "15%", "8%"].map((w, i) => (
//                         <col key={i} style={{ width: w }} />
//                     ))}
//                 </colgroup>
//                 <thead>
//                     <tr className="bg-[#F1F1F1]">
//                         <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Lead Name</th>
//                         <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Service</th>
//                         <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Vehicle</th>
//                         <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Source</th>
//                         <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Deposit</th>
//                         <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Stage</th>
//                         <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Date</th>
//                         <th className="py-2.5 px-4 w-10" />
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {groups.map((group) => {
//                         const isExpanded = expandedGroups.has(group.id);
//                         const groupLeads = getLeadsForGroup(group);
//                         return (
//                             <GroupAccordionRow
//                                 key={group.id}
//                                 group={group}
//                                 isExpanded={isExpanded}
//                                 groupLeads={groupLeads}
//                                 stages={stages}
//                                 onToggle={toggleGroup}
//                                 onStageChange={onStageChange}
//                                 onDelete={onDelete}
//                                 onAddLead={onAddLead}
//                                 onDeleteGroup={onDeleteGroup}
//                                 router={router}
//                             />
//                         );
//                     })}
//                 </tbody>
//             </table>
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import { GroupAccordionRow } from "./GroupAccordionRow";
import type { Lead } from "@/types/leads";
import type { StageOption } from "@/components/ui/StageDropdown";

interface Group {
    id: string;
    name: string;
    leadIds: string[];
    _count?: { leads: number };
}

interface GroupAccordionProps {
    groups: Group[];
    leads: Lead[];
    stages: StageOption[];
    onStageChange: (id: string, stageId: string) => void;
    onDelete: (lead: Lead) => void;
    router: { push: (url: string) => void };
    onAddLead: (groupId: string) => void;
    onDeleteGroup: (groupId: string) => void;
    onGroupExpand?: (groupId: string) => void;
}

export function GroupAccordion({
    groups,
    leads,
    stages,
    onStageChange,
    onDelete,
    router,
    onAddLead,
    onDeleteGroup,
    onGroupExpand,
}: GroupAccordionProps) {
    // ✅ All groups start collapsed – no auto‑expansion
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    const toggleGroup = (groupId: string) => {
        setExpandedGroups((prev) => {
            const next = new Set(prev);
            if (next.has(groupId)) {
                next.delete(groupId);
            } else {
                next.add(groupId);
                // ✅ Fetch leads only when user explicitly expands
                onGroupExpand?.(groupId);
            }
            return next;
        });
    };

    const getLeadsForGroup = (group: Group): Lead[] => {
        return leads.filter((l) => group.leadIds.includes(l.id));
    };

    if (groups.length === 0) {
        return (
            <div className="flex items-center justify-center py-20 text-[#777980] font-inter text-sm">
                No groups yet. Select leads and create a group.
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-[#E8E8E9]">
            <table className="w-full border-collapse">
                <colgroup>
                    {["22%", "15%", "12%", "13%", "11%", "15%", "8%"].map((w, i) => (
                        <col key={i} style={{ width: w }} />
                    ))}
                </colgroup>
                <thead>
                    <tr className="bg-[#F1F1F1]">
                        <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Lead Name</th>
                        <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Service</th>
                        <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Vehicle</th>
                        <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Source</th>
                        <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Deposit</th>
                        <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Stage</th>
                        <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider border-r border-[#E8E8E9]">Date</th>
                        <th className="py-2.5 px-4 w-10" />
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group) => {
                        const isExpanded = expandedGroups.has(group.id);
                        const groupLeads = getLeadsForGroup(group);
                        return (
                            <GroupAccordionRow
                                key={group.id}
                                group={group}
                                isExpanded={isExpanded}
                                groupLeads={groupLeads}
                                stages={stages}
                                onToggle={toggleGroup}
                                onStageChange={onStageChange}
                                onDelete={onDelete}
                                onAddLead={onAddLead}
                                onDeleteGroup={onDeleteGroup}
                                router={router}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}