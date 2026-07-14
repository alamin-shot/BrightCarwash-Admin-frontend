"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  isLoading = false,
}: PaginationProps) {
  const startItem = (currentPage - 1) * (itemsPerPage || 10) + 1;
  const endItem = Math.min(currentPage * (itemsPerPage || 10), totalItems || 0);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full pt-2">

      {totalItems !== undefined && itemsPerPage && (
        <div className="text-[#777980] font-inter text-sm">
          Showing {startItem}-{endItem} of {totalItems} results
          {isLoading && ' (loading...)'}
        </div>
      )}
      <div className="flex items-center gap-1">
        <Button
          variant="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="flex p-2 items-center rounded-lg border border-[#DFE1E7] bg-white text-[#777980] hover:bg-[#F8FAFB] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </Button>

        {getPageNumbers().map((page, index) =>
          typeof page === 'string' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-[#777980]">
              {page}
            </span>
          ) : (
            <Button
              key={page}
              variant="icon"
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`flex min-w-[36px] p-2 items-center justify-center rounded-lg border text-sm font-inter transition-colors ${page === currentPage
                ? 'border-[#0098E8] bg-[#0098E8] text-white'
                : 'border-[#DFE1E7] bg-white text-[#1B1B1B] hover:bg-[#F8FAFB]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="flex p-2 items-center rounded-lg border border-[#DFE1E7] bg-white text-[#777980] hover:bg-[#F8FAFB] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </Button>
      </div>


    </div>
  );
}