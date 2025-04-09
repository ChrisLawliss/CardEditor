import React from 'react';
import { render, screen } from '@testing-library/react';
import { CardPreview } from '../CardPreview';
import { CHARACTER_CARD_TEMPLATE } from '../../types/card';

describe('CardPreview', () => {
  const mockData = {
    name: 'Test Character',
    strength: 10,
    hitpoints: 100,
    class: 'Warrior',
    isElite: true,
    description: 'A test character',
  };

  it('renders the card container with correct dimensions', () => {
    render(<CardPreview template={CHARACTER_CARD_TEMPLATE} data={mockData} />);
    
    const cardContainer = screen.getByTestId('card-container');
    expect(cardContainer).toHaveStyle({
      width: '63mm',
      height: '88mm',
      padding: '3mm',
    });
  });

  it('renders all fields with correct positioning', () => {
    render(<CardPreview template={CHARACTER_CARD_TEMPLATE} data={mockData} />);
    
    // Check if all fields are rendered
    expect(screen.getByText('Test Character')).toBeInTheDocument();
    expect(screen.getByText('Warrior')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('A test character')).toBeInTheDocument();
  });

  it('renders field labels correctly', () => {
    render(<CardPreview template={CHARACTER_CARD_TEMPLATE} data={mockData} />);
    
    // Check if labels are rendered
    expect(screen.getByText('Character Class:')).toBeInTheDocument();
    expect(screen.getByText('Strength:')).toBeInTheDocument();
    expect(screen.getByText('Hit Points:')).toBeInTheDocument();
    expect(screen.getByText('Elite Character:')).toBeInTheDocument();
    expect(screen.getByText('Character Description:')).toBeInTheDocument();
  });

  it('applies correct styling to fields', () => {
    render(<CardPreview template={CHARACTER_CARD_TEMPLATE} data={mockData} />);
    
    // Check name field styling
    const nameField = screen.getByText('Test Character');
    expect(nameField).toHaveStyle({
      fontSize: '24px',
      textAlign: 'center',
      fontWeight: 'bold',
    });
  });

  it('handles missing data gracefully', () => {
    const incompleteData = {
      name: 'Test Character',
      // Other fields are missing
    };
    
    render(<CardPreview template={CHARACTER_CARD_TEMPLATE} data={incompleteData} />);
    
    // Should still render the name
    expect(screen.getByText('Test Character')).toBeInTheDocument();
    // Other fields should not be rendered
    expect(screen.queryByText('Warrior')).not.toBeInTheDocument();
  });
}); 