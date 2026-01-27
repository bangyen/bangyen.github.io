import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InterpreterNavigation } from '../InterpreterNavigation';

// Mock MUI Select/MenuItem to avoid complex DOM structure testing
jest.mock('@mui/material', () => ({
    FormControl: ({ children }: any) => (
        <div data-testid="form-control">{children}</div>
    ),
    Select: ({ value, onChange, children }: any) => (
        <select data-testid="select" value={value} onChange={onChange}>
            {children}
        </select>
    ),
    MenuItem: ({ value, children }: any) => (
        <option value={value}>{children}</option>
    ),
}));

describe('InterpreterNavigation', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders with correct active value', () => {
        render(
            <InterpreterNavigation active="wii2d" onChange={mockOnChange} />
        );

        const select = screen.getByTestId('select') as HTMLSelectElement;
        expect(select.value).toBe('wii2d');
    });

    test('calls onChange when value changes', () => {
        render(
            <InterpreterNavigation active="stun-step" onChange={mockOnChange} />
        );

        const select = screen.getByTestId('select');
        fireEvent.change(select, { target: { value: 'suffolk' } });

        expect(mockOnChange).toHaveBeenCalledWith('suffolk');
    });

    test('renders all options', () => {
        render(
            <InterpreterNavigation active="stun-step" onChange={mockOnChange} />
        );

        expect(screen.getByText('Stun Step')).toBeInTheDocument();
        expect(screen.getByText('Suffolk')).toBeInTheDocument();
        expect(screen.getByText('WII2D')).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
    });
});
