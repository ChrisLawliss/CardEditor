import { CardTemplate, CardField } from '../types/card';

export class TemplateValidationService {
  static validateTemplate(template: CardTemplate): string[] {
    const errors: string[] = [];

    // Validate template name
    if (!template.name || template.name.trim() === '') {
      errors.push('Template name is required');
    }

    // Validate template dimensions
    if (template.settings.width <= 0 || template.settings.height <= 0) {
      errors.push('Template dimensions must be positive');
    }

    // Validate fields
    template.fields.forEach((field, index) => {
      const fieldErrors = this.validateField(field, index);
      errors.push(...fieldErrors);
    });

    return errors;
  }

  private static validateField(field: CardField, index: number): string[] {
    const errors: string[] = [];

    // Validate field name
    if (!field.name || field.name.trim() === '') {
      errors.push(`Field ${index + 1}: Name is required`);
    }

    // Validate field position
    if (field.settings.position) {
      const { x, y, width, height } = field.settings.position;
      if (x === undefined || y === undefined || width === undefined || height === undefined) {
        errors.push(`Field ${index + 1}: Position properties are incomplete`);
      } else if (x < 0 || y < 0 || width <= 0 || height <= 0) {
        errors.push(`Field ${index + 1}: Invalid position or dimensions`);
      }
    }

    // Validate required fields
    if (field.required && !field.label) {
      errors.push(`Field ${index + 1}: Label is required for required fields`);
    }

    return errors;
  }
} 