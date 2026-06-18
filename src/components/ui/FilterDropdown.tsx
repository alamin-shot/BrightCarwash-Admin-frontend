"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  fullWidth?: boolean;
  buttonClassName?: string;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  className = "",
  fullWidth = false,
  buttonClassName = "",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (dropdownMenuRef.current && !dropdownMenuRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: fullWidth ? `${rect.width}px` : "auto",
        minWidth: fullWidth ? "auto" : "160px",
        zIndex: "200",
      });
    }
  }, [open, fullWidth]);

  const selectedLabel = value
    ? options.find((o) => o.value === value)?.label || label
    : label;

  const defaultBtnClass =
    "border-[#E8E8E9] bg-white text-[#1B1B1B] hover:bg-[#F8FAFB]";

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? "w-full" : ""} ${className}`}
    >
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex px-4 py-3 items-center gap-2 rounded-lg border text-sm font-inter cursor-pointer transition-colors ${
          fullWidth ? "w-full justify-between" : "whitespace-nowrap"
        } ${buttonClassName || defaultBtnClass}`}
      >
        <span className={value ? "text-[#1B1B1B]" : "text-[#777980]"}>
          {selectedLabel}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#777980] transition-transform duration-200 shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownMenuRef}
            className="adm-glass-dropdown-menu"
            style={dropdownStyle}
          >
            <Button
              variant="icon"
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`flex w-full py-[10px] px-4 items-center text-sm text-left cursor-pointer transition-colors ${
                !value
                  ? "bg-[#0098E8] text-white"
                  : "text-[#1B1B1B] hover:bg-[#F8FAFB]"
              }`}
            >
              {label}
            </Button>
            {options.map((option) => (
              <Button
                key={option.value}
                variant="icon"
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full py-[10px] px-4 items-center text-sm text-left cursor-pointer transition-colors capitalize ${
                  value === option.value
                    ? "bg-[#0098E8] text-white"
                    : "text-[#1B1B1B] hover:bg-[#F8FAFB]"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}