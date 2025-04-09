import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CardForm } from '../CardForm';
import { CHARACTER_CARD_TEMPLATE } from '../../types/card';
import { CardStorageService } from '../../services/CardStorageService';

// Mock the CardStorageService
jest.mock('../../services/CardStorageService', () => ({
  CardStorageService: {
    saveCardAsPDF: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('CardForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields based on template', () => {
    render(
      <CardForm
        template={CHARACTER_CARD_TEMPLATE}
        onSubmit={mockOnSubmit}
      />
    );

    // Check if all form fields are rendered
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Character Class')).toBeInTheDocument();
    expect(screen.getByLabelText('Strength')).toBeInTheDocument();
    expect(screen.getByLabelText('Hit Points')).toBeInTheDocument();
    expect(screen.getByLabelText('Elite Character')).toBeInTheDocument();
    expect(screen.getByLabelText('Character Description')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(
      <CardForm
        template={CHARACTER_CARD_TEMPLATE}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test Character' },
    });
    fireEvent.change(screen.getByLabelText('Character Class'), {
      target: { value: 'Warrior' },
    });
    fireEvent.change(screen.getByLabelText('Strength'), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByLabelText('Hit Points'), {
      target: { value: '100' },
    });
    fireEvent.click(screen.getByLabelText('Elite Character'));
    fireEvent.change(screen.getByLabelText('Character Description'), {
      target: { value: 'A test character' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Save Card'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Character',
        class: 'Warrior',
        strength: 10,
        hitpoints: 100,
        isElite: true,
        description: 'A test character',
      });
    });
  });

  it('validates required fields', async () => {
    render(
      <CardForm
        template={CHARACTER_CARD_TEMPLATE}
        onSubmit={mockOnSubmit}
      />
    );

    // Try to submit without filling required fields
    fireEvent.click(screen.getByText('Save Card'));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Character Class is required')).toBeInTheDocument();
      expect(screen.getByText('Strength is required')).toBeInTheDocument();
      expect(screen.getByText('Hit Points is required')).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates number field ranges', async () => {
    render(
      <CardForm
        template={CHARACTER_CARD_TEMPLATE}
        onSubmit={mockOnSubmit}
      />
    );

    // Enter invalid values
    fireEvent.change(screen.getByLabelText('Strength'), {
      target: { value: '-1' },
    });
    fireEvent.change(screen.getByLabelText('Hit Points'), {
      target: { value: '0' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Save Card'));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Strength must be greater than 0')).toBeInTheDocument();
      expect(screen.getByText('Hit Points must be greater than 0')).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('switches between form and preview tabs', () => {
    render(
      <CardForm
        template={CHARACTER_CARD_TEMPLATE}
        onSubmit={mockOnSubmit}
      />
    );

    // Initially on form tab
    expect(screen.getByText('Form')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Preview')).toHaveAttribute('aria-selected', 'false');

    // Switch to preview tab
    fireEvent.click(screen.getByText('Preview'));
    expect(screen.getByText('Form')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Preview')).toHaveAttribute('aria-selected', 'true');
  });

  it('handles download button click', async () => {
    render(
      <CardForm
        template={CHARACTER_CARD_TEMPLATE}
        onSubmit={mockOnSubmit}
      />
    );

    // Switch to preview tab
    fireEvent.click(screen.getByText('Preview'));

    // Click download button
    fireEvent.click(screen.getByText('Download Card'));

    // Verify CardStorageService was called
    await waitFor(() => {
      expect(CardStorageService.saveCardAsPDF).toHaveBeenCalled();
    });
  });

  it('handles PDF generation failure gracefully', async () => {
    // Mock PDF generation to fail
    jest.spyOn(CardStorageService, 'saveCardAsPDF').mockRejectedValueOnce(new Error('PDF generation failed'));

    render(
      <CardForm
        template={CHARACTER_CARD_TEMPLATE}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test Character' },
    });
    fireEvent.change(screen.getByLabelText('Character Class'), {
      target: { value: 'Warrior' },
    });
    fireEvent.change(screen.getByLabelText('Strength'), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByLabelText('Hit Points'), {
      target: { value: '100' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Save Card'));

    // Verify onSubmit was still called despite PDF generation failure
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
}); 