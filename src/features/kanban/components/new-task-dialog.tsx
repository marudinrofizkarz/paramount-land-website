'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTaskStore } from '../utils/store';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function NewTaskDialog() {
  const { addTask, columns, loading } = useTaskStore();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const { title, description, columnId, priority } = Object.fromEntries(formData);

    if (typeof title !== 'string' || !title.trim()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await addTask(
        title.trim(),
        description?.toString() || '',
        columnId?.toString() || columns[0]?.id
      );
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default' size='sm' className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your kanban board. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form
          id='task-form'
          className='grid gap-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='grid gap-2'>
            <Label htmlFor='title'>Task Title *</Label>
            <Input
              id='title'
              name='title'
              placeholder='Enter task title...'
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className='grid gap-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              name='description'
              placeholder='Enter task description...'
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='columnId'>Column</Label>
              <Select name='columnId' defaultValue={columns[0]?.id}>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue placeholder='Select column' />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='priority'>Priority</Label>
              <Select name='priority' defaultValue='medium'>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue placeholder='Select priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                  <SelectItem value='urgent'>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button 
            type='button' 
            variant='outline' 
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type='submit' 
            form='task-form'
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
