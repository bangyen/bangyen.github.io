import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { GhostCanvas } from '../GhostCanvas';
import { FORWARD, BACKWARD, CellState } from '../boardHandlers';

// Mock hooks
jest.mock('../../../../hooks', () => ({
    useMobile: () => false,
}));

// Mock theme
jest.mock('../../../../config/theme', () => ({
    COLORS: {
        text: { primary: 'black' },
        primary: { main: 'blue' },
        data: {
            red: 'red',
            green: 'green',
        },
        surface: {
            elevated: 'white',
            background: 'white',
        },
    },
    sxf: () => ({}),
    ANIMATIONS: { transition: 'none' },
    LAYOUT: { zIndex: { base: 1 } },
    SPACING: { borderRadius: { full: 999, sm: 4 } },
}));

// Mock CustomGrid to verify cell rendering
jest.mock('../../../../components/ui/CustomGrid', () => ({
    CustomGrid: ({
        rows,
        cols,
        cellProps,
    }: {
        rows: number;
        cols: number;
        cellProps: (r: number, c: number) => { children: React.ReactNode };
    }) => (
        <div>
            {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                    const props = cellProps(r, c);
                    return (
                        <div key={`${String(r)}-${String(c)}`} {...props}>
                            {props.children}
                        </div>
                    );
                })
            )}
        </div>
    ),
}));

// Mock MUI to ensure styles are applied
jest.mock('@mui/material', () => ({
    Box: ({
        children,
        sx,
        ...props
    }: {
        children: React.ReactNode;
        sx?: React.CSSProperties;
    }) => (
        <div style={sx} {...props}>
            {children}
        </div>
    ),
}));

const DEFAULT_PROPS = {
    rows: 3,
    cols: 3,
    numbers: Array(4).fill(Array(4).fill(null)) as (number | null)[][],
    size: 2, // rem
    initialMoves: new Map<string, CellState>(),
    onMove: jest.fn(),
};

describe('GhostCanvas', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the grid correctly', () => {
        render(<GhostCanvas {...DEFAULT_PROPS} />);
        const gridCells = document.querySelectorAll('[data-pos]');
        expect(gridCells.length).toBe(9);
    });

    it('handles click interactions', () => {
        const onMove = jest.fn();
        const { container } = render(
            <GhostCanvas {...DEFAULT_PROPS} onMove={onMove} />
        );

        const cell = container.querySelector('[data-pos="0,0"]');
        expect(cell).toBeInTheDocument();

        // Simulate click (mouse down)
        fireEvent.mouseDown(cell!, { button: 0 });
        expect(onMove).toHaveBeenCalledWith('0,0', FORWARD);
    });

    it('handles drag interactions (paint mode)', () => {
        const onMove = jest.fn();
        const { container } = render(
            <GhostCanvas {...DEFAULT_PROPS} onMove={onMove} />
        );

        const cell1 = container.querySelector('[data-pos="0,0"]');
        const cell2 = container.querySelector('[data-pos="0,1"]');

        // Start drag on cell1
        fireEvent.mouseDown(cell1!, { button: 0 });
        expect(onMove).toHaveBeenCalledWith('0,0', FORWARD);

        // Move to cell2
        fireEvent.mouseEnter(cell2!);
        expect(onMove).toHaveBeenCalledWith('0,1', FORWARD);
    });

    it('propagates constraints (shallow propagation check)', async () => {
        const numbers = Array(4)
            .fill(null)
            .map(
                (): (number | null)[] =>
                    Array(4).fill(null) as (number | null)[]
            );
        numbers[0][1] = 1;

        const initialMoves = new Map<string, CellState>();
        initialMoves.set('0,0', FORWARD);

        const { container } = render(
            <GhostCanvas
                {...DEFAULT_PROPS}
                numbers={numbers}
                initialMoves={initialMoves}
            />
        );

        await waitFor(() => {
            const cell01 = container.querySelector('[data-pos="0,1"]');
            expect(cell01).toBeInTheDocument();
            // Use 3 levels deep selector to target the inner line div
            const innerLine = cell01?.querySelector('div > div > div');
            expect(innerLine).toBeInTheDocument();
            expect(innerLine).toHaveAttribute(
                'style',
                expect.stringMatching(/background-color:\s*green/)
            );
        });
    });

    it('detects conflicts (red highlight)', async () => {
        const numbers = Array(4)
            .fill(null)
            .map(
                (): (number | null)[] =>
                    Array(4).fill(null) as (number | null)[]
            );
        numbers[0][1] = 1;

        const initialMoves = new Map<string, CellState>();
        initialMoves.set('0,0', FORWARD);
        initialMoves.set('0,1', BACKWARD);

        const { container } = render(
            <GhostCanvas
                {...DEFAULT_PROPS}
                numbers={numbers}
                initialMoves={initialMoves}
            />
        );

        await waitFor(() => {
            const cell00 = container.querySelector('[data-pos="0,0"]');
            expect(cell00).toBeInTheDocument();
            // Use 3 levels deep selector to target the inner line div
            const innerLine = cell00?.querySelector('div > div > div');
            expect(innerLine).toBeInTheDocument();
            expect(innerLine).toHaveAttribute(
                'style',
                expect.stringMatching(/background-color:\s*red/)
            );
        });
    });
});
