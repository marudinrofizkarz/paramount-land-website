"use server";

import { z } from "zod";
import db, { query, getMany, getOne, insert, update, remove } from "@/lib/database";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid';

// Schemas
// Perbaiki TaskSchema untuk menangani null values
const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  columnId: z.string(),
  boardId: z.string(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  dueDate: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  tags: z.array(z.string()).optional()
});

const ColumnSchema = z.object({
  title: z.string().min(1, "Title is required"),
  boardId: z.string(),
  color: z.string().optional()
});

const BoardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  userId: z.string()
});

// Board Actions
export async function createBoard(formData: FormData) {
  try {
    const data = BoardSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      userId: formData.get("userId")
    });

    const id = uuidv4();
    await insert(
      "INSERT INTO KanbanBoards (id, title, description, userId) VALUES (?, ?, ?, ?)",
      [id, data.title, data.description || null, data.userId]
    );

    revalidatePath("/dashboard/kanban");
    return { success: true, id };
  } catch (error) {
    console.error("Error creating board:", error);
    return { success: false, error: "Failed to create board" };
  }
}

export async function getBoards(userId: string) {
  try {
    const boards = await getMany(
      "SELECT * FROM KanbanBoards WHERE userId = ? OR userId = 'system' ORDER BY createdAt DESC",
      [userId]
    );
    return boards;
  } catch (error) {
    console.error("Error fetching boards:", error);
    return [];
  }
}

// Column Actions
export async function createColumn(formData: FormData) {
  try {
    const data = ColumnSchema.parse({
      title: formData.get("title"),
      boardId: formData.get("boardId"),
      color: formData.get("color")
    });

    const id = uuidv4();
    const maxOrder = await getOne(
      "SELECT MAX(\"order\") as maxOrder FROM KanbanColumns WHERE boardId = ?",
      [data.boardId]
    );
    const order = (maxOrder?.maxOrder || 0) + 1;

    await insert(
      "INSERT INTO KanbanColumns (id, title, boardId, \"order\", color) VALUES (?, ?, ?, ?, ?)",
      [id, data.title, data.boardId, order, data.color || '#6b7280']
    );

    revalidatePath("/dashboard/kanban");
    return { success: true, id };
  } catch (error) {
    console.error("Error creating column:", error);
    return { success: false, error: "Failed to create column" };
  }
}

export async function getColumns(boardId: string) {
  try {
    const columns = await getMany(
      "SELECT * FROM KanbanColumns WHERE boardId = ? ORDER BY \"order\" ASC",
      [boardId]
    );
    return columns;
  } catch (error) {
    console.error("Error fetching columns:", error);
    return [];
  }
}

export async function updateColumnOrder(columnId: string, newOrder: number) {
  try {
    await update(
      "UPDATE KanbanColumns SET \"order\" = ?, updatedAt = datetime('now') WHERE id = ?",
      [newOrder, columnId]
    );
    revalidatePath("/dashboard/kanban");
    return { success: true };
  } catch (error) {
    console.error("Error updating column order:", error);
    return { success: false, error: "Failed to update column order" };
  }
}

// Tambahkan fungsi updateColumn yang hilang
export async function updateColumn(columnId: string, updates: { title?: string; color?: string }) {
  try {
    const setClause = [];
    const values = [];
    
    if (updates.title !== undefined) {
      setClause.push('title = ?');
      values.push(updates.title);
    }
    
    if (updates.color !== undefined) {
      setClause.push('color = ?');
      values.push(updates.color);
    }
    
    if (setClause.length === 0) {
      return { success: true }; // No updates needed
    }
    
    setClause.push('updatedAt = datetime(\'now\')');
    values.push(columnId);
    
    await update(
      `UPDATE KanbanColumns SET ${setClause.join(', ')} WHERE id = ?`,
      values
    );
    
    revalidatePath("/dashboard/kanban");
    return { success: true };
  } catch (error) {
    console.error("Error updating column:", error);
    return { success: false, error: "Failed to update column" };
  }
}

// Task Actions
export async function createTask(formData: FormData) {
  try {
    const data = TaskSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      columnId: formData.get("columnId"),
      boardId: formData.get("boardId"),
      priority: formData.get("priority"),
      dueDate: formData.get("dueDate"),
      assignedTo: formData.get("assignedTo"),
      tags: formData.get("tags") ? JSON.parse(formData.get("tags") as string) : []
    });

    const id = uuidv4();
    const maxOrder = await getOne(
      "SELECT MAX(\"order\") as maxOrder FROM KanbanTasks WHERE columnId = ?",
      [data.columnId]
    );
    const order = (maxOrder?.maxOrder || 0) + 1;

    await insert(
      "INSERT INTO KanbanTasks (id, title, description, columnId, boardId, \"order\", priority, dueDate, assignedTo, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        data.title,
        data.description || null,
        data.columnId,
        data.boardId,
        order,
        data.priority,
        data.dueDate || null,
        data.assignedTo || null,
        JSON.stringify(data.tags || [])
      ]
    );

    revalidatePath("/dashboard/kanban");
    return { success: true, id };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function getTasks(boardId: string) {
  try {
    const tasks = await getMany(
      "SELECT * FROM KanbanTasks WHERE boardId = ? ORDER BY \"order\" ASC",
      [boardId]
    );
    return tasks.map(task => ({
      ...task,
      tags: (() => {
        if (!task.tags) return [];
        if (Array.isArray(task.tags)) return task.tags;
        if (typeof task.tags === 'string') {
          try {
            return JSON.parse(task.tags);
          } catch {
            return [];
          }
        }
        return [];
      })()
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function updateTaskStatus(taskId: string, newColumnId: string, newOrder: number) {
  try {
    await update(
      "UPDATE KanbanTasks SET columnId = ?, \"order\" = ?, updatedAt = datetime('now') WHERE id = ?",
      [newColumnId, newOrder, taskId]
    );
    revalidatePath("/dashboard/kanban");
    return { success: true };
  } catch (error) {
    console.error("Error updating task status:", error);
    return { success: false, error: "Failed to update task status" };
  }
}

export async function updateTaskOrder(taskId: string, newOrder: number) {
  try {
    await update(
      "UPDATE KanbanTasks SET \"order\" = ?, updatedAt = datetime('now') WHERE id = ?",
      [newOrder, taskId]
    );
    revalidatePath("/dashboard/kanban");
    return { success: true };
  } catch (error) {
    console.error("Error updating task order:", error);
    return { success: false, error: "Failed to update task order" };
  }
}

export async function deleteTask(taskId: string) {
  try {
    await remove("DELETE FROM KanbanTasks WHERE id = ?", [taskId]);
    revalidatePath("/dashboard/kanban");
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

export async function deleteColumn(columnId: string) {
  try {
    // First delete all tasks in the column
    await remove("DELETE FROM KanbanTasks WHERE columnId = ?", [columnId]);
    // Then delete the column
    await remove("DELETE FROM KanbanColumns WHERE id = ?", [columnId]);
    revalidatePath("/dashboard/kanban");
    return { success: true };
  } catch (error) {
    console.error("Error deleting column:", error);
    return { success: false, error: "Failed to delete column" };
  }
}