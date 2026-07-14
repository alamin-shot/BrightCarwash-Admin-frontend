'use client';

import { useRef } from 'react';
import { LeadsTable, type LeadsTableHandle } from '@/components/pages/leads/LeadsTable';
import { GroupsContent, type GroupsContentRef } from '@/components/pages/leads/groups/GroupsContent';
import { AddLeadModal } from '@/components/pages/leads/kanban/AddLeadModal';
import { CreateGroupModal } from '@/components/pages/leads/groups/CreateGroupModal';
import { LeadsContentHeader } from './LeadsContentHeader';
import { useLeadsContent } from '@/hooks/useLeadsContent';

export function LeadsContent() {
	const tableRef = useRef<LeadsTableHandle>(null);
	const groupsRef = useRef<GroupsContentRef>(null);
	const {
		modalOpen, setModalOpen,
		groupModalOpen, setGroupModalOpen,
		viewMode, setViewMode,
		groupMode, setGroupMode,
		selectedCount, selectedLeads, setSelectedLeads,
		stages,
		isExportOpen, setIsExportOpen,
		exportRef,
		handleSelectionChange,
		handleNewGroupClick,
	} = useLeadsContent();

	const handleExportExcel = () => {
		if (groupMode === 'all') tableRef.current?.exportExcel();
		else groupsRef.current?.exportExcel();
		setIsExportOpen(false);
	};

	const handleExportCSV = () => {
		if (groupMode === 'all') tableRef.current?.exportCSV();
		else groupsRef.current?.exportCSV();
		setIsExportOpen(false);
	};

	return (
		<div className="w-full h-full flex flex-col gap-3 sm:gap-4 p-3 sm:p-4">
			<LeadsContentHeader
				groupMode={groupMode}
				selectedCount={selectedCount}
				isExportOpen={isExportOpen}
				setIsExportOpen={setIsExportOpen}
				exportRef={exportRef}
				handleExportExcel={handleExportExcel}
				handleExportCSV={handleExportCSV}
				handleNewGroupClick={handleNewGroupClick}
				setModalOpen={setModalOpen}
				viewMode={viewMode}
				setViewMode={setViewMode}
				setGroupMode={setGroupMode}
			/>

			{groupMode === 'all' ? (
				<LeadsTable ref={tableRef} viewMode={viewMode} groupMode="all" onSelectionChange={handleSelectionChange} />
			) : (
				<GroupsContent ref={groupsRef} groupModalOpen={groupModalOpen} onGroupModalClose={() => setGroupModalOpen(false)} />
			)}

			<AddLeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} stages={stages} />
			<CreateGroupModal
				isOpen={groupModalOpen}
				onClose={() => setGroupModalOpen(false)}
				selectedLeads={groupMode === 'all' ? selectedLeads : []}
				onGroupCreated={() => { setGroupModalOpen(false); setSelectedLeads([]); }}
			/>
		</div>
	);
}