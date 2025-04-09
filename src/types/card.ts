export type FieldType = 'text' | 'number' | 'image' | 'select' | 'checkbox' | 'textarea';

export interface Position {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  width?: number; // percentage of card width (0-100)
  height?: number; // percentage of card height (0-100)
  rotation?: number; // degrees
  zIndex?: number; // stacking order
}

export interface CardSettings {
  height: number; // in pixels
  width: number; // in pixels
  bleedWidth: number; // in pixels
  safeWidth: number; // in pixels
  unit: 'px' | 'mm' | 'in'; // measurement unit
}

export interface FieldStyle {
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: string;
  showLabel?: boolean;
  labelStyle?: {
    fontSize?: string;
    color?: string;
    position?: 'top' | 'left' | 'right' | 'bottom';
  };
}

export interface CardField {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  options?: string[]; // For select fields
  defaultValue?: any; // For checkbox and select fields
  settings: {
    position: Position;
    style?: FieldStyle;
  };
}

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  settings: CardSettings;
  fields: CardField[];
}

export interface CardData {
  [key: string]: string | number | File | boolean;
}

// Example Character Card Template
export const CHARACTER_CARD_TEMPLATE: CardTemplate = {
  id: 'character',
  name: 'Character Card',
  description: 'A basic character card template',
  settings: {
    height: 750,
    width: 1050,
    bleedWidth: 3,
    safeWidth: 2,
    unit: 'mm'
  },
  fields: [
    {
      id: 'name',
      name: 'name',
      type: 'text',
      label: 'Character Name',
      required: true,
      settings: {
        position: {
          x: 50,
          y: 10,
          width: 80,
          zIndex: 2
        },
        style: {
          fontSize: '24px',
          fontFamily: 'Arial',
          textAlign: 'center',
          fontWeight: 'bold',
          showLabel: false
        }
      }
    },
    {
      id: 'art',
      name: 'art',
      type: 'image',
      label: 'Character Art',
      required: true,
      settings: {
        position: {
          x: 10,
          y: 20,
          width: 80,
          height: 40,
          zIndex: 1
        }
      }
    },
    {
      id: 'class',
      name: 'class',
      type: 'select',
      label: 'Character Class',
      required: true,
      options: ['Warrior', 'Mage', 'Rogue', 'Cleric'],
      settings: {
        position: {
          x: 10,
          y: 65,
          width: 40,
          zIndex: 2
        },
        style: {
          fontSize: '16px',
          fontFamily: 'Arial',
          showLabel: true,
          labelStyle: {
            fontSize: '12px',
            color: '#666',
            position: 'top'
          }
        }
      }
    },
    {
      id: 'strength',
      name: 'strength',
      type: 'number',
      label: 'Strength',
      required: true,
      validation: {
        min: 0,
        max: 100,
      },
      settings: {
        position: {
          x: 60,
          y: 65,
          width: 30,
          zIndex: 2
        },
        style: {
          showLabel: true,
          labelStyle: {
            fontSize: '12px',
            color: '#666',
            position: 'top'
          }
        }
      }
    },
    {
      id: 'hitpoints',
      name: 'hitpoints',
      type: 'number',
      label: 'Hit Points',
      required: true,
      validation: {
        min: 1,
        max: 999,
      },
      settings: {
        position: {
          x: 10,
          y: 75,
          width: 30,
          zIndex: 2
        },
        style: {
          showLabel: true,
          labelStyle: {
            fontSize: '12px',
            color: '#666',
            position: 'top'
          }
        }
      }
    },
    {
      id: 'isElite',
      name: 'isElite',
      type: 'checkbox',
      label: 'Elite Character',
      defaultValue: false,
      settings: {
        position: {
          x: 60,
          y: 75,
          width: 30,
          zIndex: 2
        },
        style: {
          showLabel: true,
          labelStyle: {
            fontSize: '12px',
            color: '#666',
            position: 'left'
          }
        }
      }
    },
    {
      id: 'description',
      name: 'description',
      type: 'textarea',
      label: 'Character Description',
      required: false,
      settings: {
        position: {
          x: 10,
          y: 85,
          width: 80,
          height: 10,
          zIndex: 2
        },
        style: {
          fontSize: '12px',
          fontFamily: 'Arial',
          showLabel: true,
          labelStyle: {
            fontSize: '12px',
            color: '#666',
            position: 'top'
          }
        }
      }
    }
  ],
}; 