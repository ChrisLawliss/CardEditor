import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CardField } from '../types/card';

interface FieldListProps {
  fields: CardField[];
  onEditField: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
}

export const FieldList: React.FC<FieldListProps> = ({
  fields,
  onEditField,
  onDeleteField,
}) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Fields
      </Typography>
      <Divider />
      <List>
        {fields.map((field) => (
          <ListItem
            key={field.id}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={field.label || field.name}
              secondary={`Type: ${field.type}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => onEditField(field.id)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDeleteField(field.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}; 