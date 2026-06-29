"use client";

import { useState, useEffect } from "react";
import { X, Mail, Phone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import type { LeadDetail } from "@/types/lead-detail";
import type { StageOption } from "@/components/ui/StageDropdown";
import { toast } from "react-toastify";

interface EditLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: LeadDetail | null;
    stages: StageOption[];
    onSave: (data: any) => Promise<void>;
}

const priorityOptions = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
];

const depositOptions = [
    { value: "PAID", label: "Paid" },
    { value: "PENDING", label: "Pending" },
    { value: "REFUNDED", label: "Refunded" },
    { value: "FAILED", label: "Failed" },
    { value: "NONE", label: "None" },
];

export function EditLeadModal({ isOpen, onClose, lead, stages, onSave }: EditLeadModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        vehicle: "",
        source: "",
        priority: "MEDIUM",
        deposit_status: "NONE",
        stage_name: "",
        notes: [] as string[],
    });
    const [noteInput, setNoteInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill form when lead changes
    useEffect(() => {
        if (lead) {
            setFormData({
                name: lead.name || "",
                email: lead.email || "",
                phone: lead.phone || "",
                service: lead.service || "",
                vehicle: lead.vehicle || "",
                source: lead.source || "",
                priority: lead.priority || "MEDIUM",
                deposit_status: lead.depositStatus || "NONE",
                stage_name: lead.stage || "",
                notes: lead.notes.map((n) => n.content) || [],
            });
        }
    }, [lead]);

    const handleChange = (key: keyof typeof formData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const addNote = () => {
        if (noteInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                notes: [...prev.notes, noteInput.trim()],
            }));
            setNoteInput("");
        }
    };

    const removeNote = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            notes: prev.notes.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
            toast.success("Lead updated successfully");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to update lead");
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalTitle = (
        <div className="flex flex-col gap-1">
            <span className="text-[#1D1F2C] font-inter text-2xl font-medium leading-[100%]">
                Edit Lead
            </span>
            <span className="text-[#777980] font-inter text-sm font-normal leading-[132%]">
                Update lead details and information.
            </span>
        </div>
    );

    if (!lead) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="lg"
            bodyClassName="py-3!"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="w-full h-px bg-[#DFE1E7]" />

                <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-[#777980] font-inter text-sm font-medium mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="w-full px-4 py-2.5 border border-[#DFE1E7] rounded-lg bg-white text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-2 focus:ring-[#0098E8]/10 transition-all"
                            placeholder="Full name"
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="block text-[#777980] font-inter text-sm font-medium mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-2.5 text-[#777980]" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 border border-[#DFE1E7] rounded-lg bg-white text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-2 focus:ring-[#0098E8]/10 transition-all"
                                placeholder="Email address"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                        <label className="block text-[#777980] font-inter text-sm font-medium mb-1">
                            Phone
                        </label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-2.5 text-[#777980]" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 border border-[#DFE1E7] rounded-lg bg-white text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-2 focus:ring-[#0098E8]/10 transition-all"
                                placeholder="Phone number"
                            />
                        </div>
                    </div>
                    {/* Service */}
                    <div>
                        <label className="block text-[#777980] font-inter text-sm font-medium mb-1">
                            Service
                        </label>
                        <input
                            type="text"
                            value={formData.service}
                            onChange={(e) => handleChange("service", e.target.value)}
                            className="w-full px-4 py-2.5 border border-[#DFE1E7] rounded-lg bg-white text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-2 focus:ring-[#0098E8]/10 transition-all"
                            placeholder="Service"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Vehicle */}
                    <div>
                        <label className="block text-[#777980] font-inter text-sm font-medium mb-1">
                            Vehicle
                        </label>
                        <input
                            type="text"
                            value={formData.vehicle}
                            onChange={(e) => handleChange("vehicle", e.target.value)}
                            className="w-full px-4 py-2.5 border border-[#DFE1E7] rounded-lg bg-white text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-2 focus:ring-[#0098E8]/10 transition-all"
                            placeholder="Vehicle"
                        />
                    </div>
                    {/* Source */}
                    <div>
                        <label className="block text-[#777980] font-inter text-sm font-medium mb-1">
                            Source
                        </label>
                        <input
                            type="text"
                            value={formData.source}
                            onChange={(e) => handleChange("source", e.target.value)}
                            className="w-full px-4 py-2.5 border border-[#DFE1E7] rounded-lg bg-white text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-2 focus:ring-[#0098E8]/10 transition-all"
                            placeholder="Source"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {/* Priority */}
                    <div>
                        <label className="block text-[#777980] font-inter text-sm font-medium mb-1">
                            Priority
                        </label>
                        <FilterDropdown
                            label="Priority"
                            options={priorityOptions}
                            value={formData.priority}
                            onChange={(val) => handleChange("priority", val)}
                            fullWidth
                        />
                    </div>
                    {/* Deposit Status */}
                    <div>
                        <label className="block text-[#777980] font-inter text-sm font-medium mb-1">
                            Deposit Status
                        </label>
                        <FilterDropdown
                            label="Deposit Status"
                            options={depositOptions}
                            value={formData.deposit_status}
                            onChange={(val) => handleChange("deposit_status", val)}
                            fullWidth
                        />
                    </div>
                    {/* Stage */}
                    <div>
                        <label className="block text-[#777980] font-inter text-sm font-medium mb-1">
                            Stage
                        </label>
                        <FilterDropdown
                            label="Select stage"
                            options={stages.map((s) => ({ value: s.label, label: s.label }))}
                            value={formData.stage_name}
                            onChange={(val) => handleChange("stage_name", val)}
                            fullWidth
                        />
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-[#777980] font-inter text-sm font-medium mb-1">
                        Notes
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="Add a note..."
                            className="flex-1 px-4 py-2.5 border border-[#DFE1E7] rounded-lg bg-white text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8] focus:ring-2 focus:ring-[#0098E8]/10 transition-all"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addNote();
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addNote}
                            className="px-4 py-2.5"
                        >
                            Add
                        </Button>
                    </div>
                    {formData.notes.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 border border-[#DFE1E7] rounded-lg bg-[#F8FAFB]">
                            {formData.notes.map((note, index) => (
                                <span
                                    key={index}
                                    className="inline-flex py-1.5 px-3 justify-center items-center gap-2 rounded bg-white text-[#1B1B1B] font-inter text-sm border border-[#E8E8E9]"
                                >
                                    {note}
                                    <button
                                        type="button"
                                        onClick={() => removeNote(index)}
                                        className="text-[#777980] hover:text-[#FF4345] transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-[#E8E8E9]">
                    <Button type="button" variant="outline" onClick={onClose} className="px-6 w-auto!">
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting} loadingText="Saving..." className="px-6 w-auto!">
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}