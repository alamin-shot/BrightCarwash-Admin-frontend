"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { LeadsTable, type LeadsTableHandle } from "@/components/pages/leads/LeadsTable";
import { GroupsContent } from "@/components/pages/leads/groups/GroupsContent";
import { AddLeadModal } from "@/components/pages/leads/kanban/AddLeadModal";
import { ViewToggle } from "@/components/pages/leads/ViewToggle";
import { GroupToggle } from "@/components/pages/leads/groups/GroupToggle";
import { CreateGroupModal } from "@/components/pages/leads/groups/CreateGroupModal";
import { getStages } from "@/services/stage.service";
import type { StageOption } from "@/components/ui/StageDropdown";
import type { Stage } from "@/types/stage";

function mapStagesToOptions(stages: Stage[]): StageOption[] {
	const nameToValue: Record<string, string> = {
		"new lead": "new", contracted: "contracted", converted: "converted", lost: "lost",
	};
	return stages.map((s) => ({
		value: nameToValue[s.name.toLowerCase()] ?? s.name.toLowerCase().replace(/\s+/g, "_"),
		label: s.name, color: s.color, stageId: s.id,
	}));
}

export function LeadsContent() {
	const tableRef = useRef<LeadsTableHandle>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [groupModalOpen, setGroupModalOpen] = useState(false);
	const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
	const [groupMode, setGroupMode] = useState<"all" | "groups">("all");
	const [selectedCount, setSelectedCount] = useState(0);
	const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
	const [stages, setStages] = useState<StageOption[]>([]);

	useEffect(() => {
		getStages().then((s) => setStages(mapStagesToOptions(s)));
	}, []);

	const handleSelectionChange = useCallback((count: number, ids: string[]) => {
		setSelectedCount(count);
		setSelectedLeads(ids);
	}, []);

	return (
		<div className="w-full h-full flex flex-col gap-3 sm:gap-4 p-3 sm:p-4">
			<div className="flex justify-between items-end gap-3 self-stretch">
				<h2 className="text-[#0B1220] font-lora text-lg sm:text-xl font-bold leading-[100%]">
					{groupMode === "all" ? "All Leads Overview" : "Lead Groups"}
				</h2>

				<div className="flex items-center gap-3 sm:gap-4 shrink-0">
					{groupMode === "all" && (
						<>
							<Button
								variant="outline"
								className="flex py-2 sm:py-2.5 px-3 sm:px-4 justify-center items-center gap-1.5 sm:gap-2 rounded border border-[#DFE1E7] text-[#1B1B1B] font-inter text-xs sm:text-sm font-normal"
								onClick={() => tableRef.current?.exportCSV()}
							>
								<Icon name="export" width={14} height={14} className="sm:w-4 sm:h-4" /> Export
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
									<Icon name="plus" width={14} height={14} className="sm:w-4 sm:h-4" /> New Lead
								</Button>
							)}
						</>
					)}

					{groupMode === "groups" && (
						<Button
							className="flex py-2 sm:py-2.5 px-3 sm:px-4 justify-center items-center gap-1.5 sm:gap-2 rounded bg-[#0098E8] text-white font-inter text-xs sm:text-sm font-normal hover:bg-[#0088D8] transition-colors whitespace-nowrap"
							onClick={() => setGroupModalOpen(true)}
						>
							<Icon name="plus" width={14} height={14} className="sm:w-4 sm:h-4" /> New Group
						</Button>
					)}

					<div className="w-px h-8 bg-[#DFE1E7]" />

					{groupMode === "all" && (
						<>
							<ViewToggle viewMode={viewMode} onChange={setViewMode} />
							<div className="w-px h-8 bg-[#DFE1E7]" />
						</>
					)}

					<GroupToggle value={groupMode} onChange={setGroupMode} />
				</div>
			</div>

			{groupMode === "all" ? (
				<LeadsTable ref={tableRef} viewMode={viewMode} groupMode="all" onSelectionChange={handleSelectionChange} />
			) : (
				<GroupsContent groupModalOpen={groupModalOpen} onGroupModalClose={() => setGroupModalOpen(false)} />
			)}

			<AddLeadModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				stages={stages}                     // ← pass the stage list
			/>
			{groupMode === "all" && (
				<CreateGroupModal isOpen={groupModalOpen} onClose={() => setGroupModalOpen(false)} selectedLeads={selectedLeads} onGroupCreated={() => { }} />
			)}
		</div>
	);
}