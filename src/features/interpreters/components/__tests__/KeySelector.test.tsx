import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { KeySelector } from '../KeySelector';

describe('KeySelector', () => {
    const mockOnSelect = vi.fn();
    const keys = ['A', 'B', ' ', '1'];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders all provided keys', () => {
        render(<KeySelector keys={keys} onSelect={mockOnSelect} />);

        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.getByText('␣')).toBeInTheDocument(); // Space is rendered as ␣
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('renders control keys', () => {
        render(<KeySelector keys={keys} onSelect={mockOnSelect} />);

        expect(screen.getByText('⌫')).toBeInTheDocument(); // Backspace
        expect(screen.getByText('✕')).toBeInTheDocument(); // Escape
    });

    test('calls onSelect with key when clicked', () => {
        render(<KeySelector keys={keys} onSelect={mockOnSelect} />);

        fireEvent.click(screen.getByText('A'));
        expect(mockOnSelect).toHaveBeenCalledWith('A');
    });

    test('calls onSelect with space when space button clicked', () => {
        render(<KeySelector keys={keys} onSelect={mockOnSelect} />);

        fireEvent.click(screen.getByText('␣'));
        expect(mockOnSelect).toHaveBeenCalledWith(' ');
    });

    test('calls onSelect with Backspace when button clicked', () => {
        render(<KeySelector keys={keys} onSelect={mockOnSelect} />);

        fireEvent.click(screen.getByText('⌫'));
        expect(mockOnSelect).toHaveBeenCalledWith('Backspace');
    });

    test('calls onSelect with Escape when button clicked', () => {
        render(<KeySelector keys={keys} onSelect={mockOnSelect} />);

        fireEvent.click(screen.getByText('✕'));
        expect(mockOnSelect).toHaveBeenCalledWith('Escape');
    });
});
