import { APP_CONFIG } from "@/configs/app.config";
import type { LeadDetail, ActivityItem, LeadDetailApiResponse } from "@/types/lead-detail";
import { mockLeadDetail, mockActivities } from "@/mocks/lead-detail.mock";
import { getAccessToken } from "@/lib/auth-client";

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

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
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		return { ...mockLeadDetail, id };
	}
	const json = await fetchFromBackend<{ success: boolean; data: LeadDetailApiResponse }>(`/admin/lead/${id}`);
	return mapApiToLeadDetail(json.data);
}

export async function getLeadActivities(id: string): Promise<ActivityItem[]> {
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		return [...mockActivities];
	}
	// TODO: Replace with real endpoint when available
	return [...mockActivities];
}

export async function addLeadNote(id: string, content: string): Promise<void> {
	mockActivities.unshift({
		id: `act_${Date.now()}`,
		type: "lead",
		title: "Note added",
		description: content,
		user: "You",
		date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
	});

	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		mockLeadDetail.notes.unshift({ id: `note_${Date.now()}`, content, author: "You", date: new Date().toDateString() });
		return;
	}

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
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		const noteIndex = mockLeadDetail.notes.findIndex(n => n.content === noteContent);
		if (noteIndex > -1) mockLeadDetail.notes.splice(noteIndex, 1);
		return;
	}

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

	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		mockLeadDetail.assignedToId = assignedToId;
		mockLeadDetail.assignedToName = assignedToId ? "Assigned User" : null;
		const now = new Date();
		const dateStr = now.toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
		mockActivities.unshift({
			id: `act_${Date.now()}`,
			type: "staff",
			title: assignedToId ? "Lead assigned" : "Lead unassigned",
			subtitle: assignedToId ? "to Assigned User" : undefined,
			user: "You",
			date: dateStr,
		});
		return;
	}

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
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		// Update mock data
		const mockLead = mockLeadDetail; // Assuming mockLeadDetail is imported
		if (data.name) mockLead.name = data.name;
		if (data.email) mockLead.email = data.email;
		if (data.phone) mockLead.phone = data.phone;
		if (data.service) mockLead.service = data.service;
		if (data.vehicle) mockLead.vehicle = data.vehicle;
		if (data.source) mockLead.source = data.source;
		if (data.priority) mockLead.priority = data.priority;
		if (data.deposit_status) mockLead.depositStatus = data.deposit_status;
		if (data.notes) mockLead.notes = data.notes.map((content) => ({
			id: `note_${Date.now()}_${Math.random()}`,
			content,
			author: "You",
			date: new Date().toISOString().split('T')[0],
		}));
		if (data.stage_name) {
			// You'd need to map stage_name to stage value/color, but for mock we can set stage to the name
			mockLead.stage = data.stage_name;
			mockLead.stageColor = '#0098E8'; // default
		}
		return { ...mockLead };
	}

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