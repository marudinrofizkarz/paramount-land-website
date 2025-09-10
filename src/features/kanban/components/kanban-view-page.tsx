"use client";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { SimpleKanbanBoard } from "./simple-kanban-board";

export default function KanbanViewPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <Heading className="text-xl sm:text-2xl">Kanban Board</Heading>
            <p className="text-muted-foreground mt-2">
              Manage your tasks with our interactive Kanban board
            </p>
          </div>
        </div>
        <div className="-mx-4 sm:mx-0">
          <SimpleKanbanBoard />
        </div>
      </div>
    </PageContainer>
  );
}
