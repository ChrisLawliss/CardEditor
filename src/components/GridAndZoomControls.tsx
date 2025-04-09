import React from 'react';
import {
  Box,
  IconButton,
  Slider,
  FormControlLabel,
  Checkbox,
  Typography,
  Tooltip,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import GridOnIcon from '@mui/icons-material/GridOn';
import GridOffIcon from '@mui/icons-material/GridOff';
import SnapToGridIcon from '@mui/icons-material/GridGoldenratio';

interface GridAndZoomControlsProps {
  gridEnabled: boolean;
  snapEnabled: boolean;
  gridSize: number;
  zoom: number;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onGridSizeChange: (size: number) => void;
  onZoomChange: (zoom: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const GridAndZoomControls: React.FC<GridAndZoomControlsProps> = ({
  gridEnabled,
  snapEnabled,
  gridSize,
  zoom,
  onGridToggle,
  onSnapToggle,
  onGridSizeChange,
  onZoomChange,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Toggle Grid">
          <IconButton onClick={onGridToggle}>
            {gridEnabled ? <GridOnIcon /> : <GridOffIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle Snap to Grid">
          <IconButton onClick={onSnapToggle}>
            <SnapToGridIcon color={snapEnabled ? 'primary' : 'inherit'} />
          </IconButton>
        </Tooltip>
        {gridEnabled && (
          <Box sx={{ flex: 1, px: 2 }}>
            <Typography variant="body2" gutterBottom>
              Grid Size
            </Typography>
            <Slider
              value={gridSize}
              onChange={(_, value) => onGridSizeChange(value as number)}
              min={5}
              max={50}
              step={5}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Zoom Out">
          <IconButton onClick={onZoomOut}>
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ flex: 1, px: 2 }}>
          <Typography variant="body2" gutterBottom>
            Zoom: {zoom}%
          </Typography>
          <Slider
            value={zoom}
            onChange={(_, value) => onZoomChange(value as number)}
            min={10}
            max={200}
            step={10}
          />
        </Box>
        <Tooltip title="Zoom In">
          <IconButton onClick={onZoomIn}>
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}; 