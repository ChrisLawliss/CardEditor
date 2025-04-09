import { ReactNode } from 'react';

export interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
}

export interface FieldStyle {
  showLabel?: boolean;
  labelStyle?: {
    fontSize?: string;
    color?: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
  };
}

export interface FieldSettings {
  position: Position;
  style?: FieldStyle;
}

export interface DraggableField {
  id: string;
  type: string;
  label?: string;
  settings: FieldSettings;
  [key: string]: any;
}

export interface DragItem {
  id: string;
  type: string;
  position: Position;
}

export interface DropResult {
  id: string;
  position: Position;
}

export interface GridSettings {
  enabled: boolean;
  size: number;
  snap: boolean;
}

export interface DropZoneProps {
  onDrop: (result: DropResult) => void;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  gridSettings?: GridSettings;
  zoom?: number;
}

export interface DraggableFieldProps {
  field: DraggableField;
  onMove: (id: string, position: Position) => void;
  onResize?: (id: string, width: number, height: number) => void;
  gridSettings?: GridSettings;
  zoom?: number;
  children?: ReactNode;
}

export type DragTypes = 'field'; 