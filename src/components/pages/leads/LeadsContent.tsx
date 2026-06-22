"use client";

import { useState, useRef, useCallback } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { LeadsTable, type LeadsTableHandle } from "@/components/pages/leads/LeadsTable";
import { AddLeadModal } from "@/components/pages/leads/kanban/AddLeadModal";
import { ViewToggle } from "@/components/pages/leads/ViewToggle";
import { GroupToggle } from "@/components/pages/leads/GroupToggle";
import { CreateGroupModal } from "@/components/pages/leads/CreateGroupModal";

export function LeadsContent() {
	const tableRef = useRef<LeadsTableHandle>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [groupModalOpen, setGroupModalOpen] = useState(false);
	const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
	const [groupMode, setGroupMode] = useState<"all" | "groups">("all");
	const [selectedCount, setSelectedCount] = useState(0);
	const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

	const handleSelectionChange = useCallback((count: number, ids: string[]) => {
		setSelectedCount(count);
		setSelectedLeads(ids);
	}, []);

	return (
		<div className="w-full h-full flex flex-col gap-3 sm:gap-4 p-3 sm:p-4">
			<div className="flex justify-between items-end gap-3 self-stretch">
				<h2 className="text-[#0B1220] font-lora text-lg sm:text-xl font-bold leading-[100%]">
					All Leads Overview
				</h2>
				<div className="flex items-center gap-3 sm:gap-4 shrink-0">
					{groupMode === "all" && (
						<>
							<Button
								variant="outline"
								className="flex py-2 sm:py-2.5 px-3 sm:px-4 justify-center items-center gap-1.5 sm:gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-xs sm:text-sm font-normal"
								onClick={() => tableRef.current?.exportCSV()}
							>
								<Icon name="export" width={14} height={14} className="sm:w-4 sm:h-4" />
								Export
							</Button>
							{selectedCount >= 2 ? (
								<Button
									className="flex py-2 sm:py-2.5 px-3 sm:px-4 justify-center items-center gap-1.5 sm:gap-2 rounded bg-[#0098E8] text-white font-inter text-xs sm:text-sm font-normal hover:bg-[#0088D8] transition-colors whitespace-nowrap"
									onClick={() => setGroupModalOpen(true)}
								>
									New Group ({selectedCount})
								</Button>
							) : (
								<Button
									className="flex py-2 sm:py-2.5 px-3 sm:px-4 justify-center items-center gap-1.5 sm:gap-2 rounded bg-[#0098E8] text-white font-inter text-xs sm:text-sm font-normal hover:bg-[#0088D8] transition-colors whitespace-nowrap"
									onClick={() => setModalOpen(true)}
								>
									<Icon name="plus" width={14} height={14} className="sm:w-4 sm:h-4" />
									New Lead
								</Button>
							)}
						</>
					)}
					{groupMode === "groups" && (
						<>
							<Button
								variant="outline"
								className="flex py-2 sm:py-2.5 px-3 sm:px-4 justify-center items-center gap-1.5 sm:gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-xs sm:text-sm font-normal"
								onClick={() => tableRef.current?.exportCSV()}
							>
								<Icon name="export" width={14} height={14} className="sm:w-4 sm:h-4" />
								Export
							</Button>
							<Button
								className="flex py-2 sm:py-2.5 px-3 sm:px-4 justify-center items-center gap-1.5 sm:gap-2 rounded bg-[#0098E8] text-white font-inter text-xs sm:text-sm font-normal hover:bg-[#0088D8] transition-colors whitespace-nowrap"
								onClick={() => setGroupModalOpen(true)}
							>
								New Group
							</Button>
						</>
					)}
					<div className="w-px h-8 bg-[#DFE1E7]" />
					{groupMode === "all" && <ViewToggle viewMode={viewMode} onChange={setViewMode} />}
					{groupMode === "all" && <div className="w-px h-8 bg-[#DFE1E7]" />}
					<GroupToggle value={groupMode} onChange={setGroupMode} />
				</div>
			</div>

			<LeadsTable ref={tableRef} viewMode={viewMode} groupMode={groupMode} onSelectionChange={handleSelectionChange} />

			<AddLeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
			<CreateGroupModal isOpen={groupModalOpen} onClose={() => setGroupModalOpen(false)} selectedLeads={selectedLeads} />
		</div>
	);
}