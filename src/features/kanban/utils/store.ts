import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { persist } from 'zustand/middleware';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Column } from '../components/board-column';
import { 
  createTask, 
  getTasks, 
  getColumns, 
  updateTaskStatus, 
  updateTaskOrder,
  deleteTask,
  createColumn,
  deleteColumn,
  updateColumn  // Tambahkan import ini
} from '@/lib/kanban-actions';

export type Status = 'todo' | 'in-progress' | 'done';

export type Task = {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  boardId: string;
  order: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type KanbanColumn = {
  id: string;
  title: string;
  boardId: string;
  order: number;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type Board = {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type State = {
  tasks: Task[];
  columns: KanbanColumn[];
  currentBoard: Board | null;
  loading: boolean;
  draggedTask: string | null;
};

export type Actions = {
  // Task actions
  addTask: (title: string, description?: string, columnId?: string) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  moveTask: (taskId: string, newColumnId: string, newOrder: number) => Promise<void>;
  
  // Column actions
  addColumn: (title: string, color?: string) => Promise<void>;
  removeColumn: (columnId: string) => Promise<void>;
  updateColumn: (columnId: string, updates: Partial<KanbanColumn>) => Promise<void>;
  
  // Board actions
  setCurrentBoard: (board: Board) => void;
  loadBoardData: (boardId: string) => Promise<void>;
  
  // UI state
  setLoading: (loading: boolean) => void;
  dragTask: (id: string | null) => void;
  
  // Legacy compatibility
  setTasks: (tasks: Task[]) => void;
  setCols: (columns: KanbanColumn[]) => void;
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      tasks: [],
      columns: [],
      currentBoard: null,
      loading: false,
      draggedTask: null,

      // Task actions
      addTask: async (title: string, description?: string, columnId?: string) => {
        const { currentBoard, columns } = get();
        if (!currentBoard) return;
        
        const targetColumnId = columnId || columns[0]?.id || 'todo';
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description || '');
        formData.append('columnId', targetColumnId);
        formData.append('boardId', currentBoard.id);
        formData.append('priority', 'medium');
        
        const result = await createTask(formData);
        if (result.success) {
          await get().loadBoardData(currentBoard.id);
        }
      },

      removeTask: async (taskId: string) => {
        const result = await deleteTask(taskId);
        if (result.success) {
          const { currentBoard } = get();
          if (currentBoard) {
            await get().loadBoardData(currentBoard.id);
          }
        }
      },

      updateTask: async (taskId: string, updates: Partial<Task>) => {
        // Implementation for updating task details
        const { currentBoard } = get();
        if (currentBoard) {
          await get().loadBoardData(currentBoard.id);
        }
      },

      moveTask: async (taskId: string, newColumnId: string, newOrder: number) => {
        const result = await updateTaskStatus(taskId, newColumnId, newOrder);
        if (result.success) {
          const { currentBoard } = get();
          if (currentBoard) {
            await get().loadBoardData(currentBoard.id);
          }
        }
      },

      // Column actions
      addColumn: async (title: string, color?: string) => {
        const { currentBoard } = get();
        if (!currentBoard) return;
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('boardId', currentBoard.id);
        formData.append('color', color || '#6b7280');
        
        const result = await createColumn(formData);
        if (result.success) {
          await get().loadBoardData(currentBoard.id);
        }
      },

      removeColumn: async (columnId: string) => {
        const result = await deleteColumn(columnId);
        if (result.success) {
          const { currentBoard } = get();
          if (currentBoard) {
            await get().loadBoardData(currentBoard.id);
          }
        }
      },

      updateColumn: async (columnId: string, updates: Partial<KanbanColumn>) => {
        // Implementasi yang diperbaiki
        const result = await updateColumn(columnId, updates);
        if (result.success) {
          const { currentBoard } = get();
          if (currentBoard) {
            await get().loadBoardData(currentBoard.id);
          }
        }
      },

      // Board actions
      setCurrentBoard: (board: Board) => {
        set({ currentBoard: board });
      },

      loadBoardData: async (boardId: string) => {
        set({ loading: true });
        try {
          const [tasks, columns] = await Promise.all([
            getTasks(boardId),
            getColumns(boardId)
          ]);
          set({ tasks, columns, loading: false });
        } catch (error) {
          console.error('Error loading board data:', error);
          set({ loading: false });
        }
      },

      // UI state
      setLoading: (loading: boolean) => set({ loading }),
      dragTask: (id: string | null) => set({ draggedTask: id }),
      
      // Legacy compatibility
      setTasks: (tasks: Task[]) => set({ tasks }),
      setCols: (columns: KanbanColumn[]) => set({ columns })
    }),
    { 
      name: 'kanban-store', 
      skipHydration: true,
      partialize: (state) => ({ currentBoard: state.currentBoard })
    }
  )
);
