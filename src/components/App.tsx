import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Grid, Button } from '@mui/material';
import { CardForm } from './CardForm';
import { TemplateMenu } from './TemplateMenu';
import { TemplateEditor } from './TemplateEditor';
import { CardTemplate, CHARACTER_CARD_TEMPLATE } from '../types/card';

const theme = createTheme();

function App() {
  const [templates, setTemplates] = useState<CardTemplate[]>([CHARACTER_CARD_TEMPLATE]);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectTemplate = (template: CardTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(false);
  };

  const handleAddTemplate = (template: CardTemplate) => {
    setTemplates([...templates, template]);
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
  };

  const handleUpdateTemplate = (updatedTemplate: CardTemplate) => {
    setTemplates(templates.map(t => 
      t.id === updatedTemplate.id ? updatedTemplate : t
    ));
    setSelectedTemplate(updatedTemplate);
  };

  const handleSubmit = (values: any) => {
    console.log('Form submitted with values:', values);
    // Here you would typically save the card data to your backend
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TemplateMenu
              templates={templates}
              onSelectTemplate={handleSelectTemplate}
              onAddTemplate={handleAddTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            {selectedTemplate && (
              <Box>
                {isEditing ? (
                  <TemplateEditor
                    template={selectedTemplate}
                    onUpdateTemplate={handleUpdateTemplate}
                  />
                ) : (
                  <CardForm
                    template={selectedTemplate}
                    onSubmit={handleSubmit}
                  />
                )}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Preview Form' : 'Edit Template'}
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App; 