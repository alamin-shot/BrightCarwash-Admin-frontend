"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";
import { getAccessToken } from "@/lib/auth-client";
import { APP_CONFIG } from "@/configs/app.config";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLeads: string[];
    onGroupCreated?: (group: any) => void;
}

export function CreateGroupModal({ isOpen, onClose, selectedLeads, onGroupCreated }: CreateGroupModalProps) {
    const [groupName, setGroupName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async () => {
        if (!groupName.trim()) {
            toast.warning("Enter a group name");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = getAccessToken();
            const response = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/lead-groups`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: groupName.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create group");
            }

            // ✅ Close modal immediately with group data
            setGroupName("");
            onGroupCreated?.(data.data);

            // ✅ Don't close modal here - parent will close it via onGroupModalClose

        } catch (error: any) {
            toast.error(error.message || "Failed to create group");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => { }} title="New Group" size="sm">
            <div className="flex flex-col gap-3">
                <div className="w-full h-px bg-[#DFE1E7]" />
                <div>
                    <label className="block text-[#777980] font-inter text-base font-normal leading-[130%] mb-1.5">Group Name</label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        className="w-full px-4 py-3 border border-[#DFE1E7] rounded-lg bg-white text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8]"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                    />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="px-6 w-auto!"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        isLoading={isSubmitting}
                        loadingText="Creating..."
                        className="px-6 w-auto!"
                    >
                        Create
                    </Button>
                </div>
            </div>
        </Modal>
    );
}