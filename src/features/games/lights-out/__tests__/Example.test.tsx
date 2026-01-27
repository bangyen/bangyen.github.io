import { render, screen } from '@testing-library/react';

import Example from '../Example';
import * as chaseHandlers from '../chaseHandlers';

// Mock chaseHandlers
jest.mock('../chaseHandlers', () => ({
    getStates: jest.fn(),
}));

// Mock CustomGrid to avoid complex rendering and animations
jest.mock('../../../../components/ui/CustomGrid', () => ({
    CustomGrid: jest.fn(({ cellProps, rows, cols }) => (
        <div data-testid="custom-grid">
            {Array.from({ length: rows * cols }).map((_, i) => {
                const r = Math.floor(i / cols);
                const c = i % cols;
                const props = cellProps(r, c);
                return <div key={i} data-testid={`cell-${r}-${c}`} {...props} />;
            })}
        </div>
    )),
}));

describe('Lights Out Example Component', () => {
    const mockGetStates = chaseHandlers.getStates as jest.Mock;
    const mockPalette = { primary: 'red', secondary: 'blue' };

    beforeEach(() => {
        const grid3x3 = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        mockGetStates.mockReturnValue({
            boardStates: [grid3x3, grid3x3],
            inputStates: [grid3x3],
            outputStates: [grid3x3],
        });
    });

    it('renders without crashing', () => {
        render(<Example size={100} palette={mockPalette} />);
        expect(screen.getAllByTestId('custom-grid').length).toBeGreaterThan(0);
    });

    it('calls getStates with correct start and dims', () => {
        const start = [1, 2, 3];
        render(<Example size={100} palette={mockPalette} start={start} dims={3} />);
        expect(mockGetStates).toHaveBeenCalledWith(start, 3);
    });

    it('passes cellProps to CustomGrid', () => {
        // The mock CustomGrid calls cellProps.
        // We verified cellProps generates props in the component code.
        // Here we just ensure the grid is rendered.
        render(<Example size={100} palette={mockPalette} />);
        // There are multiple grids (board, input, output) so multiple cell-0-0
        expect(screen.getAllByTestId('cell-0-0').length).toBeGreaterThan(0);
    });
});
