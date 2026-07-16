"use client";

import { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { FAQRow } from './FAQRow';
import { FAQModal } from './FAQModal';
import { useGetFAQsQuery, useDeleteFAQMutation, useReorderFAQsMutation } from '@/services/faq.api';
import type { FAQ } from '@/types/faq';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = [
    { value: 'true', label: 'Published' },
    { value: 'false', label: 'Draft' },
];

const SORT_OPTIONS = [
    { value: 'created_at_desc', label: 'Newest first' },
    { value: 'created_at_asc', label: 'Oldest first' },
];

export function FAQContent() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortFilter, setSortFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
    const [localFAQs, setLocalFAQs] = useState<FAQ[]>([]);

    const { data: faqs = [], isLoading, refetch } = useGetFAQsQuery({
        search: searchQuery || undefined,
        is_active: statusFilter ? statusFilter === 'true' : undefined,
        sort_by: sortFilter.includes('created_at') ? 'created_at' : 'display_order',
        sort_order: sortFilter.includes('desc') ? 'desc' : 'asc',
        limit: 100,
    });

    const [deleteFAQ] = useDeleteFAQMutation();
    const [reorderFAQs] = useReorderFAQsMutation();

    // Update local FAQs when data changes
    useEffect(() => {
        setLocalFAQs(faqs);
    }, [faqs]);

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setSearchQuery(searchInput);
        }
    };

    const handleSearchClick = () => {
        setSearchQuery(searchInput);
    };

    const handleEdit = (faq: FAQ) => {
        setEditingFAQ(faq);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            await deleteFAQ(id).unwrap();
            toast.success('FAQ deleted successfully');
            refetch();
        } catch {
            toast.error('Failed to delete FAQ');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingFAQ(null);
    };

    const handleModalSuccess = () => {
        refetch();
        handleModalClose();
    };

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(localFAQs);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({
            ...item,
            display_order: index + 1,
        }));

        setLocalFAQs(updatedItems);

        // Send reorder request
        try {
            await reorderFAQs({
                faqs: updatedItems.map((item) => ({
                    id: item.id,
                    display_order: item.display_order,
                })),
            }).unwrap();
            toast.success('Order updated successfully');
        } catch {
            toast.error('Failed to update order');
            setLocalFAQs(faqs);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-4">
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex w-full max-w-full flex-col items-start p-4">
            {/* Header */}
            <div className="flex justify-between items-center self-stretch">
                <h2 className="text-[#1D1F2C] font-inter text-xl font-semibold leading-[100%]">
                    FAQ Section
                </h2>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="w-auto! flex py-2.5 px-4 justify-center items-center gap-2 rounded bg-[#0098E8] text-white font-inter text-sm hover:bg-[#0088D8] transition-colors"
                >
                    <Icon name="plus" width={16} height={16} color="white" />
                    Add New
                </Button>
            </div>

            <div className="h-6" /> {/* 24px gap */}

            {/* Filters */}
            <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap self-stretch">
                {/* Search Input with Button */}
                <div className="flex flex-1 min-w-[200px] max-w-[400px]">
                    <div className="flex px-4 py-3 items-center gap-3 rounded-l-lg border border-[#E8E8E9] bg-white flex-1 border-r-0">
                        <Icon name="search" width={20} height={20} color="#777980" />
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="flex-1 border-none outline-none text-sm text-[#1B1B1B] placeholder-[#777980] font-inter bg-transparent"
                        />
                    </div>
                    <Button
                        onClick={handleSearchClick}
                        className="rounded-l-none rounded-r-lg px-4 py-3 bg-[#0098E8] text-white hover:bg-[#0088D8] transition-colors whitespace-nowrap"
                    >
                        Search
                    </Button>
                </div>

                <FilterDropdown
                    label="All Status"
                    options={STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={setStatusFilter}
                />

                <FilterDropdown
                    label="Sort by"
                    options={SORT_OPTIONS}
                    value={sortFilter}
                    onChange={setSortFilter}
                />
            </div>

            <div className="h-4" /> {/* 16px gap */}

            {/* Table */}
            <div className="w-full rounded-xl border border-[#DFE1E7] overflow-hidden bg-white">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="faqs">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex flex-col w-full"
                            >
                                {localFAQs.length === 0 ? (
                                    <div className="flex items-center justify-center py-12 text-[#777980] font-inter text-sm">
                                        No FAQs found. Add your first FAQ!
                                    </div>
                                ) : (
                                    localFAQs.map((faq, index) => (
                                        <FAQRow
                                            key={faq.id}
                                            faq={faq}
                                            index={index}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Add/Edit Modal */}
            <FAQModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                faq={editingFAQ}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
}