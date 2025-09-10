"use client";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Task, useTaskStore, KanbanColumn } from "../utils/store";
import { hasDraggableData } from "../utils";
import {
  Announcements,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { KeyboardSensor } from "@dnd-kit/core";
import { BoardColumn } from "./board-column";
import { TaskCard } from "./task-card";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useKanbanBoard } from "../hooks/use-kanban-board";

export function KanbanBoard() {
  const { user } = useAuth();
  const {
    isHydrated,
    columns,
    tasks,
    currentBoard,
    loading,
    loadBoardData,
    setCurrentBoard,
    moveTask,
  } = useKanbanBoard();

  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const pickedUpTaskColumn = useRef<string>("todo");
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor) // Tanpa coordinateGetter custom
  );

  useEffect(() => {
    // Load default board data when component mounts and user is available
    if (!currentBoard && user && isHydrated) {
      setCurrentBoard({
        id: "default-board",
        title: "My Kanban Board",
        description: "Default kanban board for task management",
        userId: user?.id || "system",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [user, currentBoard, setCurrentBoard, isHydrated]);

  useEffect(() => {
    if (currentBoard && isHydrated && !loading) {
      console.log("Loading board data for:", currentBoard.id);
      loadBoardData(currentBoard.id);
    }
  }, [currentBoard, isHydrated, loadBoardData, loading]);

  // Debug log
  useEffect(() => {
    console.log("Kanban Board State:", {
      isHydrated,
      loading,
      currentBoard: currentBoard?.id,
      columnsCount: columns.length,
      tasksCount: tasks.length,
      user: user?.id,
    });
  }, [isHydrated, loading, currentBoard, columns.length, tasks.length, user]);

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: string) {
    const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.columnId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );
        return `Picked up Task ${active.data.current.task.title} at position: ${
          taskPosition + 1
        } of ${tasksInColumn.length} in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (
          active.data.current.task.columnId !== over.data.current.task.columnId
        ) {
          const column = columns.find(
            (col) => col.id === over.data.current?.task.columnId
          );
          return `Task ${
            active.data.current.task.title
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        }`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = "todo";
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (
          active.data.current.task.columnId !== over.data.current.task.columnId
        ) {
          const column = columns.find(
            (col) => col.id === over.data.current?.task.columnId
          );
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        }`;
      }
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = "todo";
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  if (!isHydrated) {
    return (
      <div className="flex gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1">
            <Skeleton className="h-8 w-full mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1">
            <Skeleton className="h-8 w-full mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 px-2 sm:px-0">
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.columnId === col.id)}
            />
          ))}
        </SortableContext>
      </div>
      {isHydrated &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column as KanbanColumn);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveATask = activeData?.type === "Task";

    if (!isActiveATask) return;

    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverATask) {
      const activeTask = activeData.task;
      const overTask = over.data.current?.task;

      if (activeTask.columnId !== overTask.columnId) {
        // Moving to different column
        const overTasks = tasks.filter(
          (task) => task.columnId === overTask.columnId
        );
        const overIndex = overTasks.findIndex(
          (task) => task.id === overTask.id
        );
        await moveTask(activeTask.id, overTask.columnId, overIndex + 1);
      } else {
        // Reordering within same column
        const columnTasks = tasks.filter(
          (task) => task.columnId === activeTask.columnId
        );
        const activeIndex = columnTasks.findIndex(
          (task) => task.id === activeTask.id
        );
        const overIndex = columnTasks.findIndex(
          (task) => task.id === overTask.id
        );

        if (activeIndex !== overIndex) {
          await moveTask(activeTask.id, activeTask.columnId, overIndex + 1);
        }
      }
    }

    if (isActiveATask && isOverAColumn) {
      const activeTask = activeData.task;
      const overColumn = over.data.current?.column;

      if (activeTask.columnId !== overColumn.id) {
        const overTasks = tasks.filter(
          (task) => task.columnId === overColumn.id
        );
        await moveTask(activeTask.id, overColumn.id, overTasks.length + 1);
      }
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;

    // Handle dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === String(activeId));
      const overIndex = tasks.findIndex((t) => t.id === String(overId));

      const activeTask = tasks[activeIndex];
      const overTask = tasks[overIndex];

      if (activeTask && overTask && activeTask.columnId !== overTask.columnId) {
        const newTasks = [...tasks];
        newTasks[activeIndex] = { ...activeTask, columnId: overTask.columnId };
        useTaskStore
          .getState()
          .setTasks(arrayMove(newTasks, activeIndex, overIndex));
      }
    }

    const isOverAColumn = overData?.type === "Column";

    // Handle dropping a Task over a Column
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === String(activeId));
      const activeTask = tasks[activeIndex];
      const overColumn = overData.column;

      if (activeTask && activeTask.columnId !== String(overColumn.id)) {
        const newTasks = [...tasks];
        newTasks[activeIndex] = {
          ...activeTask,
          columnId: String(overColumn.id),
        };
        useTaskStore.getState().setTasks(newTasks);
      }
    }
  }
}
