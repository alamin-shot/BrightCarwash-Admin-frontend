"use client";
import { DataTable } from "@/components/ui/DataTable";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { Ellipsis } from "lucide-react";
import React, { useState } from "react";

export default function Queries() {
  const [categoryId, setCategoryId] = useState("");
  const [open, setOpen] = useState(false);
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

        return (
          <div>
            <FilterDropdown
              label="Status"
              options={[
                { value: "New", label: "New" },
                { value: "Replied", label: "Replied" },
                { value: "Closed", label: "Closed" },
              ]}
              // value={row.status}
              value={categoryId}
              onChange={(value) => {
                setCategoryId(value);
              }}
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
        return (
          <div className="flex items-center relative">
            <button
              onClick={() => setOpen(!open)}
              className="border border-[#E8E8E9] p-2 rounded-md cursor-pointer hover:bg-[#F5F5F5] duration-200"
            >
              <Ellipsis />
            </button>
            {open && (
              <div className="absolute top-5 -left-10 shadow border border-[#E8E8E9] rounded-md bg-white">
                <button className="w-full p-2 rounded-md hover:bg-[#F5F5F5] duration-200">
                  View Detail
                </button>
                <button className="w-full p-2 rounded-md hover:bg-[#F5F5F5] duration-200">
                  Send E-mail
                </button>
                <button className="w-full p-2 rounded-md hover:bg-[#F5F5F5] duration-200">
                  Delete Query
                </button>
              </div>
            )}
          </div>
        );
      },
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
