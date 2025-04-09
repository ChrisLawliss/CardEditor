import React, { useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Box, Typography } from '@mui/material';
import { DraggableFieldProps, DragTypes, DragItem, GridSettings } from '../types/dnd';

export const DraggableField: React.FC<DraggableFieldProps> = ({
  field,
  onMove,
  onResize,
  gridSettings,
  zoom = 1,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const snapToGrid = useCallback((value: number): number => {
    if (!gridSettings?.snap) return value;
    return Math.round(value / gridSettings.size) * gridSettings.size;
  }, [gridSettings]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field' as DragTypes,
    item: {
      id: field.id,
      type: field.type,
      position: {
        x: field.settings.position.x,
        y: field.settings.position.y,
        width: field.settings.position.width,
        height: field.settings.position.height,
      },
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'field' as DragTypes,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  drag(drop(ref));

  const position = field.settings.position;
  const scaledPosition = {
    x: position.x * zoom,
    y: position.y * zoom,
    width: (position.width || 80) * zoom,
    height: (position.height || 40) * zoom,
  };

  return (
    <Box
      ref={ref}
      sx={{
        position: 'absolute',
        left: scaledPosition.x,
        top: scaledPosition.y,
        width: scaledPosition.width,
        height: scaledPosition.height,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        border: isOver ? '2px dashed' : '1px solid',
        borderColor: isOver ? 'primary.main' : 'divider',
        padding: 1,
        backgroundColor: 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 2,
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="caption" sx={{ mb: 0.5 }}>
        {field.label || field.type}
      </Typography>
      {children}
    </Box>
  );
};

export default DraggableField; 