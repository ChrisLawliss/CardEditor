import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DraggableField } from '../DraggableField';
import { CardField } from '../../types/card';

const mockField: CardField = {
  id: 'test-field',
  name: 'test-field',
  type: 'text',
  label: 'Test Field',
  settings: {
    position: {
      x: 0,
      y: 0,
      width: 80,
      height: 40
    }
  }
};

const mockGridSettings = {
  enabled: true,
  size: 10,
  snap: true
};

const mockOnMove = jest.fn();
const mockOnResize = jest.fn();

describe('DraggableField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders field with correct label', () => {
    render(
      <DraggableField
        field={mockField}
        onMove={mockOnMove}
        onResize={mockOnResize}
        gridSettings={mockGridSettings}
      />
    );
    expect(screen.getByText('Test Field')).toBeInTheDocument();
  });

  it('calls onMove when field is moved', () => {
    render(
      <DraggableField
        field={mockField}
        onMove={mockOnMove}
        onResize={mockOnResize}
        gridSettings={mockGridSettings}
      />
    );
    
    const fieldElement = screen.getByText('Test Field').closest('div');
    if (fieldElement) {
      fireEvent.dragEnd(fieldElement, {
        clientX: 100,
        clientY: 100
      });
    }

    expect(mockOnMove).toHaveBeenCalledWith('test-field', 100, 100);
  });

  it('calls onResize when field is resized', () => {
    render(
      <DraggableField
        field={mockField}
        onMove={mockOnMove}
        onResize={mockOnResize}
        gridSettings={mockGridSettings}
      />
    );
    
    const resizeHandle = screen.getByRole('presentation');
    fireEvent.mouseDown(resizeHandle);
    fireEvent.mouseMove(window, {
      clientX: 120,
      clientY: 60
    });
    fireEvent.mouseUp(window);

    expect(mockOnResize).toHaveBeenCalledWith('test-field', 120, 60);
  });

  it('snaps to grid when grid settings are enabled', () => {
    render(
      <DraggableField
        field={mockField}
        onMove={mockOnMove}
        onResize={mockOnResize}
        gridSettings={mockGridSettings}
      />
    );
    
    const fieldElement = screen.getByText('Test Field').closest('div');
    if (fieldElement) {
      fireEvent.dragEnd(fieldElement, {
        clientX: 95,
        clientY: 95
      });
    }

    expect(mockOnMove).toHaveBeenCalledWith('test-field', 100, 100);
  });
}); 