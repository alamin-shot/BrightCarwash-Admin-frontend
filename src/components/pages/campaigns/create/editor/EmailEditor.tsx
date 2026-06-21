'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { EditorRef } from 'react-email-editor';

const EmailEditorComponent = dynamic(() => import('react-email-editor'), {
	ssr: false,
	loading: () => <div className='h-150 bg-gray-100 animate-pulse rounded-lg' />,
});

export function EmailEditor() {
	const emailEditorRef = useRef<EditorRef>(null);
	const [saving, setSaving] = useState(false);

	const handleSave = () => {
		if (emailEditorRef.current?.editor) {
			setSaving(true);
			emailEditorRef.current.editor.exportHtml((data: { html: string }) => {
				console.log('HTML:', data.html);
				setSaving(false);
			});
		}
	};

	return (
		<div className='flex flex-col gap-4 self-stretch'>
			<div className='flex justify-between items-center self-stretch'>
				<div className='flex items-center gap-3'>
					<Link
						href='/campaigns/create'
						className='flex items-center text-[#777980] hover:text-[#1B1B1B] transition-colors'
					>
						<ChevronLeft size={20} />
					</Link>
					<span className='text-[#1B1B1B] font-inter text-lg font-semibold'>
						Email Editor
					</span>
				</div>
				<Button
					onClick={handleSave}
					isLoading={saving}
					loadingText='Saving...'
					className='w-auto! px-6'
				>
					Save Template
				</Button>
			</div>
			<div className='rounded-xl border border-[#DFE1E7] overflow-hidden'>
				<EmailEditorComponent ref={emailEditorRef} minHeight='80vh' />
			</div>
		</div>
	);
}
