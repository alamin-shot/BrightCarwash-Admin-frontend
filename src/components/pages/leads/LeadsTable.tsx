"use client";

import { useState, useMemo, useCallback, forwardRef, useImperativeHandle, useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { createLeadsColumns } from "@/components/pages/leads/LeadsColumns";
import { LeadsFilters } from "@/components/pages/leads/LeadsFilters";
import { ViewToggle } from "@/components/pages/leads/ViewToggle";
import { KanbanBoard } from "@/components/pages/leads/kanban/KanbanBoard";
import { useGetLeadsQuery, useUpdateLeadStageMutation } from "@/services/leads.api";
import { exportToCSV } from "@/lib/csv-export";
import type { Lead, LeadStage } from "@/types/leads";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

export interface LeadsTableHandle {
  exportCSV: () => void;
}

export const LeadsTable = forwardRef<LeadsTableHandle>(function LeadsTable(_props, ref) {
  const { data: leads = [], isLoading, error } = useGetLeadsQuery();
  const [updateStage] = useUpdateLeadStageMutation();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [depositFilter, setDepositFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  const resetPage = useCallback(() => setCurrentPage(1), []);

 const handleStageChange = useCallback(async (id: string, stage: LeadStage) => {
  try {
    await updateStage({ id, stage }).unwrap();
    toast.success(`Stage updated to ${stage}`);
  } catch {
    toast.error("Failed to update stage");
  }
}, [updateStage]);

  const handleView = useCallback((lead: Lead) => toast.info(`Viewing ${lead.name}`), []);
  const handleDelete = useCallback((lead: Lead) => toast.info(`Delete ${lead.name}`), []);

  const handleSelectRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const filteredLeads = useMemo(() => leads
    .filter((lead) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return lead.name.toLowerCase().includes(q) || lead.service.toLowerCase().includes(q) || lead.vehicle.toLowerCase().includes(q);
    })
    .filter((lead) => (sourceFilter ? lead.source === sourceFilter : true))
    .filter((lead) => (depositFilter ? lead.deposit === depositFilter : true)),
  [leads, searchQuery, sourceFilter, depositFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ITEMS_PER_PAGE));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [totalPages, currentPage]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(selectedIds.size === paginatedLeads.length ? new Set() : new Set(paginatedLeads.map((l) => l.id)));
  }, [paginatedLeads, selectedIds.size]);

  const handleExport = useCallback(() => {
    const dataToExport = selectedIds.size > 0 ? filteredLeads.filter((l) => selectedIds.has(l.id)) : filteredLeads;
    if (dataToExport.length === 0) { toast.warning("No data to export"); return; }
    const cols = [
      { key: "name", header: "Lead Name" }, { key: "service", header: "Service" },
      { key: "vehicle", header: "Vehicle" }, { key: "source", header: "Source" },
      { key: "deposit", header: "Deposit" }, { key: "stage", header: "Stage" }, { key: "date", header: "Date" },
    ];
    exportToCSV(dataToExport, cols, "leads-export");
    toast.success(`Exported ${dataToExport.length} leads`);
  }, [filteredLeads, selectedIds]);

  useImperativeHandle(ref, () => ({ exportCSV: handleExport }), [handleExport]);

  const uniqueSources = useMemo(() => [...new Set(leads.map((l) => l.source))], [leads]);
  const allSelected = paginatedLeads.length > 0 && selectedIds.size === paginatedLeads.length;

  const columns = useMemo(() => createLeadsColumns({
    onStageChange: handleStageChange, onView: handleView, onDelete: handleDelete,
    onSelectRow: handleSelectRow, onSelectAll: handleSelectAll, allSelected, selectedIds,
  }), [handleStageChange, handleView, handleDelete, handleSelectRow, handleSelectAll, allSelected, selectedIds]);

  if (isLoading) return <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse w-full" />;
  if (error) return <div className="flex items-center justify-center py-12 text-[#FF4345] font-inter">Failed to load leads.</div>;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center w-full gap-4 flex-wrap">
        <LeadsFilters
          searchQuery={searchQuery} onSearchChange={(v) => { setSearchQuery(v); resetPage(); }}
          sourceFilter={sourceFilter} onSourceChange={(v) => { setSourceFilter(v); resetPage(); }}
          depositFilter={depositFilter} onDepositChange={(v) => { setDepositFilter(v); resetPage(); }}
          uniqueSources={uniqueSources}
        />
        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "list" ? (
        <>
          <DataTable columns={columns} data={paginatedLeads} rowKey={(row) => row.id} className="w-full" />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}
            totalItems={filteredLeads.length} itemsPerPage={ITEMS_PER_PAGE} />
        </>
      ) : (
        <KanbanBoard leads={filteredLeads} onStageChange={handleStageChange} />
      )}
    </div>
  );
});