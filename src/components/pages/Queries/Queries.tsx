"use client";
import { DataTable } from "@/components/ui/DataTable";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import {
  useDeleteQuoteMutation,
  useGetQuotesQuery,
  useUpdateStatusMutation,
} from "@/services/queries.api";
import { Ellipsis, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";
import { Pagination } from "@/components/ui/Pagination";

const actions = [
  {
    key: "details",
    label: "View Detail",
  },
  {
    key: "send",
    label: "Send email",
  },
  {
    key: "delete",
    label: "Delete query",
  },
];

export default function Queries() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: quotesData,
    isLoading: quotesLoading,
    refetch: quotesRefetch,
  } = useGetQuotesQuery({ page: currentPage, limit: pageSize, status, search });

  const [updateStatus] = useUpdateStatusMutation();
  const handleUpdateStatus = async (id: string, status: string) => {
    await updateStatus({ id, status });
    quotesRefetch();
  };

  const [deleteQuote] = useDeleteQuoteMutation();
  const handleDeleteQuote = async (id: string) => {
    await deleteQuote({ id });
    quotesRefetch();
  };

  console.log("hello queries", quotesData?.data?.items);
  const queries = quotesData?.data?.items || [];

  const columns = [
    {
      key: "full_name",
      header: "Full Name",
    },
    {
      key: "phone",
      header: "Phone Number",
    },
    {
      key: "email",
      header: "Email Address",
    },
    {
      key: "vehicle",
      header: "Vehicle",
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => {
        const statusStyles: Record<string, string> = {
          new: "bg-[#E6F5FD] text-[#0098E8]",
          replied: "bg-[#DCF7EA] text-[#006F1F]",
          closed: "bg-[#FFE6E6] text-[#FF4345]",
        };
        const selectedStatusClass =
          statusStyles[row.status] || "bg-[#F5F5F5] text-[#111827]";

        return (
          <div>
            <FilterDropdown
              label="Status"
              options={[
                { value: "new", label: "New" },
                { value: "replied", label: "Replied" },
                { value: "closed", label: "Closed" },
              ]}
              value={row.status}
              onChange={(value) => {
                setCategoryId(value || "");
                handleUpdateStatus(row.id, value || "");
              }}
              className="w-fit"
              buttonClassName={`rounded-full border-none px-3 py-1.5 text-sm font-medium ${selectedStatusClass}`}
            />
          </div>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      render: (row: any) => {
        return format(new Date(row.date), "d MMM, yyyy") || "";
      },
    },
    {
      key: "action",
      header: "Action",
      render: (row: any) => {
        const isOpen = openMenuId === row.id;
        return (
          <div className="flex items-center relative">
            <button
              type="button"
              onClick={() => setOpenMenuId(isOpen ? null : row.id)}
              aria-expanded={isOpen}
              className={`border border-[#E8E8E9] p-2 rounded-md cursor-pointer hover:bg-[#F5F5F5] duration-200 ${
                isOpen ? "bg-[#F5F5F5] border-[#DADCE0]" : ""
              }`}
            >
              <Ellipsis
                className={isOpen ? "text-[#0098E8]" : "text-[#111827]"}
              />
            </button>
            {isOpen && (
              <div className="absolute top-10 w-40 -left-20 shadow border border-[#E8E8E9] rounded-2xl bg-white z-50 overflow-hidden">
                {actions?.map((action) => (
                  <button
                    onClick={() => {
                      setOpenMenuId(null);
                      if (action.key === "delete") {
                        handleDeleteQuote(row.id);
                      }
                    }}
                    key={action.key}
                    className="text-[#4A4C56] hover:text-white w-full p-2 hover:bg-[#0098E8] duration-200 cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const data =
    queries?.map((item) => ({
      ...item,
      status: item.status || "new",
    })) || [];

  const totalItems = quotesData?.data?.meta?.total || 0;
  const itemsPerPage = quotesData?.data?.meta?.limit || pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h2 className="text-[#0B1220] font-lora text-lg xl:text-2xl font-semibold mb-4 lg:mb-8">
        Website Queries Overview
      </h2>
      <div className="mb-3 flex justify-between items-center">
        <div className="relative">
          <input
            className="w-full lg:w-87 border border-[#E8E8E9] rounded-lg text-sm py-3 px-3.75 outline-none"
            placeholder="Search by name, phone number, email..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon className="absolute top-1/2 right-3 -translate-y-1/2 text-[#E8E8E9] text-sm" />
        </div>
        <FilterDropdown
          label="Status"
          options={[
            { value: "new", label: "New" },
            { value: "replied", label: "Replied" },
            { value: "closed", label: "Closed" },
          ]}
          dropdownOffsetX={-50}
          value={status}
          onChange={(value) => {
            setStatus(value || "");
          }}
          className="w-fit left-0"
        />
      </div>
      <div>
        <DataTable
          columns={columns}
          data={data}
          rowKey={(item) => item.id}
          className={`w-full border border-[#E8E8E9]  ${totalPages > 1 ? "rounded-t-lg" : "rounded-lg"}`}
        />
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end items-center p-4 border-b border-x border-[#E8E8E9] rounded-b-lg relative">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            isLoading={quotesLoading}
          />
        </div>
      )}
    </div>
  );
}
