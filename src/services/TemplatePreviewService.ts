import { CardTemplate, CardField, FieldType } from '../types/card';

export class TemplatePreviewService {
  static generatePreviewData(template: CardTemplate): Record<string, any> {
    const previewData: Record<string, any> = {};

    template.fields.forEach(field => {
      previewData[field.name] = this.generateFieldPreview(field);
    });

    return previewData;
  }

  private static generateFieldPreview(field: CardField): any {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return `Sample ${field.label || field.name}`;
      case 'number':
        return Math.floor(Math.random() * 100);
      case 'select':
        return field.options?.[0] || '';
      case 'checkbox':
        return true;
      case 'image':
        return 'https://via.placeholder.com/150';
      default:
        return '';
    }
  }

  static calculatePreviewScale(
    containerWidth: number,
    containerHeight: number,
    templateWidth: number,
    templateHeight: number
  ): number {
    const widthScale = containerWidth / templateWidth;
    const heightScale = containerHeight / templateHeight;
    return Math.min(widthScale, heightScale);
  }

  static adjustFieldPosition(
    field: CardField,
    scale: number
  ): CardField {
    if (!field.settings.position) {
      return field;
    }

    const { x, y, width, height } = field.settings.position;
    if (x === undefined || y === undefined || width === undefined || height === undefined) {
      return field;
    }

    return {
      ...field,
      settings: {
        ...field.settings,
        position: {
          x: x * scale,
          y: y * scale,
          width: width * scale,
          height: height * scale,
        },
      },
    };
  }
} 