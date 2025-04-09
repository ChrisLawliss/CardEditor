import React, { useRef, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { Box } from '@mui/material';
import { DropZoneProps, DragTypes, GridSettings, DropResult } from '../types/dnd';

export const DropZone: React.FC<DropZoneProps> = ({
  onDrop,
  children,
  className = '',
  style = {},
  gridSettings,
  zoom = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const snapToGrid = useCallback((value: number): number => {
    if (!gridSettings?.snap) return value;
    return Math.round(value / gridSettings.size) * gridSettings.size;
  }, [gridSettings]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'field' as DragTypes,
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = snapToGrid((offset.x - rect.left) / zoom);
      const y = snapToGrid((offset.y - rect.top) / zoom);

      const result: DropResult = {
        id: item.id,
        position: {
          x,
          y,
          width: item.position.width,
          height: item.position.height,
        },
      };

      onDrop(result);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  drop(containerRef);

  return (
    <Box
      ref={containerRef}
      className={`drop-zone ${className}`}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: isOver ? 'action.hover' : 'background.paper',
        transition: 'background-color 0.2s ease',
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
        border: '2px dashed',
        borderColor: isOver ? 'primary.main' : 'divider',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

export default DropZone; 