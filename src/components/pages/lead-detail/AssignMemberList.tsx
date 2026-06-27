"use client";

import { AssignMemberItem } from "./AssignMemberItem";
import type { TeamMember } from "@/types/team";

interface AssignMemberListProps {
    members: TeamMember[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function AssignMemberList({
    members,
    selectedId,
    onSelect,
}: AssignMemberListProps) {
    return (
        <div className="flex flex-col gap-1">
            {members.map((member) => (
                <AssignMemberItem
                    key={member.id}
                    member={member}
                    isSelected={member.id === selectedId}
                    onSelect={() => onSelect(member.id)}
                />
            ))}
        </div>
    );
}