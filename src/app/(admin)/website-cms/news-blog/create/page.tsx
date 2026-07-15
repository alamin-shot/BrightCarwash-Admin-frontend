"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { BlogEditor } from "@/components/pages/website-cms/news/BlogEditor";
import { useCreateNewsMutation } from "@/services/news.api";
import { useGetCategoriesQuery } from "@/services/category.api";
import { toast } from "react-toastify";

export default function CreateNewsPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPublished, setIsPublished] = useState(true);

    const { data: categories = [] } = useGetCategoriesQuery();
    const [createNews] = useCreateNewsMutation();

    const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.warning("Please enter a title");
            return;
        }
        if (!content.trim()) {
            toast.warning("Please enter content");
            return;
        }
        if (!categoryId) {
            toast.warning("Please select a category");
            return;
        }
        if (!file) {
            toast.warning("Please select a cover image");
            return;
        }

        setIsSubmitting(true);
        try {
            await createNews({
                title: title.trim(),
                content: content.trim(),
                summary: content.trim().slice(0, 150),
                image: file,
                category_id: categoryId,
                is_published: isPublished,
            }).unwrap();
            toast.success("Post created successfully");
            router.push("/website-cms/news-blog");
        } catch {
            toast.error("Failed to create post");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && droppedFile.type.startsWith("image/")) {
            setFile(droppedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(droppedFile);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
                <Link href="/website-cms/news-blog" className="text-[#1B1B1B] font-inter leading-5 tracking-tight hover:text-[#0098E8] transition-colors">
                    News & Blog
                </Link>
                <ChevronRight size={16} className="text-[#777980] rotate-90" />
                <span className="text-[#777980] font-inter leading-5 tracking-tight">Add New Post</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Icon name="edit" width={24} height={24} color="#1B1B1B" />
                        <h1 className="text-[#1B1B1B] font-inter text-2xl font-bold leading-8 tracking-tight">New Blog Post</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsPublished(false);
                                handleSubmit(new Event("submit") as any);
                            }}
                            className="py-2.5 px-4 text-[#777980]"
                        >
                            Save as a draft
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            loadingText="Publishing..."
                            className="py-2.5 px-4"
                        >
                            Publish
                        </Button>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="p-6 bg-[#F8FAFB] rounded-lg border border-[#DFE1E7] flex flex-col gap-4">
                    {/* Cover Image */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#777980] font-inter text-base font-normal leading-5">Cover Image</label>
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${preview
                                    ? "border-[#0098E8] bg-[#F0F8FF]"
                                    : "border-[#DFE1E7] bg-white hover:border-[#0098E8] hover:bg-[#F0F8FF]"
                                }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => document.getElementById("coverImage")?.click()}
                        >
                            {preview ? (
                                <div className="relative">
                                    <img src={preview} alt="Preview" className="max-h-[160px] mx-auto rounded-lg object-contain" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setPreview(null);
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-[#FFE6E6] transition-colors"
                                    >
                                        <Icon name="close" width={16} height={16} color="#FF4345" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Icon name="upload" width={32} height={32} color="#777980" />
                                    <p className="text-[#1B1B1B] font-inter text-base font-medium leading-4">Drag & drop or click to upload</p>
                                    <p className="text-[#A5A5AB] font-inter text-sm leading-5">16:9 recommended · PNG, JPG, WebP</p>
                                </div>
                            )}
                            <input id="coverImage" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </div>
                    </div>

                    {/* Title & Category */}
                    <div className="flex gap-4">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-[#777980] font-inter text-base font-normal leading-5">Post Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter post title…"
                                className="w-full px-4 py-3 bg-white rounded-lg border border-[#DFE1E7] text-[#1B1B1B] placeholder-[#777980] font-inter text-base outline-none focus:border-[#0098E8] transition-all"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-[#777980] font-inter text-base font-normal leading-5">Category</label>
                            <FilterDropdown
                                label="Select category"
                                options={categoryOptions}
                                value={categoryId}
                                onChange={setCategoryId}
                                fullWidth
                                scrollable
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#777980] font-inter text-base font-normal leading-5">Content</label>
                        <BlogEditor value={content} onChange={setContent} placeholder="Write your post content here…" />
                    </div>
                </div>
            </form>
        </div>
    );
}