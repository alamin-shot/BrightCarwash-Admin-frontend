'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { EditorRef } from 'react-email-editor';
import { toast } from 'react-toastify';
import {
	useCreateTemplateMutation,
	useUploadTemplateImageMutation,
} from '@/services/template.api';
import { uploadImagesInHtml } from '@/lib/image-upload';

const EmailEditorComponent = dynamic(() => import('react-email-editor'), {
	ssr: false,
	loading: () => <div className='h-150 bg-gray-100 animate-pulse rounded-lg' />,
});

export function EmailEditor() {
	const emailEditorRef = useRef<EditorRef>(null);
	const [saving, setSaving] = useState(false);
	const [templateName, setTemplateName] = useState('');
	const router = useRouter();
	const [createTemplate] = useCreateTemplateMutation();
	const [uploadImage] = useUploadTemplateImageMutation();

	const handleSave = () => {
		const name =
			templateName.trim() || `Template ${new Date().toLocaleDateString()}`;
		if (emailEditorRef.current?.editor) {
			setSaving(true);
			emailEditorRef.current.editor.exportHtml(async (data) => {
				try {
					const htmlContent = data.html || '<p>Empty template</p>';

					// Upload any embedded images and replace with hosted URLs
					const processedHtml = await uploadImagesInHtml(
						htmlContent,
						async (file) => {
							const result = await uploadImage(file).unwrap();
							return result; // { url: string }
						}
					);

					await createTemplate({
						name: name,
						description: `Created on ${new Date().toLocaleDateString()}`,
						type: 'EMAIL',
						editorType: 'VISUAL_DRAG_DROP',
						emailBody: {
							subject: name,
							htmlContent: processedHtml,
							designJson: { design: data.design || {} },
						},
					}).unwrap();

					toast.success(`Template "${name}" saved!`);
					router.push('/campaigns/create?step=3');
				} catch (error) {
					toast.error('Failed to save template');
					console.error(error);
				} finally {
					setSaving(false);
				}
			});
		}
	};

	return (
		<div className='flex flex-col gap-4 self-stretch'>
			<div className='flex justify-between items-center self-stretch'>
				<div className='flex items-center gap-3'>
					<Link
						href={`/campaigns/create?step=3`}
						className='flex items-center text-[#777980] hover:text-[#1B1B1B] transition-colors'
					>
						<ChevronLeft size={20} />
					</Link>
					<span className='text-[#1B1B1B] font-inter text-lg font-semibold'>
						Email Editor
					</span>
				</div>
				<div className='flex items-center gap-3'>
					<input
						type='text'
						value={templateName}
						onChange={(e) => setTemplateName(e.target.value)}
						placeholder='Template name'
						className='px-3 py-2 border border-[#DFE1E7] rounded-lg text-sm font-inter outline-none focus:border-[#0098E8]'
					/>
					<Button
						onClick={handleSave}
						isLoading={saving}
						loadingText='Saving...'
						className='w-auto! px-6'
					>
						Save Template
					</Button>
				</div>
			</div>
			<div className='rounded-xl border border-[#DFE1E7] overflow-hidden'>
				<EmailEditorComponent ref={emailEditorRef} minHeight='80vh' />
			</div>
		</div>
	);
}