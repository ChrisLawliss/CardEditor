import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import { CardField, FieldType } from '../types/card';

interface FieldDialogProps {
  open: boolean;
  mode: 'add' | 'edit';
  field?: CardField;
  onClose: () => void;
  onSave: (field: CardField) => void;
}

export const FieldDialog: React.FC<FieldDialogProps> = ({
  open,
  mode,
  field,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CardField>({
    id: '',
    name: '',
    type: 'text',
    label: '',
    required: false,
    settings: {
      position: {
        x: 0,
        y: 0,
        width: 100,
        height: 40,
      },
    },
  });

  useEffect(() => {
    if (field) {
      setFormData(field);
    }
  }, [field]);

  const handleChange = (field: keyof CardField, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'add' ? 'Add Field' : 'Edit Field'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Label"
              value={formData.label}
              onChange={(e) => handleChange('label', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="textarea">Text Area</MenuItem>
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="image">Image</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.required}
                  onChange={(e) => handleChange('required', e.target.checked)}
                />
              }
              label="Required"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 