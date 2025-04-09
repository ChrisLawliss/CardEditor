import { useState, useCallback } from 'react';
import { CardTemplate, CardField, FieldType } from '../types/card';

interface FieldDialogState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  fieldId?: string;
}

export const useFieldManagement = (template: CardTemplate, onUpdateTemplate: (template: CardTemplate) => void) => {
  const [fieldDialog, setFieldDialog] = useState<FieldDialogState>({
    isOpen: false,
    mode: 'add',
  });

  const handleOpenDialog = useCallback((mode: 'add' | 'edit', fieldId?: string) => {
    setFieldDialog({
      isOpen: true,
      mode,
      fieldId,
    });
  }, []);

  const handleCloseDialog = useCallback(() => {
    setFieldDialog({
      isOpen: false,
      mode: 'add',
    });
  }, []);

  const handleSaveField = useCallback((field: CardField) => {
    const updatedFields = [...template.fields];
    
    if (fieldDialog.mode === 'add') {
      updatedFields.push(field);
    } else {
      const index = updatedFields.findIndex(f => f.id === field.id);
      if (index !== -1) {
        updatedFields[index] = field;
      }
    }

    onUpdateTemplate({
      ...template,
      fields: updatedFields,
    });

    handleCloseDialog();
  }, [template, fieldDialog.mode, onUpdateTemplate, handleCloseDialog]);

  const handleDeleteField = useCallback((fieldId: string) => {
    const updatedFields = template.fields.filter(field => field.id !== fieldId);
    onUpdateTemplate({
      ...template,
      fields: updatedFields,
    });
  }, [template, onUpdateTemplate]);

  const createNewField = useCallback((type: FieldType): CardField => {
    return {
      id: `field-${Date.now()}`,
      name: '',
      type,
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
    };
  }, []);

  return {
    fieldDialog,
    handleOpenDialog,
    handleCloseDialog,
    handleSaveField,
    handleDeleteField,
    createNewField,
  };
}; 