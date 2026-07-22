// components/QueryDetailPanel.tsx
"use client";

import { X, Mail, Trash2, Phone, Mail as EmailIcon, Car, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

interface QueryDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    vehicle: string;
    status: string;
    date: string;
    message?: string;
  } | null;
  onSendEmail?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function QueryDetailPanel({
  isOpen,
  onClose,
  data,
  onSendEmail,
  onDelete,
}: QueryDetailPanelProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!data) return null;

  const statusStyles: Record<string, string> = {
    new: "bg-[#E6F5FD] text-[#0098E8]",
    replied: "bg-[#DCF7EA] text-[#006F1F]",
    closed: "bg-[#FFE6E6] text-[#FF4345]",
  };

  const statusLabels: Record<string, string> = {
    new: "New",
    replied: "Replied",
    closed: "Closed",
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this query?")) {
      onDelete?.(data.id);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#0098E81F] backdrop-blur-sm z-50 duration-300 ${
          isOpen ? "" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-120 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E9] shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-[#0B1220]">
              Query Details
            </h3>
            <p className="text-sm text-[#4A4C56]">ID: #{data.id.slice(0, 8)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5F5F5] transition-colors duration-200"
          >
            <X className="w-5 h-5 text-[#4A4C56]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Status Badge */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                statusStyles[data.status] || "bg-[#F5F5F5] text-[#111827]"
              }`}
            >
              {statusLabels[data.status] || data.status}
            </span>
          </div>

          {/* Info Grid */}
          <div className="space-y-5">
            {/* Full Name */}
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-[#4A4C56] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-[#4A4C56]">Full Name</p>
                <p className="text-base font-medium text-[#0B1220]">
                  {data.full_name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <EmailIcon className="w-5 h-5 text-[#4A4C56] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-[#4A4C56]">Email Address</p>
                <a
                  href={`mailto:${data.email}`}
                  className="text-base font-medium text-[#0098E8] hover:underline"
                >
                  {data.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#4A4C56] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-[#4A4C56]">Phone Number</p>
                <a
                  href={`tel:${data.phone}`}
                  className="text-base font-medium text-[#0B1220] hover:text-[#0098E8]"
                >
                  {data.phone}
                </a>
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex items-start gap-3">
              <Car className="w-5 h-5 text-[#4A4C56] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-[#4A4C56]">Vehicle</p>
                <p className="text-base font-medium text-[#0B1220]">
                  {data.vehicle}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#4A4C56] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-[#4A4C56]">Date</p>
                <p className="text-base font-medium text-[#0B1220]">
                  {format(new Date(data.date), "d MMM, yyyy")}
                </p>
              </div>
            </div>

            {/* Message (if available) */}
            {data.message && (
              <div className="mt-4 pt-4 border-t border-[#E8E8E9]">
                <p className="text-sm text-[#4A4C56] mb-2">Message</p>
                <p className="text-base text-[#0B1220] bg-[#F8F9FA] p-4 rounded-lg">
                  {data.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#E8E8E9] p-4 flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onSendEmail?.(data.id);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0098E8] text-white rounded-lg hover:bg-[#0081C9] transition-colors duration-200 font-medium"
          >
            <Mail className="w-4 h-4" />
            Send E-mail
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFE6E6] text-[#FF4345] rounded-lg hover:bg-[#FFD4D4] transition-colors duration-200 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}