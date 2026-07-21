"use client";
import { DataTable } from "@/components/ui/DataTable";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
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
const data = [
  {
    id: "1",
    name: "John William",
    phone: "(880) 148 2541 154",
    email: "john@yahoo.com",
    vehicle: "Sedan",
    status: "New",
    date: "12 Jun, 2026",
  },
  {
    id: "2",
    name: "Alice Johnson",
    phone: "(123) 456 7890 123",
    email: "alice@gmail.com",
    vehicle: "SUV",
    status: "Replied",
    date: "05 Jul, 2023",
  },
  {
    id: "3",
    name: "Michael Smith",
    phone: "(234) 567 8901 234",
    email: "michael@outlook.com",
    vehicle: "Hatchback",
    status: "Replied",
    date: "15 Aug, 2022",
  },
  {
    id: "4",
    name: "Emily Davis",
    phone: "(345) 678 9012 345",
    email: "emily@yahoo.com",
    vehicle: "Coupe",
    status: "Closed",
    date: "22 Nov, 2023",
  },
  {
    id: "5",
    name: "Sophia Wilson",
    phone: "(567) 890 1234 567",
    email: "sophia@outlook.com",
    vehicle: "Minivan",
    status: "Replied",
    date: "01 Jan, 2025",
  },
  {
    id: "6",
    name: "James Taylor",
    phone: "(678) 901 2345 678",
    email: "james@yahoo.com",
    vehicle: "Pickup",
    status: "Replied",
    date: "30 Aug, 2023",
  },
  {
    id: "7",
    name: "Olivia Martinez",
    phone: "(789) 012 3456 789",
    email: "olivia@gmail.com",
    vehicle: "SUV",
    status: "Closed",
    date: "12 Dec, 2022",
  },
  {
    id: "8",
    name: "William Anderson",
    phone: "(890) 123 4567 890",
    email: "william@outlook.com",
    vehicle: "Sedan",
    status: "Replied",
    date: "20 Feb, 2023",
  },
  {
    id: "9",
    name: "Isabella Thomas",
    phone: "(901) 234 5678 901",
    email: "isabella@yahoo.com",
    vehicle: "Hatchback",
    status: "Replied",
    date: "18 Apr, 2024",
  },
  {
    id: "10",
    name: "Ethan Jackson",
    phone: "(012) 345 6789 012",
    email: "ethan@gmail.com",
    vehicle: "Coupe",
    status: "New",
    date: "29 Jun, 2023",
  },
  {
    id: "11",
    name: "Mia White",
    phone: "(123) 456 7890 234",
    email: "mia@outlook.com",
    vehicle: "Convertible",
    status: "Replied",
    date: "09 Sep, 2025",
  },
  {
    id: "12",
    name: "Benjamin Harris",
    phone: "(234) 567 8901 345",
    email: "benjamin@yahoo.com",
    vehicle: "Minivan",
    status: "Replied",
    date: "14 May, 2023",
  },
  {
    id: "13",
    name: "Charlotte Clark",
    phone: "(345) 678 9012 456",
    email: "charlotte@gmail.com",
    vehicle: "Pickup",
    status: "New",
    date: "08 Nov, 2023",
  },
];
export default function Queries() {
  const [categoryId, setCategoryId] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const columns = [
    {
      key: "name",
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
          New: "bg-[#E6F5FD] text-[#0098E8]",
          Replied: "bg-[#DCF7EA] text-[#006F1F]",
          Closed: "bg-[#FFE6E6] text-[#FF4345]",
        };
        const selectedStatusClass =
          statusStyles[row.status] || "bg-[#F5F5F5] text-[#111827]";

        return (
          <div>
            <FilterDropdown
              label="Status"
              options={[
                { value: "New", label: "New" },
                { value: "Replied", label: "Replied" },
                { value: "Closed", label: "Closed" },
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
              <div className="absolute top-10 w-40 -left-40 shadow border border-[#E8E8E9] rounded-2xl bg-white z-10 overflow-hidden">
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
  return (
    <div>
      <div>
        <DataTable
          columns={columns}
          data={data}
          rowKey={(item) => item.id}
          className="w-full border border-[#E8E8E9] rounded-t-lg overflow-hidden"
        />
      </div>
      <div className="flex justify-end items-center p-4 border-b border-x border-[#E8E8E9] rounded-b-lg">
        Here will be pagination
      </div>
    </div>
  );
}
