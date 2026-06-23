"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Pencil } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { createTeamsColumns } from "@/components/pages/teams/TeamsColumns";
import { EditPermissionsModal } from "@/components/pages/teams/EditPermissionsModal";
import { useGetTeamMembersQuery, useGetTeamRolesQuery, useGetPermissionsQuery, useGetRoleByIdQuery, useBlockMemberMutation, useUnblockMemberMutation } from "@/services/team.api";
import { useTeamFilters } from "@/hooks/useTeamFilters";
import type { TeamMember, TeamRole } from "@/types/team";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

export function TeamsContent() {
    const { data: members = [], isLoading, error } = useGetTeamMembersQuery();
    const { data: roles = [] } = useGetTeamRolesQuery();
    const { data: permissions = [] } = useGetPermissionsQuery();
    const [blockMember] = useBlockMemberMutation();
    const [unblockMember] = useUnblockMemberMutation();
    const { searchQuery, setSearchQuery, filteredMembers } = useTeamFilters(members);
    const [currentPage, setCurrentPage] = useState(1);
    const [editRole, setEditRole] = useState<TeamRole | null>(null);
    const [rolePermissions, setRolePermissions] = useState<string[]>([]);

    const totalPages = Math.max(1, Math.ceil(filteredMembers.length / ITEMS_PER_PAGE));
    const paginated = useMemo(() => filteredMembers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filteredMembers, currentPage]);

    const { data: rolePerms = [] } = useGetRoleByIdQuery(editRole?.name || "", { skip: !editRole });

    useEffect(() => {
        if (rolePerms.length > 0) {
            setRolePermissions(rolePerms);
        } else {
            setRolePermissions([]);
        }
    }, [rolePerms]);

    const handleEditRole = (member: TeamMember) => toast.info(`Edit role for ${member.email} — coming soon`);
    const handleToggleBlock = async (member: TeamMember) => {
        try {
            if (member.status === 1) { await blockMember(member.id).unwrap(); toast.success(`${member.email} blocked`); }
            else { await unblockMember(member.id).unwrap(); toast.success(`${member.email} unblocked`); }
        } catch { toast.error("Action failed"); }
    };

    const handleEditPermissions = (role: TeamRole) => {
        setEditRole(role);
    };

    const handleSavePermissions = (roleId: string, perms: string[]) => {
        console.log("Save permissions for", roleId, perms);
        // PATCH /api/admin/role/{id} with permissions
    };

    const columns = useMemo(() => createTeamsColumns({ onEditRole: handleEditRole, onToggleBlock: handleToggleBlock }), []);

    if (isLoading) return <div className="h-75 bg-gray-100 rounded-lg animate-pulse w-full" />;
    if (error) return <div className="flex items-center justify-center py-12 text-[#FF4345] font-inter">Failed to load team members.</div>;

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Members Section */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end gap-3 self-stretch">
                    <h2 className="text-[#0B1220] font-lora text-lg sm:text-xl font-bold leading-[100%]">Teams</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex px-4 py-3 items-center gap-3 rounded-lg border border-[#E8E8E9] bg-white min-w-[260px]">
                            <Search size={20} className="text-[#777980] shrink-0" />
                            <input type="text" placeholder="Search members..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent" />
                        </div>
                        <Button className="flex py-2.5 px-4 items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors w-auto!" onClick={() => toast.info("Add Member — coming soon")}>
                            <Icon name="plus" width={14} height={14} /> Add Member
                        </Button>
                    </div>
                </div>

                <DataTable columns={columns} data={paginated} rowKey={(row) => row.id} className="w-full" />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredMembers.length} itemsPerPage={ITEMS_PER_PAGE} />
            </div>

            {/* Roles Section */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end gap-3 self-stretch">
                    <h2 className="text-[#0B1220] font-lora text-lg sm:text-xl font-bold leading-[100%]">Roles & Permissions</h2>
                    <Button className="flex py-2.5 px-4 items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors w-auto!" onClick={() => toast.info("Create Role — coming soon")}>
                        <Icon name="plus" width={14} height={14} /> Create Role
                    </Button>
                </div>

                <div className="w-full overflow-x-auto rounded-lg border border-[#E8E8E9]">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#F1F1F1]">
                                <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider">Role Name</th>
                                <th className="py-2.5 px-4 text-left text-[#777980] font-inter text-xs font-medium uppercase tracking-wider w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.length === 0 ? (
                                <tr><td colSpan={2} className="py-10 text-center text-[#777980] text-sm">No roles found.</td></tr>
                            ) : (
                                roles.map((role) => (
                                    <tr key={role.id} className="border-t border-[#E8E8E9] bg-white">
                                        <td className="py-2.5 px-4 text-[#1B1B1B] font-inter text-sm font-medium">{role.name}</td>
                                        <td className="py-2.5 px-4">
                                            <Button variant="icon" onClick={() => handleEditPermissions(role)} className="flex p-1.5 items-center rounded text-[#777980] hover:text-[#1B1B1B] hover:bg-gray-100 transition-colors">
                                                <Pencil size={15} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <EditPermissionsModal
                isOpen={!!editRole}
                onClose={() => setEditRole(null)}
                role={editRole}
                allPermissions={permissions}
                selectedPermissions={rolePermissions}
                onSave={handleSavePermissions}
            />
        </div>
    );
}