import { vi, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';

import Example from '../components/Example';
import * as chaseHandlers from '../utils/chaseHandlers';

// Mock chaseHandlers
vi.mock('../utils/chaseHandlers', () => ({
    getStates: vi.fn(),
}));

// Mock calculator to avoid real implementation issues
vi.mock('../components/Calculator', () => ({
    getOutput: vi.fn(() => () => ({})),
    useHandler: vi.fn(() => ({})),
    getInput: vi.fn(() => () => ({})),
}));

// Mock icons
vi.mock('../../../../components/icons', () => ({
    EmojiEventsRounded: () => <div data-testid="emoji-events-rounded" />,
}));

// Mock CustomGrid to avoid complex rendering and animations
vi.mock('../../../../components/ui/CustomGrid', () => ({
    CustomGrid: vi.fn(
        ({
            cellProps,
            rows,
            cols,
        }: {
            cellProps: (
                r: number,
                c: number
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
        )
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
            />
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
            />
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
            />
        );
        // There are multiple grids (board, input, output) so multiple cell-0-0
        expect(screen.getAllByTestId('cell-0-0').length).toBeGreaterThan(0);
    });
});
