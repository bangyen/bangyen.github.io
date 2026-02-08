import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GridEditor from '../GridEditor';
import { GridState } from '../eventHandlers';

// Mock MUI to avoid complex rendering
vi.mock('../../../../components/mui', () => ({
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

// Mock variables prefixed with 'mock' are allowed in vi.mock()
const mockNextIter = vi.fn((action: { payload: unknown }) => action.payload);
const mockStableTimer = { create: vi.fn(), clear: vi.fn() };
const mockStableKeys = { create: vi.fn(), clear: vi.fn() };

// Mock hooks
vi.mock('../../../../hooks', () => ({
    useContainer: vi.fn(() => ({ height: 400, width: 600 })),
    useTimer: vi.fn(() => mockStableTimer),
    useKeys: vi.fn(() => mockStableKeys),
    useCache: vi.fn(() => mockNextIter),
    useMobile: vi.fn(() => false),
}));

// Mock Editor sub-component
vi.mock('../../Editor', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="editor">{children}</div>
    ),
}));

// Mock GridArea and KeySelector
vi.mock('../../components/GridArea', () => ({
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
                    key={`${opt}-${i.toString()}`}
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
vi.mock('../../components/KeySelector', () => ({
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
        vi.clearAllMocks();
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
