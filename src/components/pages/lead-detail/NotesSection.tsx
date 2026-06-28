"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Trash2 } from "lucide-react";
import type { Note } from "@/types/lead-detail";
import { addLeadNote } from "@/services/lead-detail.service";
import { toast } from "react-toastify";

interface Props {
	leadId: string;
	notes: Note[];
	onNoteAdded: () => void;
	onDeleteNote: (noteContent: string) => void; // ✅ Now passes content
}

export function NotesSection({ leadId, notes, onNoteAdded, onDeleteNote }: Props) {
	const [input, setInput] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

	async function handleAdd() {
		if (!input.trim()) return;
		setIsSubmitting(true);
		try {
			await addLeadNote(leadId, input.trim());
			setInput("");
			toast.success("Note added");
			onNoteAdded();
		} catch {
			toast.error("Failed to add note");
		} finally {
			setIsSubmitting(false);
		}
	}

	function openDeleteConfirm(noteContent: string) {
		setNoteToDelete(noteContent);
		setConfirmOpen(true);
	}

	function confirmDelete() {
		if (!noteToDelete) return;
		setDeletingId(noteToDelete);
		setConfirmOpen(false);
		onDeleteNote(noteToDelete); // ✅ Pass the content
		setDeletingId(null);
		setNoteToDelete(null);
	}

	return (
		<>
			<div className="flex p-6 flex-col items-start gap-4 self-stretch rounded-lg border border-[#DFE1E7] bg-[#F8FAFB]">
				<h3 className="text-[#1A1C21] font-inter text-lg font-semibold leading-[130%] self-stretch">
					Notes
				</h3>
				<div className="w-full h-px bg-[#DFE1E7]" />

				<div className="flex flex-col items-end gap-3 self-stretch p-3 rounded-lg border border-[#DFE1E7] bg-white">
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Write a note..."
						rows={3}
						className="w-full border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter resize-none"
					/>
					<Button
						onClick={handleAdd}
						isLoading={isSubmitting}
						loadingText="Adding..."
						className="px-4 py-2.5 rounded text-sm w-40!"
					>
						+ Add Notes
					</Button>
				</div>

				<div className="flex flex-col gap-3 self-stretch max-h-64 overflow-y-auto adm-notes-scroll">
					{notes.length === 0 && (
						<p className="text-sm text-[#777980] text-center py-4">No notes yet</p>
					)}
					{notes.map((note) => (
						<div
							key={note.id}
							className="flex py-3 px-4 items-center rounded-md border border-[#DFE1E7] bg-white gap-4"
						>
							<span className="flex-1 text-sm text-[#1B1B1B]">{note.content}</span>

							<button
								onClick={() => openDeleteConfirm(note.content)} // ✅ Pass content
								disabled={deletingId === note.content}
								className="text-[#FF4345] hover:text-[#B23730] transition-colors disabled:opacity-50"
							>
								<Trash2 size={16} />
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Confirmation Modal */}
			<Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Note" size="sm">
				<div className="flex flex-col gap-4">
					<p className="text-[#1B1B1B] text-sm">Are you sure you want to delete this note?</p>
					<div className="flex gap-3 justify-end pt-2">
						<Button variant="outline" onClick={() => setConfirmOpen(false)} className="px-6 w-auto!">
							Cancel
						</Button>
						<Button onClick={confirmDelete} className="px-6 w-auto! bg-[#FF4345] hover:bg-[#B23730]">
							Delete
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}