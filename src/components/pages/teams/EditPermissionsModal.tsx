"use client";

import { useState, useMemo, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Permission, TeamRole } from "@/types/team";
import { toast } from "react-toastify";

interface EditPermissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: TeamRole | null;
    allPermissions: Permission[];
    selectedPermissions: string[];
    onSave: (roleId: string, permissions: string[]) => void;
}

export function EditPermissionsModal({ isOpen, onClose, role, allPermissions, selectedPermissions, onSave }: EditPermissionsModalProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set(selectedPermissions));

    useEffect(() => {
        setSelected(new Set(selectedPermissions));
    }, [selectedPermissions]);

    const grouped = useMemo(() => {
        const map: Record<string, Permission[]> = {};
        for (const p of allPermissions) {
            if (!map[p.module]) map[p.module] = [];
            map[p.module].push(p);
        }
        return map;
    }, [allPermissions]);

    const allIds = allPermissions.map((p) => p.id);
    const isAllSelected = allIds.every((id) => selected.has(id));

    const toggleAll = () => setSelected(isAllSelected ? new Set() : new Set(allIds));

    const toggleModule = (module: string) => {
        const moduleIds = grouped[module].map((p) => p.id);
        const allModSelected = moduleIds.every((id) => selected.has(id));
        setSelected((prev) => {
            const next = new Set(prev);
            moduleIds.forEach((id) => allModSelected ? next.delete(id) : next.add(id));
            return next;
        });
    };

    const togglePermission = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleSave = () => {
        if (!role) return;
        onSave(role.id, Array.from(selected));
        toast.success(`Permissions updated for ${role.name}`);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit Permissions — ${role?.name || ""}`} size="lg" bodyClassName="py-3">
            <div className="flex flex-col gap-4">
                <div className="w-full h-px bg-[#DFE1E7]" />

                {/* Select All */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={isAllSelected} onChange={toggleAll} className="w-4 h-4 rounded accent-[#0098E8]" />
                    <span className="text-sm font-medium text-[#1B1B1B]">Select All Permissions</span>
                </label>

                {/* Permission Groups */}
                <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto">
                    {Object.entries(grouped).map(([module, perms]) => {
                        const moduleIds = perms.map((p) => p.id);
                        const allModSelected = moduleIds.every((id) => selected.has(id));
                        const someModSelected = moduleIds.some((id) => selected.has(id));

                        return (
                            <div key={module}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#777980]">{module}</h3>
                                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#777980] hover:text-[#1B1B1B]">
                                        <input
                                            type="checkbox"
                                            checked={allModSelected}
                                            ref={(el) => { if (el) el.indeterminate = someModSelected && !allModSelected; }}
                                            onChange={() => toggleModule(module)}
                                            className="w-3.5 h-3.5 rounded accent-[#0098E8] cursor-pointer"
                                        />
                                        Module All
                                    </label>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {perms.map((perm) => (
                                        <label
                                            key={perm.id}
                                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${selected.has(perm.id) ? "border-[#0098E8] bg-[#EBF5FF]" : "border-[#DFE1E7] bg-[#F8FAFB] hover:border-[#B0B3BC]"
                                                }`}
                                        >
                                            <input type="checkbox" checked={selected.has(perm.id)} onChange={() => togglePermission(perm.id)} className="w-3.5 h-3.5 rounded accent-[#0098E8] cursor-pointer shrink-0" />
                                            <span className="text-[#1B1B1B] text-xs leading-tight">{perm.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-[#E8E8E9]">
                    <Button type="button" variant="outline" onClick={onClose} className="px-6 w-auto!">Cancel</Button>
                    <Button onClick={handleSave} className="px-6 w-auto!">Save</Button>
                </div>
            </div>
        </Modal>
    );
}