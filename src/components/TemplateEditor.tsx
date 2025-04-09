import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, Grid, Paper, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { CardTemplate } from '../types/card';
import { DraggableField } from './DraggableField';
import { DropZone } from './DropZone';
import { FieldList } from './FieldList';
import { TemplateSettingsDialog } from './TemplateSettingsDialog';
import { FieldDialog } from './FieldDialog';
import { GridAndZoomControls } from './GridAndZoomControls';
import { useFieldManagement } from '../hooks/useFieldManagement';
import { useTemplateSettings } from '../hooks/useTemplateSettings';
import { useGridAndZoom } from '../hooks/useGridAndZoom';
import { TemplateValidationService } from '../services/TemplateValidationService';
import { TemplatePreviewService } from '../services/TemplatePreviewService';
import { DropResult, Position } from '../types/dnd';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';

interface TemplateEditorProps {
  template: CardTemplate;
  onUpdateTemplate: (template: CardTemplate) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onUpdateTemplate,
}) => {
  // Field management
  const {
    fieldDialog,
    handleOpenDialog,
    handleCloseDialog,
    handleSaveField,
    handleDeleteField,
    createNewField,
  } = useFieldManagement(template, onUpdateTemplate);

  // Template settings
  const {
    settingsDialog,
    handleOpenSettingsDialog,
    handleCloseSettingsDialog,
    handleSaveTemplateSettings,
  } = useTemplateSettings(template, onUpdateTemplate);

  // Grid and zoom controls
  const {
    gridSettings,
    zoom,
    handleGridToggle,
    handleGridSizeChange,
    handleSnapToggle,
    handleZoomChange,
    handleZoomIn,
    handleZoomOut,
    snapToGrid,
  } = useGridAndZoom();

  // Validate template
  const validationErrors = TemplateValidationService.validateTemplate(template);

  // Generate preview data
  const previewData = TemplatePreviewService.generatePreviewData(template);

  const handleDrop = (result: DropResult) => {
    const updatedTemplate = {
      ...template,
      fields: template.fields.map(field =>
        field.id === result.id
          ? {
              ...field,
              settings: {
                ...field.settings,
                position: {
                  ...field.settings.position,
                  ...result.position,
                },
              },
            }
          : field
      ),
    };
    onUpdateTemplate(updatedTemplate);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Top toolbar */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar variant="dense">
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {template.name}
            </Typography>
            <IconButton onClick={() => handleOpenSettingsDialog()}>
              <SettingsIcon />
            </IconButton>
            <IconButton onClick={() => handleOpenDialog('add')}>
              <AddIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left sidebar - Field list */}
          <Paper
            sx={{
              width: 250,
              overflow: 'auto',
              borderRight: '1px solid #ccc',
            }}
          >
            <FieldList
              fields={template.fields}
              onEditField={(fieldId) => handleOpenDialog('edit', fieldId)}
              onDeleteField={handleDeleteField}
            />
          </Paper>

          {/* Main editor area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Paper
              sx={{
                flex: 1,
                m: 2,
                overflow: 'auto',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: template.settings.width,
                  height: template.settings.height,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center',
                  background: gridSettings.enabled
                    ? `linear-gradient(to right, #eee 1px, transparent 1px),
                       linear-gradient(to bottom, #eee 1px, transparent 1px)`
                    : 'white',
                  backgroundSize: `${gridSettings.size}px ${gridSettings.size}px`,
                }}
              >
                <DropZone
                  onDrop={handleDrop}
                  gridSettings={gridSettings}
                  zoom={zoom / 100}
                >
                  {template.fields.map(field => (
                    <DraggableField
                      key={field.id}
                      field={{
                        id: field.id,
                        type: field.type,
                        label: field.label,
                        settings: {
                          position: field.settings.position,
                          style: field.settings.style,
                        },
                      }}
                      onMove={(id: string, position: Position) => {
                        const updatedTemplate = {
                          ...template,
                          fields: template.fields.map(f =>
                            f.id === id
                              ? {
                                  ...f,
                                  settings: {
                                    ...f.settings,
                                    position: {
                                      ...f.settings.position,
                                      ...position,
                                    },
                                  },
                                }
                              : f
                          ),
                        };
                        onUpdateTemplate(updatedTemplate);
                      }}
                      gridSettings={gridSettings}
                      zoom={zoom / 100}
                    />
                  ))}
                </DropZone>
              </Box>
            </Paper>

            {/* Bottom toolbar - Grid and zoom controls */}
            <Paper
              sx={{
                p: 1,
                borderTop: '1px solid #ccc',
              }}
            >
              <GridAndZoomControls
                gridEnabled={gridSettings.enabled}
                snapEnabled={gridSettings.snap}
                gridSize={gridSettings.size}
                zoom={zoom}
                onGridToggle={handleGridToggle}
                onSnapToggle={handleSnapToggle}
                onGridSizeChange={handleGridSizeChange}
                onZoomChange={handleZoomChange}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
              />
            </Paper>
          </Box>
        </Box>

        {/* Dialogs */}
        <TemplateSettingsDialog
          open={settingsDialog.isOpen}
          template={template}
          onClose={handleCloseSettingsDialog}
          onSave={handleSaveTemplateSettings}
        />

        <FieldDialog
          open={fieldDialog.isOpen}
          mode={fieldDialog.mode}
          field={template.fields.find(f => f.id === fieldDialog.fieldId)}
          onClose={handleCloseDialog}
          onSave={handleSaveField}
        />
      </Box>
    </DndProvider>
  );
}; 