"use client";

import React, { useEffect, useRef, useState } from "react";
import BellIcon from "../../../public/icons/custom/BellIcon";
import GoArrowRight from "../../../public/icons/custom/GoArrowRight";
import Link from "next/link";

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const notification = false

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer rounded-lg border border-[#DFE1E7] p-2 duration-300 hover:bg-gray-50"
      >
        <BellIcon className={notification ? "text-red-500": "text-red-600"} />
      </button>

      <div
        className={`absolute right-0 mt-2 w-72 lg:w-96 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0px_0px_3px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out ${
          isOpen
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <p
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-[#777980]">
                You have a new lead from the website!
              </span>
              <span className="text-xs text-[#4B5563] text-nowrap">
                15 mins ago
              </span>
            </p>
          ))}
        </div>
        <div className="border-t border-[#E5E7EB] my-4" />
        <Link
          href="/notifications"
          className="text-[#B23730] hover:text-[#B23730]/80 duration-300 text-sm font-semibold flex justify-center items-center gap-1 w-full cursor-pointer "
        >
          View all <GoArrowRight />
        </Link>
      </div>
    </div>
  );
}
