"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  function getPageNumbers(): (number | "...")[] {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="flex items-center justify-between w-full px-1 py-3 flex-wrap gap-3">
      <span className="text-[#777980] font-inter text-sm">
        Showing {startItem}-{endItem} of {totalItems}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-[#E8E8E9] bg-white text-[#777980] hover:bg-[#F8FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </Button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-[#777980] text-sm">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant="icon"
              onClick={() => onPageChange(page as number)}
              className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-[#0098E8] text-white"
                  : "border border-[#E8E8E9] bg-white text-[#1B1B1B] hover:bg-[#F8FAFB]"
              }`}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-[#E8E8E9] bg-white text-[#777980] hover:bg-[#F8FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}