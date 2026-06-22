"use client";

import { useState, useRef, useCallback } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { LeadsTable, type LeadsTableHandle } from "@/components/pages/leads/LeadsTable";
import { CreateGroupModal } from "@/components/pages/leads/CreateGroupModal";
import { GroupDropdown } from "@/components/pages/leads/GroupDropdown";

interface Group {
    id: string;
    name: string;
    leadIds: string[];
}

export function GroupsContent() {
    const tableRef = useRef<LeadsTableHandle>(null);
    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleGroupSelect = useCallback((group: Group | null) => {
        setSelectedGroup(group);
    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-3 sm:gap-4 p-3 sm:p-4">
            {/* Header */}
            <div className="flex justify-between items-end gap-3 self-stretch">
                <h2 className="text-[#0B1220] font-lora text-lg sm:text-xl font-bold leading-[100%]">
                    Lead Groups
                </h2>
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <Button
                        variant="outline"
                        className="flex py-2 sm:py-2.5 px-3 sm:px-4 justify-center items-center gap-1.5 sm:gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-xs sm:text-sm font-normal"
                        onClick={() => tableRef.current?.exportCSV()}
                    >
                        <Icon name="export" width={14} height={14} className="sm:w-4 sm:h-4" />
                        Export
                    </Button>
                    <Button
                        className="flex py-2 sm:py-2.5 px-3 sm:px-4 justify-center items-center gap-1.5 sm:gap-2 rounded bg-[#0098E8] text-white font-inter text-xs sm:text-sm font-normal hover:bg-[#0088D8] transition-colors whitespace-nowrap"
                        onClick={() => setGroupModalOpen(true)}
                    >
                        <Icon name="plus" width={14} height={14} className="sm:w-4 sm:h-4" />
                        New Group
                    </Button>
                </div>
            </div>

            {/* Filters row */}
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <GroupDropdown onSelect={handleGroupSelect} />
                </div>
                <div className="flex px-4 py-3 items-center gap-3 rounded-lg border border-[#E8E8E9] bg-white flex-1 max-w-[400px]">
                    <Search size={20} className="text-[#777980] shrink-0" />
                    <input
                        type="text"
                        placeholder="Search leads in group..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent"
                    />
                </div>
            </div>

            {/* Group info bar */}
            {selectedGroup && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#DFE1E7] bg-[#F8FAFB]">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#0098E8] flex items-center justify-center text-white font-inter text-sm font-semibold">
                            {selectedGroup.name.charAt(0)}
                        </span>
                        <div>
                            <span className="text-[#1B1B1B] font-inter text-sm font-medium">{selectedGroup.name}</span>
                            <span className="text-[#777980] font-inter text-xs ml-2">{selectedGroup.leadIds.length} leads</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <LeadsTable
                ref={tableRef}
                viewMode="list"
                groupMode="groups"
                groupFilter={selectedGroup?.leadIds}
                searchQuery={searchQuery}
            />

            <CreateGroupModal
                isOpen={groupModalOpen}
                onClose={() => setGroupModalOpen(false)}
                selectedLeads={[]}
            />
        </div>
    );
}