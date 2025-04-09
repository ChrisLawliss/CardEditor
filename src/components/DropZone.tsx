import React from 'react';
import { useDrop } from 'react-dnd';
import { Box } from '@mui/material';

interface DropZoneProps {
  children: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({ children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'field',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Box
      ref={drop}
      className="drop-zone"
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: isOver ? 'action.hover' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
    >
      {children}
    </Box>
  );
}; 