import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { KanbanBoard } from './kanban-board';
import NewTaskDialog from './new-task-dialog';

export default function KanbanViewPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <Heading 
            title="Kanban" 
            description="Manage tasks by dnd" 
            className="text-xl sm:text-2xl"
          />
          <NewTaskDialog />
        </div>
        <div className="-mx-4 sm:mx-0">
          <KanbanBoard />
        </div>
      </div>
    </PageContainer>
  );
}
