import { useState, useCallback } from 'react';

interface GridSettings {
  enabled: boolean;
  size: number;
  snap: boolean;
}

export const useGridAndZoom = () => {
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    enabled: true,
    size: 20,
    snap: true,
  });

  const [zoom, setZoom] = useState(100);

  const handleGridToggle = useCallback(() => {
    setGridSettings(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  }, []);

  const handleGridSizeChange = useCallback((size: number) => {
    setGridSettings(prev => ({
      ...prev,
      size,
    }));
  }, []);

  const handleSnapToggle = useCallback(() => {
    setGridSettings(prev => ({
      ...prev,
      snap: !prev.snap,
    }));
  }, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(Math.max(10, Math.min(200, newZoom)));
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(200, prev + 10));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(10, prev - 10));
  }, []);

  const snapToGrid = useCallback((value: number): number => {
    if (!gridSettings.enabled || !gridSettings.snap) {
      return value;
    }
    return Math.round(value / gridSettings.size) * gridSettings.size;
  }, [gridSettings.enabled, gridSettings.snap, gridSettings.size]);

  return {
    gridSettings,
    zoom,
    handleGridToggle,
    handleGridSizeChange,
    handleSnapToggle,
    handleZoomChange,
    handleZoomIn,
    handleZoomOut,
    snapToGrid,
  };
}; 