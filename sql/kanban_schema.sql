-- Kanban Board Management Schema

-- Boards table for different kanban boards
CREATE TABLE IF NOT EXISTS KanbanBoards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    userId TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Columns table for kanban columns (To Do, In Progress, Done, etc.)
CREATE TABLE IF NOT EXISTS KanbanColumns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    boardId TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    color TEXT NOT NULL DEFAULT '#6b7280',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (boardId) REFERENCES KanbanBoards(id) ON DELETE CASCADE
);

-- Tasks table for individual tasks
CREATE TABLE IF NOT EXISTS KanbanTasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    columnId TEXT NOT NULL,
    boardId TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
    dueDate TEXT,
    assignedTo TEXT,
    tags TEXT DEFAULT '[]', -- JSON array as text
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (columnId) REFERENCES KanbanColumns(id) ON DELETE CASCADE,
    FOREIGN KEY (boardId) REFERENCES KanbanBoards(id) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES Users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kanban_boards_user_id ON KanbanBoards(userId);
CREATE INDEX IF NOT EXISTS idx_kanban_columns_board_id ON KanbanColumns(boardId);
CREATE INDEX IF NOT EXISTS idx_kanban_columns_order ON KanbanColumns("order");
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_column_id ON KanbanTasks(columnId);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_board_id ON KanbanTasks(boardId);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_order ON KanbanTasks("order");
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_assigned_to ON KanbanTasks(assignedTo);

-- Insert default board and columns for demonstration
INSERT OR IGNORE INTO KanbanBoards (id, title, description, userId) 
VALUES ('default-board', 'My Kanban Board', 'Default kanban board for task management', 'system');

-- Insert default columns
INSERT OR IGNORE INTO KanbanColumns (id, title, boardId, "order", color) 
VALUES 
    ('todo', 'To Do', 'default-board', 1, '#ef4444'),
    ('in-progress', 'In Progress', 'default-board', 2, '#f59e0b'),
    ('review', 'Review', 'default-board', 3, '#3b82f6'),
    ('done', 'Done', 'default-board', 4, '#10b981');

-- Insert some sample tasks
INSERT OR IGNORE INTO KanbanTasks (id, title, description, columnId, boardId, "order", priority) 
VALUES 
    ('task-1', 'Welcome to Kanban', 'This is your first task. You can edit, move, or delete it.', 'todo', 'default-board', 1, 'medium'),
    ('task-2', 'Create your first task', 'Click "Add New Task" to create your own task.', 'todo', 'default-board', 2, 'high'),
    ('task-3', 'Drag and drop tasks', 'You can drag tasks between columns to change their status.', 'in-progress', 'default-board', 1, 'medium'),
    ('task-4', 'Project completed', 'This task is completed and moved to Done column.', 'done', 'default-board', 1, 'low');
