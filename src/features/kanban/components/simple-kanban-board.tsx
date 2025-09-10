"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskStore } from "../utils/store";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { AddTaskDialog } from "./add-task-dialog";

export function SimpleKanbanBoard() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const {
    columns,
    tasks,
    currentBoard,
    loading,
    loadBoardData,
    setCurrentBoard,
  } = useTaskStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && user && !currentBoard) {
      setCurrentBoard({
        id: "default-board",
        title: "My Kanban Board",
        description: "Default kanban board for task management",
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [isClient, user, currentBoard, setCurrentBoard]);

  useEffect(() => {
    if (currentBoard && isClient) {
      loadBoardData(currentBoard.id);
    }
  }, [currentBoard, isClient, loadBoardData]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Loading kanban data...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
          <Card key={column.id} className="min-w-[300px] max-w-[350px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {column.title}
                </CardTitle>
                <AddTaskDialog columnId={column.id} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks
                .filter((task) => task.columnId === column.id)
                .map((task) => (
                  <Card key={task.id} className="p-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="capitalize">{task.priority}</span>
                        <span>
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              {tasks.filter((task) => task.columnId === column.id).length ===
                0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No tasks yet. Click + to add a task.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>Board: {currentBoard?.title}</p>
        <p>Columns: {columns.length}</p>
        <p>Tasks: {tasks.length}</p>
        <div className="mt-2">
          {columns.map((col) => (
            <div key={col.id} className="text-xs">
              {col.title}: {tasks.filter((t) => t.columnId === col.id).length}{" "}
              tasks
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
