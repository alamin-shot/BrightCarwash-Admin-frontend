import type { TeamMember, TeamRole, Permission } from "@/types/team";

export const mockTeamMembers: TeamMember[] = [
    { id: "cmqgewibz000078tmnjqzlpti", name: "Admin User", username: "admin", email: "admin@email.com", avatar: null, status: 1, role: "Admin", roleId: "cmqgeeptx000j10tm5d4ebusk", createdAt: "2026-06-16" },
    { id: "cmqgewimd000178tm03slhusb", name: "Manager User", username: "manager", email: "manager@email.com", avatar: null, status: 1, role: "Manager", roleId: "cmqgevqpv000054tmtaeb67rt", createdAt: "2026-06-16" },
    { id: "cmqgi5vs8000068tmry2os1jq", name: null, username: null, email: "pajobi7789@preparmy.com", avatar: null, status: 1, role: "Manager", roleId: "cmqgevqpv000054tmtaeb67rt", createdAt: "2026-06-16" },
    { id: "cmqhk1w3x0001q4tmqv1u8ad4", name: null, username: null, email: "kocohi1604@synsky.com", avatar: null, status: 1, role: "Manager", roleId: "cmqgevqpv000054tmtaeb67rt", createdAt: "2026-06-17" },
];

export const mockTeamRoles: TeamRole[] = [
    { id: "cmqgeeptx000j10tm5d4ebusk", name: "Admin" },
    { id: "cmqgevqpv000054tmtaeb67rt", name: "Manager" },
    { id: "rol_003", name: "Staff" },
    { id: "rol_004", name: "View Only" },
];

export const mockPermissions: Permission[] = [
    { id: "dashboard_view", name: "Dashboard View", module: "DASHBOARD" },
    { id: "user_view", name: "User View", module: "USER" },
    { id: "user_create", name: "User Create", module: "USER" },
    { id: "user_edit", name: "User Edit", module: "USER" },
    { id: "user_delete", name: "User Delete", module: "USER" },
    { id: "role_view", name: "Role View", module: "ROLE" },
    { id: "role_create", name: "Role Create", module: "ROLE" },
    { id: "role_edit", name: "Role Edit", module: "ROLE" },
    { id: "role_delete", name: "Role Delete", module: "ROLE" },
    { id: "form_template_view", name: "Form Template View", module: "FORM-TEMPLATE" },
    { id: "form_template_create", name: "Form Template Create", module: "FORM-TEMPLATE" },
    { id: "form_template_edit", name: "Form Template Edit", module: "FORM-TEMPLATE" },
    { id: "form_template_delete", name: "Form Template Delete", module: "FORM-TEMPLATE" },
];