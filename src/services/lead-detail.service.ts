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
	};
}

export async function getLeadDetail(id: string): Promise<LeadDetail> {
	const json = await fetchFromBackend<{ success: boolean; data: LeadDetailApiResponse }>(`/admin/lead/${id}`);
	return mapApiToLeadDetail(json.data);
}

// ✅ Activities: Call real endpoint if available, otherwise return empty array
export async function getLeadActivities(id: string): Promise<ActivityItem[]> {
	try {
		// If you have a real endpoint for activities, uncomment and use it:
		// const json = await fetchFromBackend<{ success: boolean; data: ActivityItem[] }>(`/admin/lead/${id}/activities`);
		// return json.data || [];

		// For now, return empty array since we don't have an activities endpoint
		return [];
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
	// 1. Fetch current lead to get all notes
	const lead = await getLeadDetail(leadId);

	// 2. Filter out the note by content (not by id)
	const notesContent = lead.notes
		.filter(n => n.content !== noteContent)
		.map(n => n.content);

	// 3. Send the updated array to the backend
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

	// After update, refetch the lead details
	const updated = await getLeadDetail(leadId);
	return updated;
}