"use client";

import { useState, useRef, useEffect } from "react";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ActionItem {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface ActionsDropdownProps {
  items: ActionItem[];
}

export function ActionsDropdown({ items }: ActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="icon"
        onClick={() => setOpen(!open)}
        className="flex p-[6px] items-center gap-3 rounded-md border border-[#E8E8E9] bg-white cursor-pointer hover:bg-[#F8FAFB]"
      >
        <Ellipsis size={16} className="text-[#777980]" />
      </Button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg border border-[#E8E8E9] shadow-lg z-20 overflow-hidden">
          {items.map((item) => (
            <Button
              key={item.label}
              variant="icon"
              onClick={() => { item.onClick(); setOpen(false); }}
              className={`flex w-full py-[10px] px-4 items-center text-sm text-left cursor-pointer transition-colors ${
                item.variant === "danger"
                  ? "text-[#FF4345] hover:bg-[#FFE6E6]"
                  : "text-[#1B1B1B] hover:bg-[#F8FAFB]"
              }`}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}