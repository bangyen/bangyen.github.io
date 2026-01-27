/* eslint-disable @typescript-eslint/no-explicit-any, react/no-array-index-key */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GridEditor from '../GridEditor';

// Mock MUI to avoid complex rendering
jest.mock('../../../../components/mui', () => ({
    Box: ({ children }: any) => <div data-testid="mui-box">{children}</div>,
    Typography: ({ children }: any) => (
        <div data-testid="mui-typography">{children}</div>
    ),
    Fade: ({ children }: any) => <div data-testid="mui-fade">{children}</div>,
    Grid: ({ children }: any) => <div data-testid="mui-grid">{children}</div>,
}));

// Mock variables prefixed with 'mock' are allowed in jest.mock()
const mockNextIter = jest.fn(action => action.payload);
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
    default: ({ children }: any) => <div data-testid="editor">{children}</div>,
}));

// Mock GridArea and KeySelector
jest.mock('../../components/GridArea', () => ({
    GridArea: ({ handleClick, options }: any) => (
        <div data-testid="grid-area">
            {(options || []).map((opt: string, i: number) => (
                <button
                    key={i}
                    data-testid={`cell-${i}`}
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
    KeySelector: ({ onSelect, keys }: any) => (
        <div data-testid="key-selector">
            {(keys || []).map((k: string) => (
                <button
                    key={k}
                    data-testid={`key-${k}`}
                    onClick={() => onSelect(k)}
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
        runner: (state: any) => state,
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
