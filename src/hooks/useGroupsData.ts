"use client";

import { useState, useCallback } from "react";
import { useGetLeadGroupsQuery } from "@/services/leads.api";
import { getAccessToken } from "@/lib/auth-client";
import { APP_CONFIG } from "@/configs/app.config";
import type { LeadGroup } from "@/types/campaign";
import type { Lead } from "@/types/leads";
import { toast } from "react-toastify";

// ✅ Transform API lead to Lead type
function mapApiLeadToLead(apiLead: any): Lead {
    return {
        id: apiLead.id,
        name: apiLead.name || '',
        email: apiLead.email || '',
        phone: apiLead.phone || '',
        avatar: '/images/avatar-placeholder.png',
        service: apiLead.service || '',
        vehicle: apiLead.vehicle || '',
        source: apiLead.source || '',
        priority: (apiLead.priority as Lead['priority']) || 'MEDIUM',
        deposit: 0,
        depositStatus: (apiLead.deposit_status as Lead['depositStatus']) || 'NONE',
        stage: apiLead.stage?.name?.toLowerCase().replace(/\s+/g, '_') || 'new',
        stageId: apiLead.stage_id || '',
        assignedToId: apiLead.assigned_to_id || null,
        notes: apiLead.notes || [],
        date: apiLead.created_at?.split('T')[0] || '',
    };
}

interface GroupWithLeads {
    id: string;
    name: string;
    leadIds: string[];
    _count?: { leads: number };
}

export function useGroupsData() {
    const { data: apiGroups = [], refetch: refetchGroups, isLoading } = useGetLeadGroupsQuery({ limit: 100 });
    const [groupLeadsMap, setGroupLeadsMap] = useState<Record<string, Lead[]>>({});
    const [fetchedGroups, setFetchedGroups] = useState<Set<string>>(new Set());

    console.log("📦 API Groups:", apiGroups);
    console.log("📦 groupLeadsMap:", groupLeadsMap);

    const fetchGroupLeads = useCallback(async (groupId: string) => {
        console.log("🔍 fetchGroupLeads called for group:", groupId);

        if (fetchedGroups.has(groupId)) {
            console.log("⏭️ Group already fetched, skipping:", groupId);
            return;
        }

        try {
            const token = getAccessToken();
            if (!token) {
                toast.error("Please login");
                return;
            }

            const url = `${APP_CONFIG.API_BASE_URL}/admin/lead-groups/${groupId}/leads?limit=100`;
            console.log("📡 Fetching from URL:", url);

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("📡 Response status:", res.status);

            if (!res.ok) {
                console.error("❌ Failed to fetch group leads:", res.status);
                return;
            }

            const data = await res.json();
            console.log("📡 API Response:", data);

            const leadsData = data.data?.leads || [];
            console.log("📊 Raw leads data:", leadsData);

            const mappedLeads = leadsData.map(mapApiLeadToLead);
            console.log("✅ Mapped leads:", mappedLeads);

            setGroupLeadsMap(prev => {
                const updated = { ...prev, [groupId]: mappedLeads };
                console.log("📦 Updated groupLeadsMap:", updated);
                return updated;
            });

            setFetchedGroups(prev => {
                const updated = new Set(prev).add(groupId);
                console.log("📦 Updated fetchedGroups:", updated);
                return updated;
            });

            if (mappedLeads.length > 0) {
                toast.success(`Loaded ${mappedLeads.length} leads`);
            } else {
                toast.info("No leads found in this group");
            }
        } catch (error) {
            console.error("❌ Failed to fetch group leads:", error);
            toast.error("Failed to load group leads");
        }
    }, [fetchedGroups]);

    const groups: GroupWithLeads[] = apiGroups.map((group: LeadGroup) => ({
        id: group.id,
        name: group.name,
        leadIds: (groupLeadsMap[group.id] || []).map((l) => l.id),
        _count: group._count,
    }));

    console.log("📦 Computed groups with leadIds:", groups);

    const leads: Lead[] = Object.values(groupLeadsMap).flat();
    console.log("📦 All leads:", leads);

    const addLeadToGroup = useCallback((groupId: string, leadId: string) => {
        let leadToAdd: Lead | undefined;

        for (const [gid, leadsArray] of Object.entries(groupLeadsMap)) {
            const found = leadsArray.find(l => l.id === leadId);
            if (found) {
                leadToAdd = found;
                break;
            }
        }

        if (!leadToAdd) {
            leadToAdd = {
                id: leadId,
                name: 'New Lead',
                email: '',
                phone: '',
                avatar: '/images/avatar-placeholder.png',
                service: '',
                vehicle: '',
                source: '',
                priority: 'MEDIUM',
                deposit: 0,
                depositStatus: 'NONE',
                stage: 'new',
                stageId: '',
                assignedToId: null,
                notes: [],
                date: new Date().toISOString().split('T')[0],
            };
        }

        setGroupLeadsMap(prev => ({
            ...prev,
            [groupId]: [...(prev[groupId] || []), leadToAdd!],
        }));
    }, [groupLeadsMap]);

    return {
        groups,
        leads,
        groupLeads: leads, // Alias for compatibility
        isLoading,
        refetch: refetchGroups,
        fetchGroupLeads,
        addLeadToGroup,
    };
}