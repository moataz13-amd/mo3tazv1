import { useState } from 'react';
import type { DragEvent } from 'react';

export function reorderArray<T>(items: T[], from: number, to: number): T[] {
  const result = [...items];
  const [moved] = result.splice(from, 1);
  result.splice(to, 0, moved);
  return result;
}

export interface DragItemProps {
  draggable: true;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDragEnter: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onDragEnd: (e: DragEvent) => void;
}

export function useDragReorder(onMove: (from: number, to: number) => void) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const getDragProps = (index: number): DragItemProps => ({
    draggable: true,
    onDragStart: (e: DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
      setActiveIndex(index);
    },
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (overIndex !== index) setOverIndex(index);
    },
    onDragEnter: (e: DragEvent) => {
      e.preventDefault();
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      const from = activeIndex;
      if (from !== null && from !== index) onMove(from, index);
      setActiveIndex(null);
      setOverIndex(null);
    },
    onDragEnd: () => {
      setActiveIndex(null);
      setOverIndex(null);
    },
  });

  return { getDragProps, activeIndex, overIndex };
}
