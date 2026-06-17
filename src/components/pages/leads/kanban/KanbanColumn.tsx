"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { KanbanCard } from "@/components/pages/leads/kanban/KanbanCard";
import type { Lead, LeadStage } from "@/types/leads";

interface KanbanColumnProps {
  id: LeadStage;
  title: string;
  borderColor: string;
  stageColor: string;
  icon: string;
  items: Lead[];
}

export function KanbanColumn({ id, title, borderColor, icon, items }: KanbanColumnProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    setVisibleCount(4);
  }, [items.length]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 40) {
      setVisibleCount((prev) => Math.min(prev + 4, items.length));
    }
  }, [items.length]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop = scrollTop === 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
    if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
      e.stopPropagation();
    }
  }, []);

  // Soft tinted background for the header badge area (15% opacity)
  const badgeTint = borderColor + "26";

  return (
    <div
      className="flex w-[280px] min-w-[280px] h-full max-h-[calc(100vh-200px)] p-3 pt-5 flex-col items-center gap-4 rounded-2xl bg-[#F7F7F7] flex-shrink-0 overflow-hidden relative shadow-sm"
      style={{ borderTop: `5px solid ${borderColor}` }}
    >
      {/* Header – elegant, no separate white card */}
      <div className="flex items-center gap-2 self-stretch px-2">
        {/* Stage badge: transparent with tint, soft border, no white bg */}
        <div
          className="flex py-[7px] px-3 items-center gap-2 rounded-lg border shadow-sm backdrop-blur-sm transition-all"
          style={{ backgroundColor: badgeTint, borderColor }}
        >
          <Icon name={icon} width={18} height={18} />
          <span className="text-sm font-semibold capitalize text-[#1B1B1B] leading-none tracking-tight">
            {title}
          </span>
          <span
            className="text-white font-inter text-xs font-bold px-2 py-0.5 rounded-full leading-none shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
            style={{ backgroundColor: borderColor }}
          >
            {items.length}
          </span>
        </div>

        {/* Plus button – clean, minimal, with smooth hover */}
        <Button
          variant="icon"
          className="flex p-1.5 items-center rounded-lg border border-transparent text-[#777980] cursor-pointer ml-auto hover:bg-white/70 hover:border-[#D0D5DD] hover:text-[#1B1B1B] transition-all duration-200"
        >
          <Plus size={18} />
        </Button>
      </div>

      {/* Drop zone */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={(node) => {
              scrollRef.current = node;
              provided.innerRef(node);
            }}
            {...provided.droppableProps}
            onScroll={handleScroll}
            onWheel={handleWheel}
            className={`flex flex-col items-center gap-3 w-full overflow-y-auto flex-1 adm-kanban-scroll rounded-xl transition-colors ${
              snapshot.isDraggingOver
                ? "bg-[#EBF5FF] shadow-[inset_0_0_0_2px_rgba(0,152,232,0.2)]"
                : ""
            }`}
          >
            {items.slice(0, visibleCount).map((lead, index) => (
              <Draggable key={lead.id} draggableId={lead.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`w-full transition-all duration-200 ${
                      snapshot.isDragging
                        ? "z-50 scale-105 rotate-1 shadow-2xl"
                        : ""
                    }`}
                    style={provided.draggableProps.style}
                  >
                    <KanbanCard lead={lead} index={index} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}