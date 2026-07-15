import { APP_CONFIG } from "@/configs/app.config";
import type { LeadDetail, ActivityItem, LeadDetailApiResponse } from "@/types/lead-detail";
import { getAccessToken } from "@/lib/auth-client";

async function fetchFromBackend<T>(url: string, options?: RequestInit): Promise<T> {
	const token = getAccessToken();
	const res = await fetch(`${APP_CONFIG.API_BASE_URL}${url}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			...(options?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
			...options?.headers,
		},
	});
	if (!res.ok) throw new Error(`Request failed: ${res.status}`);
	return res.json();
}

function mapApiToLeadDetail(data: LeadDetailApiResponse): LeadDetail {
	const assignee = data.assigned_to || (data as any).assignee || null;

	// ✅ Map activity timelines from API
	const activityItems: ActivityItem[] = (data.activity_timelines || []).map((item: any) => {
		// Determine activity type based on description
		let type: ActivityItem['type'] = 'lead';
		const desc = item.description?.toLowerCase() || '';

		if (desc.includes('stage')) {
			type = 'stage';
		} else if (desc.includes('assigned') || desc.includes('unassigned')) {
			type = 'staff';
		}

		const userName = item.user
			? `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || 'Unknown'
			: 'System';

		return {
			id: item.id,
			type: type,
			title: item.description || 'Activity',
			subtitle: item.user ? `by ${userName}` : undefined,
			description: undefined,
			user: userName,
			date: new Date(item.created_at).toLocaleDateString('en-US', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			}),
		};
	});

	// ✅ Map assignment history from API
	const assignmentItems: ActivityItem[] = (data.assignment_history || []).map((item: any) => {
		const assigneeName = item.assignee
			? `${item.assignee.first_name || ''} ${item.assignee.last_name || ''}`.trim() || 'Unknown'
			: null;
		const assignerName = item.assigner
			? `${item.assigner.first_name || ''} ${item.assigner.last_name || ''}`.trim() || 'Unknown'
			: 'System';

		return {
			id: item.id,
			type: 'staff',
			title: item.assigned_to_id ? 'Lead assigned' : 'Lead unassigned',
			subtitle: item.assigned_to_id ? `to ${assigneeName}` : undefined,
			description: undefined,
			user: assignerName,
			date: new Date().toLocaleDateString('en-US', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			}),
		};
	});

	// ✅ Combine and sort all activities by date (newest first)
	const allActivities = [...activityItems, ...assignmentItems];
	allActivities.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return {
		id: data.id,
		name: data.name,
		email: data.email,
		phone: data.phone,
		service: data.service,
		vehicle: data.vehicle,
		source: data.source,
		priority: data.priority,
		depositStatus: data.deposit_status,
		stage: data.stage?.name || "New",
		stageId: data.stage_id,
		stageColor: data.stage?.color || "#0098E8",
		assignedToId: assignee?.id || null,
		assignedToName: assignee
			? `${assignee.first_name || ''} ${assignee.last_name || ''}`.trim() || null
			: null,
		avatar: "/images/avatar-placeholder.png",
		notes: (data.notes || []).map((n, i) => {
			if (typeof n === "string") {
				return { id: `note_${Date.now()}_${i}`, content: n, author: "Unknown", date: new Date().toISOString().split("T")[0] };
			}
			return {
				id: n.id || `note_${Date.now()}_${i}`,
				content: n.content || "",
				author: n.author
					? `${n.author.first_name || ""} ${n.author.last_name || ""}`.trim() || "Unknown"
					: "Unknown",
				date: n.created_at?.split("T")[0] || "",
			};
		}),
		date: data.created_at?.split("T")[0] || "",
		activities: allActivities, // ✅ Add mapped activities to LeadDetail
	};
}

export async function getLeadDetail(id: string): Promise<LeadDetail> {
	const json = await fetchFromBackend<{ success: boolean; data: LeadDetailApiResponse }>(`/admin/lead/${id}`);
	return mapApiToLeadDetail(json.data);
}

export async function getLeadActivities(id: string): Promise<ActivityItem[]> {
	try {
		// ✅ Fetch lead detail to get activities
		const lead = await getLeadDetail(id);
		return lead.activities || [];
	} catch (error) {
		console.warn('Failed to fetch activities, returning empty array:', error);
		return [];
	}
}

export async function addLeadNote(id: string, content: string): Promise<void> {
	const currentLead = await getLeadDetail(id);
	const currentNotes = currentLead.notes.map((n) => n.content);
	currentNotes.push(content);

	const token = getAccessToken();
	const formData = new FormData();
	currentNotes.forEach((note) => formData.append("notes", note));

	const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead/${id}`, {
		method: "PATCH",
		headers: { Authorization: `Bearer ${token}` },
		body: formData,
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({ message: "Update failed" }));
		throw new Error(error.message || "Failed to add note");
	}
}

export async function deleteLeadNote(leadId: string, noteContent: string): Promise<void> {
	const lead = await getLeadDetail(leadId);

	const notesContent = lead.notes
		.filter(n => n.content !== noteContent)
		.map(n => n.content);

	const token = getAccessToken();
	const formData = new FormData();
	notesContent.forEach((note) => formData.append("notes", note));

	const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead/${leadId}`, {
		method: "PATCH",
		headers: { Authorization: `Bearer ${token}` },
		body: formData,
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({ message: "Failed to delete note" }));
		throw new Error(error.message || "Failed to delete note");
	}
}

export async function assignLeadToMember(
	leadId: string,
	assignedToId: string | null
): Promise<void> {
	const token = getAccessToken();

	if (assignedToId === null) {
		const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead/${leadId}/unassign`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!res.ok) {
			const error = await res.json().catch(() => ({ message: "Unassignment failed" }));
			throw new Error(error.message || "Failed to unassign lead");
		}
		return;
	}

	const payload = {
		assigned_to_id: assignedToId,
		assignment_source: "Admin Panel",
	};

	const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead/${leadId}/assign`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({ message: "Assignment failed" }));
		throw new Error(error.message || "Failed to assign lead");
	}
}

export async function updateLeadDetails(
	leadId: string,
	data: {
		name?: string;
		email?: string;
		phone?: string;
		service?: string;
		vehicle?: string;
		source?: string;
		priority?: string;
		deposit_status?: string;
		notes?: string[];
		stage_name?: string;
	}
): Promise<LeadDetail> {
	const token = getAccessToken();
	const formData = new FormData();
	if (data.name) formData.append('name', data.name);
	if (data.email) formData.append('email', data.email);
	if (data.phone) formData.append('phone', data.phone);
	if (data.service) formData.append('service', data.service);
	if (data.vehicle) formData.append('vehicle', data.vehicle);
	if (data.source) formData.append('source', data.source);
	if (data.priority) formData.append('priority', data.priority);
	if (data.deposit_status) formData.append('deposit_status', data.deposit_status);
	if (data.notes && data.notes.length) {
		data.notes.forEach((note) => formData.append('notes', note));
	}
	if (data.stage_name) formData.append('stage_name', data.stage_name);

	const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead/${leadId}`, {
		method: 'PATCH',
		headers: { Authorization: `Bearer ${token}` },
		body: formData,
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({ message: 'Update failed' }));
		throw new Error(error.message || 'Failed to update lead');
	}

	const updated = await getLeadDetail(leadId);
	return updated;
}