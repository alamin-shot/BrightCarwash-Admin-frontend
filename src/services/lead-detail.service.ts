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

export async function assignLeadToMember(leadId: string, assignedToId: string | null): Promise<void> {
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		mockLeadDetail.assignedToId = assignedToId;
		mockLeadDetail.assignedToName = assignedToId ? "Assigned User" : null;
		const now = new Date();
		const dateStr = now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
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
	const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead/${leadId}/assign`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			assigned_to_id: assignedToId,
			assignment_source: "Admin Panel",
		}),
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({ message: "Assignment failed" }));
		throw new Error(error.message || "Failed to assign lead");
	}
}