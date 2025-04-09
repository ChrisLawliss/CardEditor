import { CardTemplate, CardField, CardData } from '../types/card';
import * as Yup from 'yup';

export class FormTemplateService {
  private template: CardTemplate;

  constructor(template: CardTemplate) {
    this.template = template;
  }

  public generateValidationSchema() {
    const schema: { [key: string]: any } = {};

    this.template.fields.forEach((field) => {
      let fieldSchema;

      switch (field.type) {
        case 'text':
          fieldSchema = Yup.string();
          break;
        case 'number':
          fieldSchema = Yup.number();
          if (field.validation?.min !== undefined) {
            fieldSchema = fieldSchema.min(field.validation.min);
          }
          if (field.validation?.max !== undefined) {
            fieldSchema = fieldSchema.max(field.validation.max);
          }
          break;
        case 'image':
          fieldSchema = Yup.mixed().test(
            'fileType',
            'Please upload an image file',
            (value) => {
              if (!value) return !field.required;
              return value instanceof File && value.type.startsWith('image/');
            }
          );
          break;
        default:
          fieldSchema = Yup.string();
      }

      if (field.required) {
        fieldSchema = fieldSchema.required(`${field.label} is required`);
      }

      schema[field.name] = fieldSchema;
    });

    return Yup.object().shape(schema);
  }

  public getInitialValues(): CardData {
    const initialValues: CardData = {};

    this.template.fields.forEach((field) => {
      switch (field.type) {
        case 'text':
          initialValues[field.name] = '';
          break;
        case 'number':
          initialValues[field.name] = 0;
          break;
        case 'image':
          initialValues[field.name] = new File([], '');
          break;
      }
    });

    return initialValues;
  }

  public getTemplate(): CardTemplate {
    return this.template;
  }
} 