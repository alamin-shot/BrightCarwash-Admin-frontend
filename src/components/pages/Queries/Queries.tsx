"use client";
import { DataTable } from "@/components/ui/DataTable";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { useGetQuotesQuery } from "@/services/queries.api";
import { Ellipsis } from "lucide-react";
import React, { useState } from "react";
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
  const [categoryId, setCategoryId] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data: quotesData, isLoading: quotesLoading, error: quotesError } = useGetQuotesQuery({page: 1, limit: 10,});

  console.log("hello queries",quotesData?.data?.items)

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
                setCategoryId(value);
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
        return row.date?.substring(0, 10) || "";
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
              <div className="absolute top-10 w-40 -left-40 shadow border border-[#E8E8E9] rounded-2xl bg-white z-50 overflow-hidden">
                {actions.map((action) => (
                  <button
                    onClick={() => setOpenMenuId(null)}
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



  const data = queries?.map((item) => ({
    ...item,
    status: item.status || "New",
  })) || [];

  return (
    <div>
      <div>
        <DataTable
          columns={columns}
          data={data}
          rowKey={(item) => item.id}
          className="w-full border border-[#E8E8E9] rounded-t-lg "
        />
      </div>
      <div className="flex justify-end items-center p-4 border-b border-x border-[#E8E8E9] rounded-b-lg relative">
        Here will be pagination
      </div>
    </div>
  );
}
