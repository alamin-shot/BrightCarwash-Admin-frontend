'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Note } from '@/types/lead-detail';
import { addLeadNote } from '@/services/lead-detail.service';
import { toast } from 'react-toastify';

interface Props {
	leadId: string;
	notes: Note[];
}

export function NotesSection({ leadId, notes }: Props) {
	const [input, setInput] = useState('');
	const [localNotes, setLocalNotes] = useState<Note[]>(notes);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleAdd() {
		if (!input.trim()) return;
		setIsSubmitting(true);
		try {
			await addLeadNote(leadId, input.trim());
			setLocalNotes((prev) => [
				...prev,
				{
					id: `note_${Date.now()}`,
					content: input.trim(),
					author: 'You',
					date: new Date().toLocaleDateString(),
				},
			]);
			setInput('');
			toast.success('Note added');
		} catch {
			toast.error('Failed to add note');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className='flex p-6 flex-col items-start gap-4 self-stretch rounded-lg border border-[#DFE1E7] bg-[#F8FAFB]'>
			<h3 className='text-[#1A1C21] font-inter text-lg font-semibold leading-[130%] self-stretch'>
				Notes
			</h3>
			<div className='w-full h-px bg-[#DFE1E7]' />
			<div className='flex flex-col items-end gap-3 self-stretch p-3 rounded-lg border border-[#DFE1E7] bg-white'>
				<textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Write a note...'
					rows={3}
					className='w-full border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter resize-none'
				/>
				<Button
					onClick={handleAdd}
					isLoading={isSubmitting}
					loadingText='Adding...'
					className='px-4 py-2.5 rounded text-sm'
				>
					+ Add Notes
				</Button>
			</div>
			{localNotes.map((note) => (
				<div
					key={note.id}
					className='flex py-3 px-4 items-center self-stretch rounded-md border border-[#DFE1E7] bg-white gap-4'
				>
					<span className='flex-1 text-sm text-[#1B1B1B]'>{note.content}</span>
					<span className='text-xs text-[#777980] whitespace-nowrap'>
						{note.author} • {note.date}
					</span>
				</div>
			))}
		</div>
	);
}
