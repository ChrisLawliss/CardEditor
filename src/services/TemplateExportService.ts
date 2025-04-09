import { CardTemplate } from '../types/card';

export class TemplateExportService {
  static exportTemplate(template: CardTemplate): string {
    return JSON.stringify(template, null, 2);
  }

  static importTemplate(jsonString: string): CardTemplate {
    try {
      const template = JSON.parse(jsonString);
      return this.validateTemplateStructure(template);
    } catch (error) {
      throw new Error('Invalid template JSON format');
    }
  }

  private static validateTemplateStructure(template: any): CardTemplate {
    // Basic structure validation
    if (!template || typeof template !== 'object') {
      throw new Error('Invalid template structure');
    }

    // Required properties
    const requiredProperties = ['id', 'name', 'description', 'settings', 'fields'];
    for (const prop of requiredProperties) {
      if (!(prop in template)) {
        throw new Error(`Missing required property: ${prop}`);
      }
    }

    // Validate settings structure
    if (!template.settings || typeof template.settings !== 'object') {
      throw new Error('Invalid settings structure');
    }

    const requiredSettings = ['width', 'height', 'bleedWidth', 'safeWidth', 'unit'];
    for (const setting of requiredSettings) {
      if (!(setting in template.settings)) {
        throw new Error(`Missing required setting: ${setting}`);
      }
    }

    // Validate fields array
    if (!Array.isArray(template.fields)) {
      throw new Error('Fields must be an array');
    }

    return template as CardTemplate;
  }
} 