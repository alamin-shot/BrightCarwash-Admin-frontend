"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
type ViewMode = "list" | "kanban";

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  const toggleRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !toggleRef.current) return;
    const timer = requestAnimationFrame(() => {
      if (!toggleRef.current) return;
      const selector = viewMode === "kanban" ? "button:first-of-type" : "button:last-of-type";
      const activeBtn = toggleRef.current.querySelector(selector) as HTMLElement;
      if (activeBtn) {
        setSliderStyle({
          left: `${activeBtn.offsetLeft}px`,
          width: `${activeBtn.offsetWidth}px`,
        });
      }
    });
    return () => cancelAnimationFrame(timer);
  }, [viewMode, mounted]);

  return (
    <div
      ref={toggleRef}
      className="relative flex p-1 items-center gap-0.5 rounded-lg border border-[#DFE1E7] bg-[#F6F6F6]"
    >
      {mounted && (
        <div
          className="absolute top-1 h-[calc(100%-8px)] rounded-md bg-[#B23730] shadow-[0_4px_4px_0_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out z-0"
          style={sliderStyle}
        />
      )}
      <Button
        variant="icon"
        onClick={() => onChange("kanban")}
        className={`relative z-10 flex py-2 px-3 justify-center items-center gap-1 rounded-md text-sm font-inter transition-colors duration-200 ${
          viewMode === "kanban" ? "text-white" : "text-[#777980] hover:text-[#1B1B1B]"
        }`}
      >
      <Icon name="kanban" width={20} height={20} className="lg:w-6 lg:h-6" />
        
        Kanban
      </Button>
      <Button
        variant="icon"
        onClick={() => onChange("list")}
        className={`relative z-10 flex py-2 px-3 justify-center items-center gap-1 rounded-md text-sm font-inter transition-colors duration-200 ${
          viewMode === "list" ? "text-white" : "text-[#777980] hover:text-[#1B1B1B]"
        }`}
      >
     <Icon name="list" width={20} height={20} className="lg:w-6 lg:h-6" />

        List
      </Button>
    </div>
  );
}