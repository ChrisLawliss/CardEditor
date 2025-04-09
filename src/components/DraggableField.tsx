import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Box, Paper, Typography } from '@mui/material';
import { CardField } from '../types/card';

interface GridSettings {
  enabled: boolean;
  size: number;
  snap: boolean;
}

interface DraggableFieldProps {
  field: CardField;
  onMove: (fieldId: string, x: number, y: number) => void;
  onResize: (fieldId: string, width: number, height: number) => void;
  gridSettings: GridSettings;
}

export const DraggableField: React.FC<DraggableFieldProps> = ({ field, onMove, onResize, gridSettings }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const fieldRef = useRef<HTMLDivElement>(null);

  const snapToGrid = (value: number): number => {
    if (!gridSettings.snap) return value;
    return Math.round(value / gridSettings.size) * gridSettings.size;
  };

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'field',
    item: { 
      id: field.id, 
      type: field.type,
      x: field.settings.position.x,
      y: field.settings.position.y,
      width: field.settings.position.width,
      height: field.settings.position.height
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('resize-handle')) {
      setIsResizing(true);
      setStartX(e.clientX);
      setStartY(e.clientY);
      setStartWidth(field.settings.position.width || 80);
      setStartHeight(field.settings.position.height || 40);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && fieldRef.current) {
      const width = snapToGrid(startWidth + (e.clientX - startX));
      const height = snapToGrid(startHeight + (e.clientY - startY));
      // Ensure minimum size
      onResize(field.id, Math.max(40, width), Math.max(20, height));
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, startX, startY, startWidth, startHeight]);

  return (
    <Box
      ref={drag}
      component={Paper}
      elevation={isDragging ? 4 : 1}
      sx={{
        position: 'absolute',
        left: snapToGrid(field.settings.position.x || 0),
        top: snapToGrid(field.settings.position.y || 0),
        width: snapToGrid(field.settings.position.width || 80),
        height: snapToGrid(field.settings.position.height || 40),
        padding: 1,
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: 'background.paper',
        '&:hover': {
          elevation: 2,
          outline: '2px solid',
          outlineColor: 'primary.main',
        },
        touchAction: 'none',
        userSelect: 'none',
        transition: 'opacity 0.2s, box-shadow 0.2s',
      }}
      onMouseDown={handleMouseDown}
    >
      <Box
        ref={fieldRef}
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography variant="caption" display="block" gutterBottom>
          {field.label}
        </Typography>
        {renderFieldPreview(field)}
        <Box
          className="resize-handle"
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '16px',
            height: '16px',
            backgroundColor: 'primary.main',
            cursor: 'nwse-resize',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            pointerEvents: 'auto',
          }}
        />
      </Box>
    </Box>
  );
};

const renderFieldPreview = (field: CardField) => {
  switch (field.type) {
    case 'text':
      return (
        <Box
          sx={{
            width: '100%',
            height: '32px',
            border: '1px solid #ccc',
            borderRadius: 1,
            backgroundColor: '#f8f8f8',
          }}
        />
      );
    case 'number':
      return (
        <Box
          sx={{
            width: '100%',
            height: '32px',
            border: '1px solid #ccc',
            borderRadius: 1,
            backgroundColor: '#f8f8f8',
          }}
        />
      );
    case 'select':
      return (
        <Box
          sx={{
            width: '100%',
            height: '32px',
            border: '1px solid #ccc',
            borderRadius: 1,
            backgroundColor: '#f8f8f8',
            display: 'flex',
            alignItems: 'center',
            px: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Select...
          </Typography>
        </Box>
      );
    case 'checkbox':
      return (
        <Box
          sx={{
            width: '18px',
            height: '18px',
            border: '1px solid #ccc',
            borderRadius: 0.5,
            backgroundColor: '#f8f8f8',
          }}
        />
      );
    case 'textarea':
      return (
        <Box
          sx={{
            width: '100%',
            height: '64px',
            border: '1px solid #ccc',
            borderRadius: 1,
            backgroundColor: '#f8f8f8',
          }}
        />
      );
    case 'image':
      return (
        <Box
          sx={{
            width: '100%',
            height: '100px',
            border: '1px solid #ccc',
            borderRadius: 1,
            backgroundColor: '#f8f8f8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Image Upload
          </Typography>
        </Box>
      );
    default:
      return null;
  }
}; 