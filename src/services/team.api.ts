import { createApi } from "@reduxjs/toolkit/query/react";
import type {
    TeamMember,
    TeamRole,
    Permission,
    MembersApiResponse,
    PermissionsMap,
    RoleDetailResponse,
} from "@/types/team";
import { APP_CONFIG } from "@/configs/app.config";
import {
    mockTeamMembers,
    mockTeamRoles,
    mockPermissions,
} from "@/mocks/team.mock";
import axiosInstance from "@/lib/axios-instance";
import { getAccessToken } from "@/lib/auth-client";

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapMember(data: MembersApiResponse["data"][0]): TeamMember {
    return {
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        status: data.status,
        role: data.roleUsers?.[0]?.role?.name || "Staff",
        roleId: data.roleUsers?.[0]?.role?.id || "",
        createdAt: data.created_at?.split("T")[0] || "",
    };
}

function mapPermissions(data: PermissionsMap): Permission[] {
    const result: Permission[] = [];
    for (const [module, items] of Object.entries(data)) {
        for (const item of items) {
            result.push({
                id: (item as any).id || `${module}:${item.action}`,
                name: `${module}:${item.action}`,
                module,
            });
        }
    }
    return result;
}

export const teamApi = createApi({
    reducerPath: "teamApi",
    baseQuery: async () => ({ data: null }),
    tagTypes: ["TeamMembers", "TeamRoles"],
    endpoints: (builder) => ({
        getTeamMembers: builder.query<TeamMember[], void>({
            queryFn: async () => {
                try {
                    if (APP_CONFIG.MOCK_MODE) {
                        await delay(APP_CONFIG.MOCK_DELAY_MS);
                        return { data: [...mockTeamMembers] };
                    }
                    const { data } = await axiosInstance.get<MembersApiResponse>(
                        "/admin/members"
                    );
                    return { data: data.data.map(mapMember) };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data:
                                error instanceof Error
                                    ? error.message
                                    : "Failed to fetch members",
                        },
                    };
                }
            },
            providesTags: ["TeamMembers"],
        }),

        getTeamRoles: builder.query<TeamRole[], void>({
            queryFn: async () => {
                try {
                    if (APP_CONFIG.MOCK_MODE) {
                        await delay(APP_CONFIG.MOCK_DELAY_MS);
                        return { data: [...mockTeamRoles] };
                    }
                    const res = await axiosInstance.get<{
                        success: boolean;
                        data: TeamRole[];
                    }>("/admin/role");
                    return { data: res.data.data };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data:
                                error instanceof Error
                                    ? error.message
                                    : "Failed to fetch roles",
                        },
                    };
                }
            },
            providesTags: ["TeamRoles"],
        }),

        getPermissions: builder.query<Permission[], void>({
            queryFn: async () => {
                try {
                    if (APP_CONFIG.MOCK_MODE) {
                        await delay(APP_CONFIG.MOCK_DELAY_MS);
                        return { data: [...mockPermissions] };
                    }
                    const res = await axiosInstance.get<{
                        success: boolean;
                        data: PermissionsMap;
                    }>("/admin/role/permissions");
                    return { data: mapPermissions(res.data.data) };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data:
                                error instanceof Error
                                    ? error.message
                                    : "Failed to fetch permissions",
                        },
                    };
                }
            },
        }),

        getRoleById: builder.query<string[], string>({
            queryFn: async (name) => {
                try {
                    if (APP_CONFIG.MOCK_MODE) {
                        await delay(APP_CONFIG.MOCK_DELAY_MS);
                        const mockPermIds = mockPermissions.slice(0, 5).map((p) => p.id);
                        return { data: mockPermIds };
                    }
                    const res = await axiosInstance.get<RoleDetailResponse>(
                        `/admin/role/${name}`
                    );
                    const permIds = res.data.data.permissions.map(
                        (p) => p.permission.id
                    );
                    return { data: permIds };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data:
                                error instanceof Error
                                    ? error.message
                                    : "Failed to fetch role",
                        },
                    };
                }
            },
            providesTags: (_result, _error, name) =>
                name ? [{ type: "TeamRoles", id: name }] : [],
        }),

        updateRolePermissions: builder.mutation<
            { success: boolean; message: string; data?: any },
            { id: string; permissions: string[] }
        >({
            queryFn: async ({ id, permissions }) => {
                try {
                    if (APP_CONFIG.MOCK_MODE) {
                        await delay(APP_CONFIG.MOCK_DELAY_MS);
                        return {
                            data: {
                                success: true,
                                message: "Role updated successfully",
                                data: { id, permissions },
                            },
                        };
                    }

                    const token = getAccessToken();
                    if (!token) {
                        return {
                            error: {
                                status: 401,
                                data: "No access token found",
                            },
                        };
                    }

                    const response = await fetch(
                        `${APP_CONFIG.API_BASE_URL}/admin/role/${id}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ permissionIds: permissions }),
                        }
                    );

                    const responseData = await response.json();

                    if (!response.ok) {
                        return {
                            error: {
                                status: response.status,
                                data: responseData.message || "Failed to update permissions",
                            },
                        };
                    }

                    return { data: responseData };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data:
                                error instanceof Error
                                    ? error.message
                                    : "Failed to update permissions",
                        },
                    };
                }
            },
            // ✅ Fix: invalidate all TeamRoles queries so the role permissions are refetched
            invalidatesTags: ["TeamRoles"],
        }),

        updateMemberRole: builder.mutation<
            void,
            { id: string; roleNames: string[] }
        >({
            queryFn: async ({ id, roleNames }) => {
                try {
                    if (APP_CONFIG.MOCK_MODE) {
                        await delay(APP_CONFIG.MOCK_DELAY_MS);
                        const member = mockTeamMembers.find((m) => m.id === id);
                        if (member) member.role = roleNames[0] || member.role;
                        return { data: undefined };
                    }
                    await axiosInstance.put(`/admin/members/${id}/roles`, {
                        roleNames,
                    });
                    return { data: undefined };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data:
                                error instanceof Error
                                    ? error.message
                                    : "Failed to update role",
                        },
                    };
                }
            },
            invalidatesTags: ["TeamMembers"],
        }),

        blockMember: builder.mutation<void, string>({
            queryFn: async (id) => {
                try {
                    if (APP_CONFIG.MOCK_MODE) {
                        await delay(APP_CONFIG.MOCK_DELAY_MS);
                        const member = mockTeamMembers.find((m) => m.id === id);
                        if (member) member.status = 0;
                        return { data: undefined };
                    }
                    await axiosInstance.put(`/admin/members/${id}/block`);
                    return { data: undefined };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data:
                                error instanceof Error
                                    ? error.message
                                    : "Failed to block member",
                        },
                    };
                }
            },
            invalidatesTags: ["TeamMembers"],
        }),

        unblockMember: builder.mutation<void, string>({
            queryFn: async (id) => {
                try {
                    if (APP_CONFIG.MOCK_MODE) {
                        await delay(APP_CONFIG.MOCK_DELAY_MS);
                        const member = mockTeamMembers.find((m) => m.id === id);
                        if (member) member.status = 1;
                        return { data: undefined };
                    }
                    await axiosInstance.put(`/admin/members/${id}/unblock`);
                    return { data: undefined };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data:
                                error instanceof Error
                                    ? error.message
                                    : "Failed to unblock member",
                        },
                    };
                }
            },
            invalidatesTags: ["TeamMembers"],
        }),
    }),
});

export const {
    useGetTeamMembersQuery,
    useGetTeamRolesQuery,
    useGetPermissionsQuery,
    useGetRoleByIdQuery,
    useUpdateRolePermissionsMutation,
    useUpdateMemberRoleMutation,
    useBlockMemberMutation,
    useUnblockMemberMutation,
} = teamApi;