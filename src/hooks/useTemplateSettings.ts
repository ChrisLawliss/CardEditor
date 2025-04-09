import { useState, useCallback } from 'react';
import { CardTemplate } from '../types/card';

interface TemplateSettingsDialogState {
  isOpen: boolean;
}

export const useTemplateSettings = (template: CardTemplate, onUpdateTemplate: (template: CardTemplate) => void) => {
  const [settingsDialog, setSettingsDialog] = useState<TemplateSettingsDialogState>({
    isOpen: false,
  });

  const handleOpenSettingsDialog = useCallback(() => {
    setSettingsDialog({ isOpen: true });
  }, []);

  const handleCloseSettingsDialog = useCallback(() => {
    setSettingsDialog({ isOpen: false });
  }, []);

  const handleSaveTemplateSettings = useCallback((settings: CardTemplate['settings']) => {
    onUpdateTemplate({
      ...template,
      settings,
    });
    handleCloseSettingsDialog();
  }, [template, onUpdateTemplate, handleCloseSettingsDialog]);

  return {
    settingsDialog,
    handleOpenSettingsDialog,
    handleCloseSettingsDialog,
    handleSaveTemplateSettings,
  };
}; 