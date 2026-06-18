"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

const stageOptions = ["new", "contracted", "converted", "lost"] as const;
type Stage = (typeof stageOptions)[number];

const stageStyles: Record<Stage, string> = {
  converted: "bg-[#DCF7EA] text-[#006F1F]",
  contracted: "bg-[#FFF7E6] text-[#FFAF00]",
  lost: "bg-[#FFE6E6] text-[#FF4345]",
  new: "bg-[#8ad7ff] text-[#0098E8]",
};

const stageIcons: Record<Stage, string> = {
  converted: "convert",
  contracted: "contract",
  lost: "lost",
  new: "new",
};

const stageColors: Record<Stage, string> = {
  converted: "#006F1F",
  contracted: "#FFAF00",
  lost: "#FF4345",
  new: "#0098E8",
};

interface StageDropdownProps {
  currentStage: Stage;
  onSelect: (stage: Stage) => void;
}

export function StageDropdown({ currentStage, onSelect }: StageDropdownProps) {
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
    <div ref={ref} className="relative inline-block">
      <Button
        variant="icon"
        onClick={() => setOpen(!open)}
        className={`inline-flex py-[6px] pl-2 pr-1 justify-center items-center gap-1 rounded text-sm capitalize cursor-pointer ${stageStyles[currentStage]}`}
      >
        <Icon name={stageIcons[currentStage]} width={14} height={14} color={stageColors[currentStage]} />
        {currentStage}
        <ChevronDown size={12} className="opacity-70" />
      </Button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg border border-[#E8E8E9] shadow-lg z-20 overflow-hidden">
          {stageOptions.map((stage) => (
            <Button
              key={stage}
              variant="icon"
              onClick={() => { onSelect(stage); setOpen(false); }}
              className={`flex w-full py-[10px] px-4 items-center gap-2 text-sm capitalize cursor-pointer transition-colors ${
                stage === currentStage
                  ? "bg-[#0098E8] text-white"
                  : "text-[#1B1B1B] hover:bg-[#F8FAFB]"
              }`}
            >
              <Icon
                name={stageIcons[stage]}
                width={14}
                height={14}
                color={stage === currentStage ? "#FFFFFF" : stageColors[stage]}
              />
              {stage}
            </Button>
          ))}
          <Button
            variant="icon"
            className="flex w-full py-[10px] px-4 items-center justify-center text-[#0098E8] font-inter text-sm border-t border-[#E8E8E9] hover:bg-[#F0F8FF] cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Create new Stage
          </Button>
        </div>
      )}
    </div>
  );
}