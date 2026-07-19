import React from "react";

export default function NotificationsPage() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 18 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-[#DFE1E7] bg-[#F8FAFB] p-5 cursor-pointer"
        >
          <p className="flex items-center justify-between">
            <span className="text-base xl:text-lg text-[#1D1F2C]">
              Alert: Unusual login detected.
            </span>
            <span className="text-sm xl:text-base text-[#1B1B1B]">
              11 hours ago
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
