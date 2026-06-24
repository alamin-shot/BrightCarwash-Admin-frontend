import { APP_CONFIG } from "@/configs/app.config";
import type {
	LeadDetail,
	ActivityItem,
	LeadDetailApiResponse,
} from "@/types/lead-detail";
import { mockLeadDetail, mockActivities } from "@/mocks/lead-detail.mock";
import { getAccessToken } from "@/lib/auth-client";

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchFromBackend<T>(
	url: string,
	options?: RequestInit,
): Promise<T> {
	const token = getAccessToken();
	const res = await fetch(`${APP_CONFIG.API_BASE_URL}${url}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			...(options?.body instanceof FormData
				? {}
				: { "Content-Type": "application/json" }),
			...options?.headers,
		},
	});
	if (!res.ok) throw new Error(`Request failed: ${res.status}`);
	return res.json();
}

function mapApiToLeadDetail(data: LeadDetailApiResponse): LeadDetail {
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
		assignedToId: data.assigned_to?.id || null,
		assignedToName: data.assigned_to
			? `${data.assigned_to.first_name} ${data.assigned_to.last_name}`
			: null,
		avatar: "/images/avatar-placeholder.png",
		notes: (data.notes || []).map((n, i) => {
			if (typeof n === "string") {
				return {
					id: `note_${Date.now()}_${i}`,
					content: n,
					author: "Unknown",
					date: new Date().toISOString().split("T")[0],
				};
			}
			return {
				id: n.id || `note_${Date.now()}_${i}`,
				content: n.content || "",
				author: n.author
					? `${n.author.first_name || ""} ${n.author.last_name || ""}`.trim() ||
					"Unknown"
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
	const json = await fetchFromBackend<{
		success: boolean;
		data: LeadDetailApiResponse;
	}>(`/admin/lead/${id}`);
	return mapApiToLeadDetail(json.data);
}

export async function getLeadActivities(id: string): Promise<ActivityItem[]> {
	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		return [...mockActivities];
	}
	return [...mockActivities];
}

export async function addLeadNote(id: string, content: string): Promise<void> {
	// Add to mock activities (works for both mock and real mode)
	mockActivities.push({
		id: `act_${Date.now()}`,
		type: "lead",
		title: "Note added",
		description: content,
		user: "You",
		date: new Date().toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}),
	});

	if (APP_CONFIG.MOCK_MODE) {
		await delay(APP_CONFIG.MOCK_DELAY_MS);
		mockLeadDetail.notes.push({
			id: `note_${Date.now()}`,
			content,
			author: "You",
			date: new Date().toDateString(),
		});
		return;
	}

	// REAL MODE: fetch current notes, append the new one, send full array
	const currentLead = await getLeadDetail(id);
	const currentNotes = currentLead.notes.map((n) => n.content); // array of strings
	currentNotes.push(content);

	const token = getAccessToken();
	const formData = new FormData();
	// Send all notes as repeated fields (FormData supports multiple values for the same key)
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