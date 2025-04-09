import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CardTemplate, CardData } from '../types/card';
import { FormTemplateService } from '../services/FormTemplateService';
import { CardPreview } from './CardPreview';
import { CardStorageService } from '../services/CardStorageService';

interface CardFormProps {
  template: CardTemplate;
  onSubmit: (values: CardData) => void;
}

export const CardForm: React.FC<CardFormProps> = ({ template, onSubmit }) => {
  const formTemplateService = new FormTemplateService(template);
  const validationSchema = formTemplateService.generateValidationSchema();
  const initialValues = formTemplateService.getInitialValues();
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  console.log('CardForm rendered, activeTab:', activeTab);
  console.log('Preview ref available:', !!previewRef.current);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (previewRef.current) {
        try {
          await CardStorageService.saveCardAsPDF(template, values, previewRef.current);
          onSubmit(values);
        } catch (error) {
          console.error('Failed to save PDF:', error);
        }
      }
    },
  });

  const renderField = (field: typeof template.fields[0]) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            id={field.id}
            name={field.name}
            label={field.label}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
            helperText={formik.touched[field.name] && formik.errors[field.name]}
          />
        );
      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            id={field.id}
            name={field.name}
            label={field.label}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
            helperText={formik.touched[field.name] && formik.errors[field.name]}
            InputProps={{
              inputProps: {
                min: field.validation?.min,
                max: field.validation?.max,
              },
            }}
          />
        );
      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.id}-label`}
              id={field.id}
              name={field.name}
              value={formik.values[field.name] || ''}
              label={field.label}
              onChange={formik.handleChange}
              error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {formik.touched[field.name] && formik.errors[field.name] && (
              <Typography color="error" variant="caption">
                {formik.errors[field.name]}
              </Typography>
            )}
          </FormControl>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                id={field.id}
                name={field.name}
                checked={Boolean(formik.values[field.name])}
                onChange={formik.handleChange}
              />
            }
            label={field.label}
          />
        );
      case 'textarea':
        return (
          <TextField
            fullWidth
            id={field.id}
            name={field.name}
            label={field.label}
            multiline
            rows={4}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
            helperText={formik.touched[field.name] && formik.errors[field.name]}
          />
        );
      case 'image':
        return (
          <Box>
            <input
              type="file"
              id={field.id}
              name={field.name}
              accept="image/*"
              onChange={(event) => {
                if (event.currentTarget.files && event.currentTarget.files[0]) {
                  formik.setFieldValue(field.name, event.currentTarget.files[0]);
                }
              }}
            />
            {formik.touched[field.name] && formik.errors[field.name] && (
              <Typography color="error" variant="caption">
                {formik.errors[field.name]}
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  const handleDownload = async () => {
    console.log('Download button clicked');
    if (!previewRef.current) {
      console.error('Preview ref is not available');
      return;
    }

    try {
      console.log('Starting PDF generation');
      
      // Convert the preview to a canvas
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: true,
      });
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate dimensions to fit the card on the page
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to the PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Download the PDF
      pdf.save(`card_${Date.now()}.pdf`);
      console.log('PDF download completed');
      
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {template.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {template.description}
      </Typography>

      <Tabs value={activeTab} onChange={(_, newValue) => {
        console.log('Tab changed to:', newValue);
        setActiveTab(newValue);
      }}>
        <Tab label="Form" />
        <Tab label="Preview" />
      </Tabs>

      {activeTab === 0 ? (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {template.fields.map((field) => (
              <Grid item xs={12} key={field.id}>
                {renderField(field)}
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={formik.isSubmitting}
              >
                Create Card
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <Box>
          <Box ref={previewRef}>
            <CardPreview template={template} data={formik.values} />
          </Box>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={(e) => {
                console.log('Button clicked, event:', e);
                handleDownload();
              }}
              disabled={formik.isSubmitting}
            >
              Download Card
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
}; 