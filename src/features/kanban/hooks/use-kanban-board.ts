"use client";

import { useEffect, useState } from "react";
import { useTaskStore } from "../utils/store";

export function useKanbanBoard() {
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    columns,
    tasks,
    currentBoard,
    loading,
    loadBoardData,
    setCurrentBoard,
    moveTask,
    addTask,
  } = useTaskStore();

  useEffect(() => {
    // Wait for zustand hydration
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    isHydrated,
    columns,
    tasks,
    currentBoard,
    loading,
    loadBoardData,
    setCurrentBoard,
    moveTask,
    addTask,
  };
}
