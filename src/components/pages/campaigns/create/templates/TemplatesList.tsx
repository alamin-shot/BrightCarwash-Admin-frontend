"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { TemplateCard } from "@/components/pages/campaigns/create/templates/TemplateCard";
import { useGetTemplatesQuery } from "@/services/template.api";
import type { Template, TemplateType, EditorType } from "@/types/template";

const TYPE_OPTIONS = ["All", "EMAIL", "SMS", "PUSH"];
const EDITOR_OPTIONS = ["All", "VISUAL_DRAG_DROP", "SIMPLE_EDITOR", "CODE_EDITOR"];

interface TemplatesListProps {
    onTemplateSelect?: (template: Template) => void;
    selectedTemplateId?: string | null;
}

export function TemplatesList({ onTemplateSelect, selectedTemplateId }: TemplatesListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<TemplateType | "All">("All");
    const [editorFilter, setEditorFilter] = useState<EditorType | "All">("All");
    const [showArchived, setShowArchived] = useState(false);

    const { data: templates = [], isLoading, error } = useGetTemplatesQuery({
        isArchived: showArchived,
        page: 1,
        limit: 100,
    });

    // Filter templates
    const filteredTemplates = templates.filter((template) => {
        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const match =
                template.name.toLowerCase().includes(q) ||
                (template.description?.toLowerCase().includes(q) ?? false);
            if (!match) return false;
        }

        // Type
        if (typeFilter !== "All" && template.type !== typeFilter) return false;

        // Editor
        if (editorFilter !== "All" && template.editorType !== editorFilter) return false;

        return true;
    });

    const handleUseTemplate = (template: Template) => {
        if (onTemplateSelect) {
            onTemplateSelect(template);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-[340px] bg-gray-100 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12 text-[#FF4345] font-inter">
                Failed to load templates.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                    <div className="flex px-4 py-2.5 items-center gap-3 rounded-lg border border-[#E8E8E9] bg-white">
                        <Search size={18} className="text-[#777980] shrink-0" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent"
                        />
                    </div>
                </div>

                <FilterDropdown
                    label="Type"
                    options={TYPE_OPTIONS.map((t) => ({ value: t, label: t }))}
                    value={typeFilter}
                    onChange={(val: string) => setTypeFilter(val as TemplateType | "All")}
                />

                <FilterDropdown
                    label="Editor"
                    options={EDITOR_OPTIONS.map((e) => ({
                        value: e,
                        label: e.replace("_", " "),
                    }))}
                    value={editorFilter}
                    onChange={(val: string) => setEditorFilter(val as EditorType | "All")}
                />

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showArchived}
                        onChange={(e) => setShowArchived(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#0098E8]"
                    />
                    <span className="text-[#777980] font-inter text-sm">Show Archived</span>
                </label>
            </div>

            {/* Templates Grid - Uses your existing TemplateCard */}
            {filteredTemplates.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-[#777980] font-inter text-sm">
                    No templates found. Create your first template!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onUse={handleUseTemplate}
                            isSelected={template.id === selectedTemplateId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}