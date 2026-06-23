"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StageDropdown } from "@/components/ui/StageDropdown";
import { ActionsDropdown } from "@/components/ui/ActionsDropdown";
import type { Lead } from "@/types/leads";
import type { StageOption } from "@/components/ui/StageDropdown";
import Image from "next/image";

interface Group { id: string; name: string; leadIds: string[]; }

interface GroupAccordionProps {
    groups: Group[]; leads: Lead[]; stages: StageOption[];
    onStageChange: (id: string, stageId: string) => void;
    onDelete: (lead: Lead) => void;
    router: { push: (url: string) => void };
    onAddLead: (groupId: string) => void;
    onDeleteGroup: (groupId: string) => void;
}

const depositStatusStyles: Record<string, string> = {
    PAID: "text-[#006F1F] border-[#E8E8E9] bg-white",
    PENDING: "text-[#FFAF00] border-[#E8E8E9] bg-white",
    REFUNDED: "text-[#FF4345] border-[#E8E8E9] bg-white",
    NONE: "text-[#777980] border-[#E8E8E9] bg-white",
};

const colWidths = ["22%", "15%", "12%", "13%", "11%", "15%", "8%"];

export function GroupAccordion({ groups, leads, stages, onStageChange, onDelete, router, onAddLead, onDeleteGroup }: GroupAccordionProps) {
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(groups.length > 0 ? [groups[0].id] : []));

    const toggleGroup = (groupId: string) => {
        setExpandedGroups((prev) => {
            const next = new Set(prev);
            next.has(groupId) ? next.delete(groupId) : next.add(groupId);
            return next;
        });
    };

    const getLeadsForGroup = (group: Group): Lead[] => leads.filter((l) => group.leadIds.includes(l.id));

    if (groups.length === 0) {
        return <div className="flex items-center justify-center py-20 text-[#777980] font-inter text-sm">No groups yet. Select leads and create a group.</div>;
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-[#E8E8E9]">
            <table className="w-full border-collapse">
                <colgroup>
                    {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
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
                            <tr key={group.id}>
                                <td colSpan={8} className="p-0">
                                    {/* Group header */}
                                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E8E9] bg-white hover:bg-[#F8FAFB] transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-[#777980]" />
                                            <span className="text-sm font-semibold text-[#1B1B1B]">{group.name}</span>
                                            <span className="text-xs text-[#777980] bg-[#F1F1F1] px-2 py-0.5 rounded-full">{group.leadIds.length} Leads</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {isExpanded && (
                                                <>
                                                    <Button variant="icon" onClick={() => onAddLead(group.id)} className="flex h-6 w-6 items-center justify-center rounded text-[#777980] hover:bg-gray-100 transition-colors">
                                                        <Plus size={14} />
                                                    </Button>
                                                    <Button variant="icon" onClick={() => onDeleteGroup(group.id)} className="flex h-6 w-6 items-center justify-center rounded text-[#FF4345] hover:bg-red-50 transition-colors">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="icon" onClick={() => toggleGroup(group.id)} className="flex h-6 w-6 items-center justify-center rounded text-[#777980] hover:bg-gray-100 transition-colors">
                                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Expanded leads */}
                                    {isExpanded && groupLeads.length > 0 && (
                                        <table className="w-full">
                                            <colgroup>
                                                {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
                                            </colgroup>
                                            <tbody>
                                                {groupLeads.map((lead) => (
                                                    <tr key={lead.id} className="border-t border-[#E8E8E9] bg-white">
                                                        <td className="py-2.5 px-4 border-r border-[#E8E8E9]">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full overflow-hidden border border-white shrink-0">
                                                                    <Image src={lead.avatar} alt={lead.name} width={24} height={24} className="object-cover" />
                                                                </div>
                                                                <span className="text-[#1B1B1B] font-inter text-sm truncate max-w-[120px]">{lead.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-2.5 px-4 border-r border-[#E8E8E9] text-[#1B1B1B] font-inter text-sm">{lead.service}</td>
                                                        <td className="py-2.5 px-4 border-r border-[#E8E8E9] text-[#1B1B1B] font-inter text-sm">{lead.vehicle}</td>
                                                        <td className="py-2.5 px-4 border-r border-[#E8E8E9] text-[#1B1B1B] font-inter text-sm">{lead.source}</td>
                                                        <td className="py-2.5 px-4 border-r border-[#E8E8E9]">
                                                            <span className={`inline-flex py-1.5 px-2 justify-center items-center gap-1 rounded border text-xs capitalize ${depositStatusStyles[lead.depositStatus] || depositStatusStyles.NONE}`}>{lead.depositStatus}</span>
                                                        </td>
                                                        <td className="py-2.5 px-4 border-r border-[#E8E8E9]">
                                                            <StageDropdown currentStage={lead.stage} stages={stages} onSelect={(stageId) => onStageChange(lead.id, stageId)} />
                                                        </td>
                                                        <td className="py-2.5 px-4 border-r border-[#E8E8E9] text-[#777980] font-inter text-sm">{lead.date}</td>
                                                        <td className="py-2.5 px-4">
                                                            <ActionsDropdown items={[
                                                                { label: "View Lead", onClick: () => router.push(`/leads/${lead.id}`) },
                                                                { label: "Delete", onClick: () => onDelete(lead), variant: "danger" as const },
                                                            ]} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}

                                    {/* Empty state */}
                                    {isExpanded && groupLeads.length === 0 && (
                                        <div onClick={() => onAddLead(group.id)} className="mx-4 my-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#DFE1E7] py-6 text-[#777980] hover:border-[#B0B3BC] hover:text-[#1B1B1B] transition-colors">
                                            <Plus size={16} className="mb-1" />
                                            <span className="text-xs">Add Member</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}