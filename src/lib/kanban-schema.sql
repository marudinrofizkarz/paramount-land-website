-- Create Kanban Boards table
CREATE TABLE IF NOT EXISTS KanbanBoards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  userId TEXT NOT NULL,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Create Kanban Columns table
CREATE TABLE IF NOT EXISTS KanbanColumns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  boardId TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  color TEXT DEFAULT '#6b7280',
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (boardId) REFERENCES KanbanBoards(id) ON DELETE CASCADE
);

-- Create Kanban Tasks table
CREATE TABLE IF NOT EXISTS KanbanTasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  columnId TEXT NOT NULL,
  boardId TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  dueDate TEXT,
  assignedTo TEXT,
  tags TEXT, -- JSON array of tags
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (columnId) REFERENCES KanbanColumns(id) ON DELETE CASCADE,
  FOREIGN KEY (boardId) REFERENCES KanbanBoards(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kanban_columns_board ON KanbanColumns(boardId);
CREATE INDEX IF NOT EXISTS idx_kanban_columns_order ON KanbanColumns("order");
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_column ON KanbanTasks(columnId);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_board ON KanbanTasks(boardId);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_order ON KanbanTasks("order");
CREATE INDEX IF NOT EXISTS idx_kanban_boards_user ON KanbanBoards(userId);

-- Insert default board and columns
INSERT OR IGNORE INTO KanbanBoards (id, title, description, userId) 
VALUES ('default-board', 'My Kanban Board', 'Default kanban board for task management', 'system');

INSERT OR IGNORE INTO KanbanColumns (id, title, boardId, "order") VALUES 
('todo', 'To Do', 'default-board', 1),
('in-progress', 'In Progress', 'default-board', 2),
('done', 'Done', 'default-board', 3);