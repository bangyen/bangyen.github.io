import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { GhostCanvas } from '../GhostCanvas';
import { FORWARD, BACKWARD, CellState } from '../boardHandlers';
import { SolverMessage, Conflict, CellInfo } from '../workers/solverWorker';

// Mock slant-wasm before boardHandlers imports it (uses import.meta.url incompatible with Jest)
jest.mock('slant-wasm', () => ({
    default: jest.fn().mockResolvedValue(undefined),
    generate_puzzle_wasm: jest.fn(),
    find_cycles_wasm: jest.fn(),
}));

// Mock hooks
jest.mock('../../../../hooks', () => ({
    useMobile: () => false,
}));

jest.mock('../workerUtils', () => ({
    createWorker: () => new MockWorker('mock-url'),
}));

// Mock Worker
class MockWorker {
    url: string;
    onmessage: (msg: unknown) => void;

    constructor(stringUrl: string) {
        this.url = stringUrl;
        this.onmessage = () => {};
    }

    postMessage(msg: SolverMessage) {
        if (msg.type === 'SOLVE') {
            const { numbers, userMoves } = msg.payload;
            const conflicts: Conflict[] = [];
            const gridState = new Map<string, CellInfo>();

            // Replicate minimal test logic
            userMoves.forEach((val: CellState, key: string) => {
                gridState.set(key, { state: val, source: 'user' });
            });

            // specific test case: propagation
            if (
                numbers[0]?.[1] === 1 &&
                userMoves.has('0,0') &&
                userMoves.get('0,0') === 1
            ) {
                gridState.set('0,1', { state: 1, source: 'propagated' });
            }

            // specific test case: conflict
            if (
                numbers[0]?.[1] === 1 &&
                userMoves.has('0,0') &&
                userMoves.has('0,1')
            ) {
                if (userMoves.get('0,0') === 1 && userMoves.get('0,1') === 2) {
                    conflicts.push({ type: 'node', r: 0, c: 1 });
                }
            }

            setTimeout(() => {
                this.onmessage({
                    data: {
                        type: 'RESULT',
                        payload: {
                            gridState,
                            conflicts,
                            cycleCells: new Set(),
                        },
                    },
                });
            }, 50);
        }
    }
    terminate() {}
}
// @ts-expect-error Global mock injection for testing environment
global.Worker = MockWorker;

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
        interactive: {
            selected: 'lightgray',
            focus: 'gray',
        },
    },
    sxf: () => ({}),
    ANIMATIONS: { transition: 'none' },
    LAYOUT: { zIndex: { base: 1 } },
    SPACING: { borderRadius: { full: 999, sm: 4 } },
}));

// Mock useGameInteraction
jest.mock('../../hooks/useGameInteraction', () => ({
    useGameInteraction: ({
        onToggle,
    }: {
        onToggle: (
            r: number,
            c: number,
            right: boolean,
            val?: number,
            init?: boolean
        ) => number | undefined;
    }) => ({
        getDragProps: (pos: string) => ({
            onMouseDown: (_e: unknown) => {
                const [r, c] = pos.split(',').map(Number);
                if (r !== undefined && c !== undefined) {
                    onToggle(r, c, false, undefined, true); // isInitialClick = true
                }
            },

            onMouseEnter: (_e: unknown) => {
                // Simulate drag entering new cell
                const [r, c] = pos.split(',').map(Number);
                if (r !== undefined && c !== undefined) {
                    onToggle(r, c, false, 1, false); // draggingValue = 1 (FORWARD)
                }
            },
        }),
    }),
}));

// Mock TooltipButton
jest.mock('../../../../components/ui/TooltipButton', () => ({
    TooltipButton: () => <div data-testid="tooltip-button" />,
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
        cellProps: (
            r: number,
            c: number
        ) => {
            sx?: Record<string, unknown>;
            children: React.ReactNode;
        };
    }) => (
        <div>
            {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                    const { sx, ...props } = cellProps(r, c);
                    // Sanitize sx for style prop
                    const sanitizedStyle: Record<string, unknown> = {};
                    if (sx) {
                        Object.keys(sx).forEach(key => {
                            if (
                                !key.startsWith('&') &&
                                typeof sx[key] !== 'object'
                            ) {
                                sanitizedStyle[key] = sx[key];
                            }
                        });
                    }
                    return (
                        <div
                            key={`${String(r)}-${String(c)}`}
                            style={sanitizedStyle as React.CSSProperties}
                            {...props}
                        >
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
        const cells = document.querySelectorAll('[data-type="cell"][data-pos]');
        expect(cells.length).toBe(9); // 3x3
        const hints = document.querySelectorAll('[data-type="hint"][data-pos]');
        expect(hints.length).toBe(16); // 4x4
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
        const row0 = numbers[0];
        if (row0) {
            row0[1] = 1;
        }

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
            const cell01 = container.querySelector(
                '[data-type="cell"][data-pos="0,1"]'
            );
            expect(cell01).toBeInTheDocument();
            // Use precise traversal: Wrapper (div) -> Line (div)
            const wrapper = cell01?.firstElementChild;
            const innerLine = wrapper?.firstElementChild;
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
        const row0 = numbers[0];
        if (row0) {
            row0[1] = 1;
        }

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
            // In current implementation, NODE conflicts (hint numbers) turn red.
            // Cell lines only turn red if there is a cell-level conflict.
            // So we check the Hint element at (0,1).
            const hint01 = container.querySelector(
                '[data-type="hint"][data-pos="0,1"]'
            );
            expect(hint01).toBeInTheDocument();
            // Hint style is on the wrapper or inner?
            expect(hint01).toHaveAttribute(
                'style',
                expect.stringMatching(/background-color:\s*red/)
            );
        });
    });
});
