"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ChevronLeft, Bold, Italic, Underline, Heading1, Heading2, Heading3,
	List, ListOrdered, Quote, Code, Strikethrough,
} from "lucide-react";
import { Button as UIButton } from "@/components/ui/Button";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import { toast } from "react-toastify";
import { useCreateTemplateMutation } from "@/services/template.api";

const ToolbarButton = ({
	active, onClick, children,
}: { active?: boolean; onClick: () => void; children: React.ReactNode }) => (
	<button type="button" onClick={onClick}
		className={`p-2 rounded-lg transition-colors ${active ? "bg-[#0098E8] text-white" : "text-[#1B1B1B] hover:bg-[#F1F1F1]"}`}>
		{children}
	</button>
);

export function SimpleEditor() {
	const [saving, setSaving] = useState(false);
	const router = useRouter();
	const [createTemplate] = useCreateTemplateMutation();

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } }), UnderlineExtension],
		content: "<p>Start writing your email content here...</p>",
		editorProps: {
			attributes: {
				class: "prose prose-sm max-w-none focus:outline-none min-h-[60vh] p-4 text-[#1B1B1B] [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
			},
		},
	});

	const handleSave = async () => {
		if (!editor) return;

		setSaving(true);
		const html = editor.getHTML();
		const name = `Simple Template ${new Date().toLocaleDateString()}`;

		try {
			// ✅ Fix: Use PLAIN_TEXT instead of SIMPLE_EDITOR
			await createTemplate({
				name: name,
				description: `Created on ${new Date().toLocaleDateString()}`,
				type: "EMAIL",
				editorType: "PLAIN_TEXT", // ✅ Changed from SIMPLE_EDITOR to PLAIN_TEXT
				emailBody: {
					subject: name,
					htmlContent: html || "",
					designJson: {},
				},
			}).unwrap();

			toast.success("Template saved! Design step complete.");
			router.push("/campaigns/create?step=2");
		} catch (error) {
			toast.error("Failed to save template");
			console.error(error);
		} finally {
			setSaving(false);
		}
	};

	if (!editor) return null;

	return (
		<div className="flex flex-col gap-4 self-stretch">
			<div className="flex justify-between items-center self-stretch">
				<div className="flex items-center gap-3">
					<Link href={`/campaigns/create?step=3`} className="flex items-center text-[#777980] hover:text-[#1B1B1B] transition-colors">
						<ChevronLeft size={20} />
					</Link>
					<span className="text-[#1B1B1B] font-inter text-lg font-semibold">Easy Peasy Editor</span>
				</div>
				<UIButton onClick={handleSave} isLoading={saving} loadingText="Saving..." className="w-auto! px-6">
					Save and create
				</UIButton>
			</div>
			<div className="rounded-xl border border-[#DFE1E7] overflow-hidden bg-white">
				<div className="flex flex-wrap items-center gap-1 p-3 border-b border-[#DFE1E7] bg-[#F8FAFB]">
					<ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={18} /></ToolbarButton>
					<ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={18} /></ToolbarButton>
					<ToolbarButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline size={18} /></ToolbarButton>
					<ToolbarButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={18} /></ToolbarButton>
					<span className="w-px h-6 bg-[#DFE1E7] mx-1" />
					<ToolbarButton active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={18} /></ToolbarButton>
					<ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={18} /></ToolbarButton>
					<ToolbarButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={18} /></ToolbarButton>
					<span className="w-px h-6 bg-[#DFE1E7] mx-1" />
					<ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={18} /></ToolbarButton>
					<ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={18} /></ToolbarButton>
					<ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={18} /></ToolbarButton>
					<ToolbarButton active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}><Code size={18} /></ToolbarButton>
				</div>
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}