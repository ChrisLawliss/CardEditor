import React from 'react';
import {
  Box,
  Paper,
  Typography,
  styled,
} from '@mui/material';
import { CardTemplate, CardData, Position, FieldStyle } from '../types/card';

interface CardPreviewProps {
  template: CardTemplate;
  data: CardData;
}

interface PositionedElementProps {
  position: Position;
  children: React.ReactNode;
}

const CardContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  background: 'white',
}));

const PositionedElement: React.FC<PositionedElementProps> = ({ position, children }) => {
  const style = {
    position: 'absolute' as const,
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: position.width ? `${position.width}%` : 'auto',
    height: position.height ? `${position.height}%` : 'auto',
    transform: position.rotation ? `rotate(${position.rotation}deg)` : 'none',
    zIndex: position.zIndex || 1,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return <Box sx={style}>{children}</Box>;
};

const CardImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const renderLabel = (label: string, style?: FieldStyle['labelStyle']) => {
  if (!style) return null;

  const labelStyle = {
    fontSize: style.fontSize || '12px',
    color: style.color || '#666',
    marginBottom: style.position === 'top' ? '4px' : '0',
    marginRight: style.position === 'left' ? '8px' : '0',
  };

  return (
    <Typography variant="caption" style={labelStyle}>
      {label}:
    </Typography>
  );
};

export const CardPreview: React.FC<CardPreviewProps> = ({ template, data }) => {
  const { settings } = template;
  const containerStyle = {
    width: `${settings.width}${settings.unit}`,
    height: `${settings.height}${settings.unit}`,
    padding: `${settings.bleedWidth}${settings.unit}`,
  };

  const renderFieldValue = (field: typeof template.fields[0]) => {
    const value = data[field.name];
    const fieldStyle = field.settings.style || {};

    const valueStyle = {
      fontSize: fieldStyle.fontSize,
      fontFamily: fieldStyle.fontFamily,
      color: fieldStyle.color,
      textAlign: fieldStyle.textAlign as any,
      fontWeight: fieldStyle.fontWeight,
      width: '100%',
    };

    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <Typography style={valueStyle}>
            {value as string}
          </Typography>
        );
      case 'number':
        return (
          <Typography style={valueStyle}>
            {value as number}
          </Typography>
        );
      case 'select':
        return (
          <Typography style={valueStyle}>
            {value as string}
          </Typography>
        );
      case 'checkbox':
        return (
          <Typography style={valueStyle}>
            {value ? '✓' : '✗'}
          </Typography>
        );
      case 'image':
        if (value instanceof File) {
          return <CardImage src={URL.createObjectURL(value)} alt={field.label} />;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <CardContainer elevation={3} style={containerStyle}>
        {template.fields.map((field) => {
          const { position, style } = field.settings;
          
          return (
            <PositionedElement key={field.id} position={position}>
              {style?.showLabel && renderLabel(field.label, style.labelStyle)}
              {renderFieldValue(field)}
            </PositionedElement>
          );
        })}
      </CardContainer>
    </Box>
  );
}; 