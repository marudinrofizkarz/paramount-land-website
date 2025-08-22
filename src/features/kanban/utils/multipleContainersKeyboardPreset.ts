import { KeyboardCoordinateGetter } from '@dnd-kit/core';

/**
 * Custom keyboard coordinate getter for multiple containers
 * Allows keyboard navigation between different columns in Kanban board
 */
export const coordinateGetter: KeyboardCoordinateGetter = (event, { context: { active, droppableRects, droppableContainers, collisionRect } }) => {
  if (event.code === 'ArrowDown') {
    return { x: 0, y: 25 };
  }
  if (event.code === 'ArrowUp') {
    return { x: 0, y: -25 };
  }
  if (event.code === 'ArrowRight') {
    return { x: 25, y: 0 };
  }
  if (event.code === 'ArrowLeft') {
    return { x: -25, y: 0 };
  }

  return undefined;
};