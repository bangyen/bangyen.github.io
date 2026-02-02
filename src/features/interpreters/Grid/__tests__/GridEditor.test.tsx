/* eslint-disable react/no-array-index-key */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GridEditor from '../GridEditor';
import { GridState } from '../eventHandlers';

// Mock MUI to avoid complex rendering
jest.mock('../../../../components/mui', () => ({
    Box: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mui-box">{children}</div>
    ),
    Typography: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mui-typography">{children}</div>
    ),
    Fade: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mui-fade">{children}</div>
    ),
    Grid: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mui-grid">{children}</div>
    ),
}));

// Mock variables prefixed with 'mock' are allowed in jest.mock()
const mockNextIter = jest.fn((action: { payload: unknown }) => action.payload);
const mockStableTimer = { create: jest.fn(), clear: jest.fn() };
const mockStableKeys = { create: jest.fn(), clear: jest.fn() };

// Mock hooks
jest.mock('../../../../hooks', () => ({
    useContainer: jest.fn(() => ({ height: 400, width: 600 })),
    useTimer: jest.fn(() => mockStableTimer),
    useKeys: jest.fn(() => mockStableKeys),
    useCache: jest.fn(() => mockNextIter),
    useMobile: jest.fn(() => false),
}));

// Mock Editor sub-component
jest.mock('../../Editor', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="editor">{children}</div>
    ),
}));

// Mock GridArea and KeySelector
jest.mock('../../components/GridArea', () => ({
    GridArea: ({
        handleClick,
        options,
    }: {
        handleClick: (i: number) => () => void;
        options: string[];
    }) => (
        <div data-testid="grid-area">
            {options.map((opt: string, i: number) => (
                <button
                    key={i}
                    data-testid={`cell-${String(i)}`}
                    onClick={handleClick(i)}
                >
                    {opt}
                </button>
            ))}
        </div>
    ),
}));

// Mock KeySelector
jest.mock('../../components/KeySelector', () => ({
    KeySelector: ({
        onSelect,
        keys,
    }: {
        onSelect: (k: string) => void;
        keys: string[];
    }) => (
        <div data-testid="key-selector">
            {keys.map((k: string) => (
                <button
                    key={k}
                    data-testid={`key-${k}`}
                    onClick={() => {
                        onSelect(k);
                    }}
                >
                    {k}
                </button>
            ))}
        </div>
    ),
}));

describe('GridEditor Minimal', () => {
    const defaultProps = {
        name: 'MinimalTest',
        start: { grid: ' ', rows: 1, cols: 1 },
        runner: (state: GridState) => state,
        keys: ['a'],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without hanging', () => {
        render(<GridEditor {...defaultProps} />);
        expect(screen.getByTestId('editor')).toBeInTheDocument();
    });

    it('handles click', () => {
        render(<GridEditor {...defaultProps} />);
        const cell = screen.getByTestId('cell-0');
        fireEvent.click(cell);
        expect(cell).toBeInTheDocument();
    });
});
