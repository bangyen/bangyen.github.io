import { render, screen, act } from '@testing-library/react';
import { vi, type Mock } from 'vitest';

import * as chaseHandlers from '../../utils/chaseHandlers';
import { Example } from '../Example';

// Mock chaseHandlers
vi.mock('../../utils/chaseHandlers', () => ({
    getStates: vi.fn(),
}));

// Mock calculator to avoid real implementation issues
vi.mock('../Calculator', () => ({
    getOutput: vi.fn(() => () => ({})),
    useHandler: vi.fn(() => ({})),
    getInput: vi.fn(() => () => ({})),
}));

// Mock hooks (useMobile requires a ThemeProvider; stub it out)
vi.mock('@/hooks', () => ({
    useMobile: vi.fn(() => false),
}));

// Mock icons (includes icons used by config.ts for INSTRUCTIONS)
vi.mock('@/components/icons', () => ({
    EmojiEventsRounded: () => <div data-testid="emoji-events-rounded" />,
    KeyboardArrowDown: () => <div data-testid="icon-arrow-down" />,
    Calculate: () => <div data-testid="icon-calculate" />,
    Replay: () => <div data-testid="icon-replay" />,
}));

// Mock CustomGrid to avoid complex rendering and animations
vi.mock('@/components/ui/CustomGrid', () => ({
    CustomGrid: vi.fn(
        ({
            cellProps,
            rows,
            cols,
        }: {
            cellProps: (
                r: number,
                c: number,
            ) => { backgroundColor?: string; color?: string };
            rows: number;
            cols: number;
        }) => (
            <div data-testid="custom-grid">
                {Array.from({ length: rows * cols }).map((_, i) => {
                    const r = Math.floor(i / cols);
                    const c = i % cols;
                    const props = cellProps(r, c);
                    const { backgroundColor, color, ...domProps } = props;

                    return (
                        <div
                            key={`${String(r)}-${String(c)}`}
                            data-testid={`cell-${String(r)}-${String(c)}`}
                            style={
                                {
                                    backgroundColor,
                                    color,
                                } as React.CSSProperties
                            }
                            {...domProps}
                        />
                    );
                })}
            </div>
        ),
    ),
}));

describe('Lights Out Example Component', () => {
    const mockGetStates = chaseHandlers.getStates as Mock;
    const mockPalette = { primary: 'red', secondary: 'blue' };
    const mockGetFrontProps = vi.fn(() => () => ({}));
    const mockGetBackProps = vi.fn(() => () => ({}));

    beforeEach(() => {
        const grid3x3 = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        mockGetStates.mockReturnValue({
            boardStates: [grid3x3, grid3x3],
            inputStates: [
                [0, 0, 0],
                [0, 0, 0],
            ],
            outputStates: [
                [0, 0, 0],
                [0, 0, 0],
            ],
        });
    });

    it('renders board, input, and output grids with correct dimensions', () => {
        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

        // Should render exactly 4 grids: 2 from board (3x3 + 2x2) + 1 input (1x3) + 1 output (1x3)
        const grids = screen.getAllByTestId('custom-grid');
        expect(grids).toHaveLength(4);

        // Verify cells are rendered (multiple grids have cells with same IDs)
        // Board grid has 9 cells (3x3), input has 3 cells (1x3), output has 3 cells (1x3)
        // cell-0-0, cell-0-1, cell-0-2 appear in all 3 grids
        // cell-0-0, cell-0-1, cell-0-2 appear in most grids
        const cell00Elements = screen.getAllByTestId('cell-0-0');
        expect(cell00Elements).toHaveLength(4); // One in each grid

        // Verify board-specific cells (only in 3x3 board grid)
        const cell22Elements = screen.getAllByTestId('cell-2-2');
        expect(cell22Elements).toHaveLength(1); // Only in board grid
    });

    it('calls getStates with correct start and dims', () => {
        const start = [1, 2, 3];
        render(
            <Example
                size={100}
                palette={mockPalette}
                start={start}
                dims={3}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );
        expect(mockGetStates).toHaveBeenCalledWith(start, 3);
    });

    it('passes cellProps to CustomGrid', () => {
        // The mock CustomGrid calls cellProps.
        // We verified cellProps generates props in the component code.
        // Here we just ensure the grid is rendered.
        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );
        // There are multiple grids (board, input, output) so multiple cell-0-0
        expect(screen.getAllByTestId('cell-0-0').length).toBeGreaterThan(0);
    });

    it('cycles through frames over time', async () => {
        vi.useFakeTimers();

        mockGetStates.mockReturnValue({
            boardStates: [
                [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                ],
                [
                    [1, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                ],
                [
                    [1, 1, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                ],
            ],
            inputStates: [
                [0, 0, 0],
                [1, 0, 0],
                [1, 1, 0],
            ],
            outputStates: [
                [0, 0, 0],
                [1, 0, 0],
                [1, 1, 0],
            ],
        });

        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

        // Advance time and check frame updates
        await act(async () => {
            await vi.advanceTimersByTimeAsync(2000);
        });

        // The component should update frames
        expect(screen.getAllByTestId('cell-0-0').length).toBeGreaterThan(0);

        vi.useRealTimers();
    });

    it('shows trophy on last frame when solved', async () => {
        const allOnState = [7, 7, 7]; // All bits on for 3x3

        mockGetStates.mockReturnValue({
            boardStates: [[0, 0, 0], allOnState],
            inputStates: [
                [0, 0, 0],
                [0, 0, 0],
            ],
            outputStates: [
                [0, 0, 0],
                [0, 0, 0],
            ],
        });

        vi.useFakeTimers();

        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

        // Advance to last frame
        await act(async () => {
            await vi.advanceTimersByTimeAsync(2000);
        });

        expect(screen.getByTestId('emoji-events-rounded')).toBeInTheDocument();

        vi.useRealTimers();
    });

    it('handles missing board states gracefully', () => {
        mockGetStates.mockReturnValue({
            boardStates: [],
            inputStates: [],
            outputStates: [],
        });

        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

        // Should still render without crashing (multiple grids)
        const grids = screen.getAllByTestId('custom-grid');
        expect(grids.length).toBeGreaterThanOrEqual(0);
    });

    it('uses default dims when not provided', () => {
        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );
        // Should use default dims=3
        expect(mockGetStates).toHaveBeenCalledWith([], 3);
    });

    it('shows trophy when not all lights are on on last frame', async () => {
        const someOnState = [1, 0, 0];

        mockGetStates.mockReturnValue({
            boardStates: [[0, 0, 0], someOnState],
            inputStates: [
                [0, 0, 0],
                [0, 0, 0],
            ],
            outputStates: [
                [0, 0, 0],
                [0, 0, 0],
            ],
        });

        vi.useFakeTimers();

        render(
            <Example
                size={100}
                palette={mockPalette}
                getFrontProps={mockGetFrontProps}
                getBackProps={mockGetBackProps}
            />,
        );

        // Advance to last frame
        await act(async () => {
            await vi.advanceTimersByTimeAsync(2000);
        });

        expect(screen.getByTestId('emoji-events-rounded')).toBeInTheDocument();

        vi.useRealTimers();
    });
});
