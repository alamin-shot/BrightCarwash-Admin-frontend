"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({ label, options, value, onChange, className = "" }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel = value ? options.find((o) => o.value === value)?.label || label : label;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <Button
        variant="icon"
        onClick={() => setOpen(!open)}
        className="flex px-4 py-3 items-center gap-2 rounded-lg border border-[#E8E8E9] bg-white text-sm text-[#1B1B1B] font-inter cursor-pointer whitespace-nowrap hover:bg-[#F8FAFB] transition-colors"
      >
        <span className={value ? "text-[#1B1B1B]" : "text-[#777980]"}>{selectedLabel}</span>
        <ChevronDown size={16} className={`text-[#777980] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </Button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[160px] bg-white rounded-lg border border-[#E8E8E9] shadow-lg z-20 overflow-hidden">
          <Button
            variant="icon"
            onClick={() => { onChange(""); setOpen(false); }}
            className={`flex w-full py-[10px] px-4 items-center text-sm text-left cursor-pointer transition-colors ${
              !value ? "bg-[#0098E8] text-white" : "text-[#1B1B1B] hover:bg-[#F8FAFB]"
            }`}
          >
            {label}
          </Button>
          {options.map((option) => (
            <Button
              key={option.value}
              variant="icon"
              onClick={() => { onChange(option.value); setOpen(false); }}
              className={`flex w-full py-[10px] px-4 items-center text-sm text-left cursor-pointer transition-colors capitalize ${
                value === option.value ? "bg-[#0098E8] text-white" : "text-[#1B1B1B] hover:bg-[#F8FAFB]"
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}