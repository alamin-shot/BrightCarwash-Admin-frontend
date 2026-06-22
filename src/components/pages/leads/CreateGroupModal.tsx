"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLeads: string[];
}

export function CreateGroupModal({ isOpen, onClose, selectedLeads }: CreateGroupModalProps) {
    const [groupName, setGroupName] = useState("");

    const handleCreate = () => {
        if (!groupName.trim()) { toast.warning("Enter a group name"); return; }
        const groups = JSON.parse(localStorage.getItem("leadGroups") || "[]");
        groups.push({
            id: `grp_${Date.now()}`,
            name: groupName.trim(),
            leadIds: selectedLeads,
            createdAt: new Date().toISOString(),
        });
        localStorage.setItem("leadGroups", JSON.stringify(groups));
        toast.success(`Group "${groupName}" created with ${selectedLeads.length} leads`);
        setGroupName("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Group" size="sm">
            <div className="flex flex-col gap-3">

                <div>
                    <label className="block text-[#777980] font-inter text-base font-normal leading-[130%] mb-1.5">Group Name</label>
                    <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Enter group name"
                        className="w-full px-4 py-3 border border-[#DFE1E7] rounded-lg bg-white text-[#1B1B1B] placeholder-[#777980] font-inter text-sm outline-none focus:border-[#0098E8]" />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="px-6 w-auto!">Cancel</Button>
                    <Button onClick={handleCreate} className="px-6 w-auto!">Create</Button>
                </div>
            </div>
        </Modal>
    );
}