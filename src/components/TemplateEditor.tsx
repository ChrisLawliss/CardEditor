import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControlLabel,
  Checkbox,
  Chip,
  Paper,
  Typography,
  Divider,
  Slider,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SettingsIcon from '@mui/icons-material/Settings';
import { CardTemplate, CardField, FieldType, Position } from '../types/card';
import { DraggableField } from './DraggableField';
import { ZoomIn, ZoomOut } from '@mui/icons-material';

interface TemplateEditorProps {
  template: CardTemplate;
  onUpdateTemplate: (template: CardTemplate) => void;
}

interface FieldDialogState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  fieldId?: string;
}

interface TemplateSettingsDialogState {
  isOpen: boolean;
}

interface GridSettings {
  enabled: boolean;
  size: number;
  snap: boolean;
}

const exampleTemplate: CardTemplate = {
  id: 'example-template',
  name: 'Example Template',
  description: 'A comprehensive example template for testing',
  settings: {
    width: 750,
    height: 1050,
    bleedWidth: 3,
    safeWidth: 2,
    unit: 'px'
  },
  fields: [
    {
      id: 'title',
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      settings: {
        position: {
          x: 100,
          y: 50,
          width: 550,
          height: 40
        },
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center'
        }
      }
    },
    {
      id: 'subtitle',
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      settings: {
        position: {
          x: 100,
          y: 100,
          width: 550,
          height: 30
        },
        style: {
          fontSize: '18px',
          textAlign: 'center',
          color: '#666666'
        }
      }
    },
    {
      id: 'name',
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      settings: {
        position: {
          x: 100,
          y: 200,
          width: 300,
          height: 40
        }
      }
    },
    {
      id: 'email',
      name: 'email',
      type: 'text',
      label: 'Email Address',
      required: true,
      settings: {
        position: {
          x: 100,
          y: 260,
          width: 300,
          height: 40
        }
      }
    },
    {
      id: 'phone',
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      settings: {
        position: {
          x: 100,
          y: 320,
          width: 300,
          height: 40
        }
      }
    },
    {
      id: 'address',
      name: 'address',
      type: 'textarea',
      label: 'Address',
      settings: {
        position: {
          x: 100,
          y: 380,
          width: 300,
          height: 100
        }
      }
    },
    {
      id: 'membership',
      name: 'membership',
      type: 'select',
      label: 'Membership Type',
      required: true,
      settings: {
        position: {
          x: 450,
          y: 200,
          width: 200,
          height: 40
        }
      },
      options: ['Basic', 'Premium', 'VIP']
    },
    {
      id: 'newsletter',
      name: 'newsletter',
      type: 'checkbox',
      label: 'Subscribe to Newsletter',
      settings: {
        position: {
          x: 450,
          y: 260,
          width: 200,
          height: 30
        }
      }
    },
    {
      id: 'photo',
      name: 'photo',
      type: 'image',
      label: 'Profile Photo',
      settings: {
        position: {
          x: 450,
          y: 320,
          width: 200,
          height: 200
        }
      }
    },
    {
      id: 'signature',
      name: 'signature',
      type: 'image',
      label: 'Signature',
      settings: {
        position: {
          x: 100,
          y: 500,
          width: 300,
          height: 100
        }
      }
    },
    {
      id: 'date',
      name: 'date',
      type: 'text',
      label: 'Date',
      settings: {
        position: {
          x: 450,
          y: 500,
          width: 200,
          height: 40
        }
      }
    }
  ]
};

const DropZone: React.FC<{ onDrop: (item: any, x: number, y: number) => void }> = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'field',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const dropZone = document.querySelector('.drop-zone');
        if (dropZone) {
          const rect = dropZone.getBoundingClientRect();
          const x = offset.x - rect.left;
          const y = offset.y - rect.top;
          onDrop(item, x, y);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Box
      ref={drop}
      className="drop-zone"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
        transition: 'background-color 0.2s',
      }}
    >
      {children}
    </Box>
  );
};

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template = exampleTemplate,
  onUpdateTemplate,
}) => {
  const [dialogState, setDialogState] = useState<FieldDialogState>({
    isOpen: false,
    mode: 'add'
  });
  const [settingsDialogState, setSettingsDialogState] = useState<TemplateSettingsDialogState>({
    isOpen: false
  });
  const [editingField, setEditingField] = useState<Partial<CardField>>({
    type: 'text',
    required: false,
    settings: {
      position: {
        x: 10,
        y: 10,
        width: 80,
        zIndex: 1
      },
      style: {
        showLabel: true,
        labelStyle: {
          fontSize: '12px',
          color: '#666',
          position: 'top'
        }
      }
    }
  });
  const [newOption, setNewOption] = useState('');
  const [templateSize, setTemplateSize] = useState({
    width: template.settings?.width || 750,
    height: template.settings?.height || 1050
  });
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    enabled: true,
    size: 4,
    snap: true,
  });
  const [selectedField, setSelectedField] = useState<CardField | null>(null);
  const [zoom, setZoom] = useState(2);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleOpenSettingsDialog = () => {
    setSettingsDialogState({ isOpen: true });
  };

  const handleCloseSettingsDialog = () => {
    setSettingsDialogState({ isOpen: false });
  };

  const handleSaveTemplateSettings = () => {
    const updatedTemplate = {
      ...template,
      settings: {
        ...template.settings,
        width: templateSize.width,
        height: templateSize.height,
      },
    };
    onUpdateTemplate(updatedTemplate);
    handleCloseSettingsDialog();
  };

  const handleOpenDialog = (mode: 'add' | 'edit', fieldId?: string) => {
    if (mode === 'edit' && fieldId) {
      const fieldToEdit = template.fields.find(f => f.id === fieldId);
      if (fieldToEdit) {
        setEditingField(fieldToEdit);
      }
    } else {
      setEditingField({
        type: 'text',
        required: false,
        settings: {
          position: {
            x: 10,
            y: 10,
            width: 80,
            zIndex: 1
          },
          style: {
            showLabel: true,
            labelStyle: {
              fontSize: '12px',
              color: '#666',
              position: 'top'
            }
          }
        }
      });
    }
    setDialogState({ isOpen: true, mode, fieldId });
  };

  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, mode: 'add' });
    setNewOption('');
  };

  const handleSaveField = () => {
    if (!editingField.name || !editingField.label || !editingField.type) return;

    const field: CardField = {
      id: dialogState.mode === 'edit' && dialogState.fieldId ? dialogState.fieldId : `field-${Date.now()}`,
      name: editingField.name,
      label: editingField.label,
      type: editingField.type as FieldType,
      required: editingField.required || false,
      validation: editingField.validation,
      options: editingField.type === 'select' ? editingField.options || [] : undefined,
      defaultValue: editingField.type === 'checkbox' ? false : undefined,
      settings: editingField.settings || {
        position: {
          x: 10,
          y: 10,
          width: 80,
          zIndex: 1
        },
        style: {
          showLabel: true,
          labelStyle: {
            fontSize: '12px',
            color: '#666',
            position: 'top'
          }
        }
      }
    };

    const updatedTemplate = {
      ...template,
      fields: dialogState.mode === 'edit'
        ? template.fields.map(f => f.id === field.id ? field : f)
        : [...template.fields, field],
    };

    onUpdateTemplate(updatedTemplate);
    handleCloseDialog();
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedTemplate = {
      ...template,
      fields: template.fields.filter((field) => field.id !== fieldId),
    };
    onUpdateTemplate(updatedTemplate);
  };

  const handleAddOption = () => {
    if (!newOption) return;
    setEditingField({
      ...editingField,
      options: [...(editingField.options || []), newOption],
    });
    setNewOption('');
  };

  const handleDeleteOption = (option: string) => {
    setEditingField({
      ...editingField,
      options: (editingField.options || []).filter((o) => o !== option),
    });
  };

  const handleFieldMove = useCallback((fieldId: string, x: number, y: number) => {
    const updatedTemplate = {
      ...template,
      fields: template.fields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              settings: {
                ...field.settings,
                position: {
                  ...field.settings.position,
                  x,
                  y,
                },
              },
            }
          : field
      ),
    };
    onUpdateTemplate(updatedTemplate);
  }, [template, onUpdateTemplate]);

  const handleFieldResize = useCallback((fieldId: string, width: number, height: number) => {
    const updatedTemplate = {
      ...template,
      fields: template.fields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              settings: {
                ...field.settings,
                position: {
                  ...field.settings.position,
                  width,
                  height,
                },
              },
            }
          : field
      ),
    };
    onUpdateTemplate(updatedTemplate);
  }, [template, onUpdateTemplate]);

  const handleZoomChange = (event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleDrop = useCallback((item: any, x: number, y: number) => {
    handleFieldMove(item.id, x, y);
  }, [handleFieldMove]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Template Editor</Typography>
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut} size="small">
                <ZoomOut />
              </IconButton>
            </Tooltip>
            <Slider
              value={zoom}
              onChange={handleZoomChange}
              min={0.5}
              max={4}
              step={0.1}
              sx={{ width: 100 }}
            />
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn} size="small">
                <ZoomIn />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ width: '300px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
              >
                Add Field
              </Button>
              <Button
                startIcon={<SettingsIcon />}
                onClick={handleOpenSettingsDialog}
              >
                Template Settings
              </Button>
            </Box>

            <List>
              {template.fields.map((field) => (
                <ListItem
                  key={field.id}
                  sx={{
                    cursor: 'move',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <DragIndicatorIcon sx={{ mr: 1, color: 'action.active' }} />
                  <ListItemText
                    primary={field.label}
                    secondary={`${field.type}${field.required ? ' (required)' : ''}${
                      field.options ? ` [${field.options.join(', ')}]` : ''
                    }`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpenDialog('edit', field.id)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>

          <Paper
            sx={{
              position: 'relative',
              width: `${template.settings?.width * zoom}px`,
              height: `${template.settings?.height * zoom}px`,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundImage: gridSettings.enabled
                ? `linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                   linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)`
                : 'none',
              backgroundSize: `${gridSettings.size * zoom}px ${gridSettings.size * zoom}px`,
              backgroundPosition: 'center',
              backgroundOrigin: 'content-box',
              padding: `${(template.settings?.bleedWidth || 3) * zoom}px`,
              boxSizing: 'border-box',
            }}
          >
            <DropZone onDrop={handleDrop}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                }}
              >
                {template.fields.map((field) => (
                  <DraggableField
                    key={field.id}
                    field={{
                      ...field,
                      settings: {
                        ...field.settings,
                        position: {
                          ...field.settings.position,
                          x: field.settings.position.x * zoom,
                          y: field.settings.position.y * zoom,
                          width: (field.settings.position.width || 80) * zoom,
                          height: (field.settings.position.height || 40) * zoom,
                        }
                      }
                    }}
                    onMove={handleFieldMove}
                    onResize={handleFieldResize}
                    gridSettings={{ ...gridSettings, size: gridSettings.size * zoom }}
                  />
                ))}
              </Box>
            </DropZone>
          </Paper>
        </Box>
      </Box>

      {/* Template Settings Dialog */}
      <Dialog open={settingsDialogState.isOpen} onClose={handleCloseSettingsDialog}>
        <DialogTitle>Template Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Template Size (in pixels)
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Width"
                type="number"
                value={templateSize.width}
                onChange={(e) => setTemplateSize({
                  ...templateSize,
                  width: parseInt(e.target.value) || 750
                })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Height"
                type="number"
                value={templateSize.height}
                onChange={(e) => setTemplateSize({
                  ...templateSize,
                  height: parseInt(e.target.value) || 1050
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Grid Settings
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gridSettings.enabled}
                    onChange={(e) => setGridSettings({
                      ...gridSettings,
                      enabled: e.target.checked
                    })}
                  />
                }
                label="Show Grid"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gridSettings.snap}
                    onChange={(e) => setGridSettings({
                      ...gridSettings,
                      snap: e.target.checked
                    })}
                  />
                }
                label="Snap to Grid"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Grid Size (pixels)"
                type="number"
                value={gridSettings.size}
                onChange={(e) => setGridSettings({
                  ...gridSettings,
                  size: parseInt(e.target.value) || 4
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettingsDialog}>Cancel</Button>
          <Button onClick={handleSaveTemplateSettings} variant="contained">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Field Dialog */}
      <Dialog open={dialogState.isOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogState.mode === 'add' ? 'Add New Field' : 'Edit Field'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Field Name"
                value={editingField.name || ''}
                onChange={(e) =>
                  setEditingField({ ...editingField, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Field Label"
                value={editingField.label || ''}
                onChange={(e) =>
                  setEditingField({ ...editingField, label: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Field Type</InputLabel>
                <Select
                  value={editingField.type || 'text'}
                  label="Field Type"
                  onChange={(e) =>
                    setEditingField({ ...editingField, type: e.target.value as FieldType })
                  }
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="select">Select Dropdown</MenuItem>
                  <MenuItem value="checkbox">Checkbox</MenuItem>
                  <MenuItem value="textarea">Text Area</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {editingField.type === 'select' && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Add Option"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                    />
                    <Button onClick={handleAddOption}>Add</Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {editingField.options?.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        onDelete={() => handleDeleteOption(option)}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editingField.required || false}
                    onChange={(e) =>
                      setEditingField({ ...editingField, required: e.target.checked })
                    }
                  />
                }
                label="Required"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveField} variant="contained">
            {dialogState.mode === 'add' ? 'Add Field' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </DndProvider>
  );
}; 