import { Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ActionsDropdown } from "@/components/ui/ActionsDropdown";
import type { Column } from "@/components/ui/DataTable";
import type { TeamMember } from "@/types/team";

const roleStyles: Record<string, string> = {
    Admin: "bg-[#FFE6E6] text-[#FF4345]",
    Manager: "bg-[#DCF7EA] text-[#006F1F]",
    Staff: "bg-[#FFF7E6] text-[#FFAF00]",
    "View Only": "bg-[#F8FAFB] text-[#777980]",
};

const statusStyles: Record<number, string> = {
    1: "bg-[#DCF7EA] text-[#006F1F]",
    0: "bg-[#FFE6E6] text-[#FF4345]",
};

interface TeamsColumnsParams {
    onEditRole: (member: TeamMember) => void;
    onToggleBlock: (member: TeamMember) => void;
}

export function createTeamsColumns({ onEditRole, onToggleBlock }: TeamsColumnsParams): Column<TeamMember>[] {
    return [
        {
            key: "name",
            header: "Member",
            render: (row) => (
                <div>
                    <span className="text-[#1B1B1B] font-inter text-sm font-medium block">{row.name || row.username || "—"}</span>
                    <span className="text-[#777980] font-inter text-xs">{row.email}</span>
                </div>
            ),
        },
        {
            key: "role",
            header: "Role",
            render: (row) => (
                <span className={`inline-flex py-1.5 px-3 justify-center items-center gap-1 rounded-md text-sm font-medium ${roleStyles[row.role] || roleStyles["Staff"]}`}>
                    {row.role}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (row) => (
                <span className={`inline-flex py-1.5 px-3 justify-center items-center gap-1 rounded-md text-sm font-medium ${statusStyles[row.status]}`}>
                    {row.status === 1 ? "Active" : "Blocked"}
                </span>
            ),
        },
        {
            key: "actions",
            header: "",
            className: "w-12",
            render: (row) => (
                <ActionsDropdown items={[
                    { label: "Edit Role", onClick: () => onEditRole(row) },
                    { label: row.status === 1 ? "Block" : "Unblock", onClick: () => onToggleBlock(row), variant: row.status === 1 ? "danger" as const : "default" as const },
                ]} />
            ),
        },
    ];
}