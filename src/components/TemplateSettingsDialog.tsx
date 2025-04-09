import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { CardTemplate } from '../types/card';

interface TemplateSettingsDialogProps {
  open: boolean;
  template: CardTemplate;
  onClose: () => void;
  onSave: (settings: CardTemplate['settings']) => void;
}

export const TemplateSettingsDialog: React.FC<TemplateSettingsDialogProps> = ({
  open,
  template,
  onClose,
  onSave,
}) => {
  const [settings, setSettings] = React.useState(template.settings);

  const handleChange = (field: keyof CardTemplate['settings'], value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Template Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Width"
              type="number"
              value={settings.width}
              onChange={(e) => handleChange('width', Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Height"
              type="number"
              value={settings.height}
              onChange={(e) => handleChange('height', Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Bleed Width"
              type="number"
              value={settings.bleedWidth}
              onChange={(e) => handleChange('bleedWidth', Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Safe Width"
              type="number"
              value={settings.safeWidth}
              onChange={(e) => handleChange('safeWidth', Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select
                value={settings.unit}
                label="Unit"
                onChange={(e) => handleChange('unit', e.target.value)}
              >
                <MenuItem value="px">Pixels (px)</MenuItem>
                <MenuItem value="mm">Millimeters (mm)</MenuItem>
                <MenuItem value="in">Inches (in)</MenuItem>
              </Select>
            </FormControl>
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