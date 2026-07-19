"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { createTeamsColumns } from "@/components/pages/teams/TeamsColumns";
import type { TeamMember } from "@/types/team";

const ITEMS_PER_PAGE = 10;

interface TeamsMembersSectionProps {
    members: TeamMember[];
    searchQuery: string;
    onSearchChange: (val: string) => void;
    currentPage: number;
    onPageChange: (page: number) => void;
    onEditRole: (member: TeamMember) => void;
    onToggleBlock: (member: TeamMember) => void;
    onAddMember: () => void;
}

export function TeamsMembersSection({
    members,
    searchQuery,
    onSearchChange,
    currentPage,
    onPageChange,
    onEditRole,
    onToggleBlock,
    onAddMember,
}: TeamsMembersSectionProps) {
    const [inputValue, setInputValue] = useState(searchQuery);
    // const totalPages = Math.max(1, Math.ceil(members.length / ITEMS_PER_PAGE));
    const paginated = useMemo(
        () => members.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
        [members, currentPage]
    );

    const columns = useMemo(
        () => createTeamsColumns({ onEditRole, onToggleBlock }),
        [onEditRole, onToggleBlock]
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end gap-3 self-stretch">
                <h2 className="text-[#0B1220] font-lora text-lg sm:text-xl font-bold leading-[100%]">
                    Teams
                </h2>
                <div className="flex items-center gap-3">
                    <div className="relative min-w-[260px]">
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 border border-[#E8E8E9] rounded-lg bg-white text-sm text-[#1B1B1B] placeholder-[#777980] font-inter outline-none focus:border-[#0098E8]"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                onSearchChange(inputValue);
                                onPageChange(1);
                            }}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md bg-[#0098E8] text-white hover:bg-[#0088D8] transition-colors"
                        >
                            <Search size={16} />
                        </button>
                    </div>
                    <Button
                        className="flex py-2.5 px-4 items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors w-auto!"
                        onClick={onAddMember}
                    >
                        <Icon name="plus" width={14} height={14} /> Add Member
                    </Button>
                </div>
            </div>

            {/* Scrollable table – max 4 rows visible */}
            <div className="max-h-79 overflow-y-auto rounded-lg border border-[#E8E8E9]">
                <DataTable
                    columns={columns}
                    data={paginated}
                    rowKey={(row) => row.id}
                    className="border-0 rounded-none"
                />
            </div>

            {/* <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                totalItems={members.length}
                itemsPerPage={ITEMS_PER_PAGE}
            /> */}
        </div>
    );
}