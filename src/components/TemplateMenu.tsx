import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { CardTemplate } from '../types/card';

interface TemplateMenuProps {
  templates: CardTemplate[];
  onSelectTemplate: (template: CardTemplate) => void;
  onAddTemplate: (template: CardTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export const TemplateMenu: React.FC<TemplateMenuProps> = ({
  templates,
  onSelectTemplate,
  onAddTemplate,
  onDeleteTemplate,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');

  const handleAddTemplate = () => {
    const newTemplate: CardTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription,
      settings: {
        height: 88,
        width: 63,
        bleedWidth: 3,
        safeWidth: 2,
        unit: 'mm'
      },
      fields: [],
    };
    onAddTemplate(newTemplate);
    setNewTemplateName('');
    setNewTemplateDescription('');
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Card Templates
      </Typography>
      <List>
        {templates.map((template) => (
          <ListItem
            key={template.id}
            button
            onClick={() => onSelectTemplate(template)}
          >
            <ListItemText
              primary={template.name}
              secondary={template.description}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTemplate(template.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button
        startIcon={<AddIcon />}
        onClick={() => setIsDialogOpen(true)}
        sx={{ mt: 2 }}
      >
        Add New Template
      </Button>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Create New Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            fullWidth
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={newTemplateDescription}
            onChange={(e) => setNewTemplateDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTemplate} disabled={!newTemplateName}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 