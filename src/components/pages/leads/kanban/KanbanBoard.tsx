"use client";

import { useRef, useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { KANBAN_STAGES } from "@/configs/kanban.config";
import { KanbanColumn } from "@/components/pages/leads/kanban/KanbanColumn";
import type { Lead, LeadStage } from "@/types/leads";

interface KanbanBoardProps {
  leads: Lead[];
  onStageChange: (id: string, stage: LeadStage) => void;
}

export function KanbanBoard({ leads, onStageChange }: KanbanBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  const getLeadsByStage = (stage: LeadStage): Lead[] =>
    leads.filter((l) => l.stage === stage);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStage = destination.droppableId as LeadStage;
    const lead = leads.find((l) => l.id === draggableId);
    if (!lead || lead.stage === newStage) return;
    onStageChange(draggableId, newStage);
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const target = e.target as HTMLElement;
    const scrollableParent = target.closest(".adm-kanban-scroll");
    if (scrollableParent) return; // let column scroll naturally
    if (!boardRef.current) return;
    e.preventDefault();
    boardRef.current.scrollLeft += e.deltaY;
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        ref={boardRef}
        onWheel={handleWheel}
        className="flex gap-4 overflow-x-auto pb-4 adm-kanban-board h-full"
      >
        {KANBAN_STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            id={stage.id}
            title={stage.title}
            borderColor={stage.borderColor}
            stageColor={stage.stageColor}
            icon={stage.icon}
            items={getLeadsByStage(stage.id)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}