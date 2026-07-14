import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGetLeadsQuery, useUpdateLeadStageMutation, useDeleteLeadMutation } from '@/services/leads.api';
import { getStages } from '@/services/stage.service';
import { mapStagesToOptions } from '@/lib/stage-utils';
import { useLeadSelection } from '@/hooks/useLeadSelection';
import type { StageOption } from '@/components/ui/StageDropdown';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

export function useLeadsData(externalSearch?: string) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [depositFilter, setDepositFilter] = useState('');

    const {
        data: paginatedData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetLeadsQuery({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || externalSearch || undefined,
        source: sourceFilter || undefined,
        depositStatus: depositFilter || undefined,
    });

    const [updateStage] = useUpdateLeadStageMutation();
    const [deleteLead] = useDeleteLeadMutation();
    const { selectedIds, handleSelectRow, handleSelectAll } = useLeadSelection();
    const [stages, setStages] = useState<StageOption[]>([]);

    const leads = paginatedData?.data || [];
    const totalItems = paginatedData?.total || 0;
    const totalPages = paginatedData?.totalPages || 1;
    const isPageLoading = isLoading || isFetching;

    const uniqueSources = useMemo(() => [...new Set(leads.map((l) => l.source))], [leads]);

    const refreshStages = useCallback(async () => {
        setStages(mapStagesToOptions(await getStages()));
    }, []);

    useEffect(() => {
        getStages().then((s) => setStages(mapStagesToOptions(s)));
    }, []);

    useEffect(() => {
        refetch();
    }, [currentPage, searchTerm, sourceFilter, depositFilter, refetch]);

    const handleStageChange = useCallback(async (id: string, stageName: string) => {
        try {
            await updateStage({ id, stageName }).unwrap();
            toast.success('Stage updated');
            refetch();
        } catch {
            toast.error('Failed to update stage');
        }
    }, [updateStage, refetch]);

    const handleDelete = useCallback(async (lead: any) => {
        try {
            await deleteLead(lead.id).unwrap();
            toast.success(`${lead.name} deleted`);
            refetch();
        } catch {
            toast.error('Failed to delete lead');
        }
    }, [deleteLead, refetch]);

    return {
        leads,
        totalItems,
        totalPages,
        isLoading,
        isPageLoading,
        error,
        paginatedData,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        sourceFilter,
        setSourceFilter,
        depositFilter,
        setDepositFilter,
        uniqueSources,
        stages,
        refreshStages,
        selectedIds,
        handleSelectRow,
        handleSelectAll,
        handleStageChange,
        handleDelete,
    };
}