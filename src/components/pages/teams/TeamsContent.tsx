"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { TeamsMembersSection } from "@/components/pages/teams/TeamsMembersSection";
import { TeamsRolesSection } from "@/components/pages/teams/TeamsRolesSection";
import { TeamsModals } from "@/components/pages/teams/TeamsModals";
import { EditMemberRoleModal } from "@/components/pages/teams/EditMemberRoleModal";
import { useGetTeamMembersQuery, useGetTeamRolesQuery, useGetPermissionsQuery, useGetRoleByIdQuery, useBlockMemberMutation, useUnblockMemberMutation } from "@/services/team.api";
import { useTeamFilters } from "@/hooks/useTeamFilters";
import { useTeamPermissions } from "@/hooks/useTeamPermissions";
import type { RootState } from "@/lib/store";
import type { TeamMember, TeamRole } from "@/types/team";
import { toast } from "react-toastify";

export function TeamsContent() {
    const { data: members = [], isLoading, error, refetch: refetchMembers } = useGetTeamMembersQuery();
    const { data: roles = [], refetch: refetchRoles } = useGetTeamRolesQuery();
    const { data: permissions = [] } = useGetPermissionsQuery();
    const [blockMember] = useBlockMemberMutation();
    const [unblockMember] = useUnblockMemberMutation();
    const { searchQuery, setSearchQuery, filteredMembers } = useTeamFilters(members);
    const [currentPage, setCurrentPage] = useState(1);
    const [editRole, setEditRole] = useState<TeamRole | null>(null);
    const [rolePermissions, setRolePermissions] = useState<string[]>([]);
    const rolePermissionsRef = useRef<string[]>([]);
    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [createRoleOpen, setCreateRoleOpen] = useState(false);
    const [editMemberRoleTarget, setEditMemberRoleTarget] = useState<TeamMember | null>(null);

    const currentUser = useSelector((state: RootState) => state.auth.user);

    const { data: rolePerms = [] } = useGetRoleByIdQuery(editRole?.name || "", { skip: !editRole });
    const { handleSavePermissions } = useTeamPermissions();

    useEffect(() => {
        if (rolePerms.length > 0) {
            const current = rolePermissionsRef.current;
            if (current.length !== rolePerms.length || !current.every((id) => rolePerms.includes(id))) {
                setRolePermissions(rolePerms);
                rolePermissionsRef.current = rolePerms;
            }
        } else {
            if (rolePermissionsRef.current.length > 0) {
                setRolePermissions([]);
                rolePermissionsRef.current = [];
            }
        }
    }, [rolePerms]);

    const handleEditRole = (member: TeamMember) => {
        setEditMemberRoleTarget(member);
    };

    const handleToggleBlock = async (member: TeamMember) => {
        try {
            if (member.status === 1) {
                await blockMember(member.id).unwrap();
                toast.success(`${member.email} blocked`);
            } else {
                await unblockMember(member.id).unwrap();
                toast.success(`${member.email} unblocked`);
            }
        } catch {
            toast.error("Action failed");
        }
    };

    if (isLoading) return <div className="h-75 bg-gray-100 rounded-lg animate-pulse w-full" />;
    if (error) return <div className="flex items-center justify-center py-12 text-[#FF4345] font-inter">Failed to load team members.</div>;

    return (
        <div className="flex flex-col gap-6 w-full">
            <TeamsMembersSection
                members={filteredMembers}
                roles={roles}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onEditRole={handleEditRole}
                onToggleBlock={handleToggleBlock}
                onAddMember={() => setAddMemberOpen(true)}
                currentUserId={currentUser?.id || ""}
                currentUserRole={currentUser?.role || ""}
            />

            <TeamsRolesSection
                roles={roles}
                members={members}
                onEditPermissions={(role) => setEditRole(role)}
                onCreateRole={() => setCreateRoleOpen(true)}
            />

            <TeamsModals
                addMemberOpen={addMemberOpen}
                onAddMemberClose={() => setAddMemberOpen(false)}
                createRoleOpen={createRoleOpen}
                onCreateRoleClose={() => setCreateRoleOpen(false)}
                editRole={editRole}
                onEditRoleClose={() => setEditRole(null)}
                roles={roles}
                permissions={permissions}
                rolePermissions={rolePermissions}
                onMemberAdded={() => refetchMembers()}
                onRoleCreated={() => refetchRoles()}
                onSavePermissions={handleSavePermissions}
            />

            <EditMemberRoleModal
                isOpen={!!editMemberRoleTarget}
                onClose={() => setEditMemberRoleTarget(null)}
                member={editMemberRoleTarget}
                roles={roles}
            />
        </div>
    );
}