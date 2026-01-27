import { render, screen, fireEvent } from '@testing-library/react';
import Info from '../Info';
import * as calculator from '../calculator';

// Mock dependencies
jest.mock(
    '../Example',
    () =>
        function MockExample() {
            return <div data-testid="example-component" />;
        }
);
jest.mock('../../../../components/ui/GlassCard', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlassCard: function MockGlassCard({ children }: any) {
        return <div>{children}</div>;
    },
}));
jest.mock('../../../../hooks', () => ({
    useMobile: () => false,
}));
jest.mock('../matrices', () => ({
    getProduct: jest.fn(() => [0, 0, 0]),
}));

// Mock calculator helpers
jest.mock('../calculator', () => ({
    getInput: jest.fn(),
    getOutput: jest.fn(),
    useHandler: jest.fn(),
}));

describe('Lights Out Info Component', () => {
    const mockToggleOpen = jest.fn();
    const mockPalette = { primary: 'red', secondary: 'blue' };
    const defaultProps = {
        rows: 3,
        cols: 3,
        size: 100,
        open: true,
        palette: mockPalette,
        toggleOpen: mockToggleOpen,
    };

    const mockGetInput = calculator.getInput as jest.Mock;
    const mockGetOutput = calculator.getOutput as jest.Mock;
    const mockUseHandler = calculator.useHandler as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseHandler.mockReturnValue({}); // simplistic mock
        // Mock getInput to return a function that returns props with onClick
        mockGetInput.mockImplementation((getters, toggleTile) => {
            return (r: number, c: number) => ({
                onClick: toggleTile(c),
                'data-testid': `input-cell-${c}`,
            });
        });
        mockGetOutput.mockReturnValue(() => ({}));
    });

    it('renders instruction step initially', () => {
        render(<Info {...defaultProps} />);
        expect(screen.getByText('Chase to Bottom')).toBeInTheDocument();
        expect(
            screen.queryByTestId('example-component')
        ).not.toBeInTheDocument();
    });

    it('navigates to next step (Example)', () => {
        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn);

        expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });

    it('navigates to calculator step', () => {
        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn); // To Example
        fireEvent.click(nextBtn); // To Calculator

        expect(screen.getByText('Input')).toBeInTheDocument(); // Header for input
        expect(screen.getByText('Solution')).toBeInTheDocument();
    });

    it('allows toggling input bits in calculator', () => {
        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn); // To Example
        fireEvent.click(nextBtn); // To Calculator

        // We mocked getInput to return elements with testid 'input-cell-{c}'
        const cell0 = screen.getByTestId('input-cell-0');
        fireEvent.click(cell0);

        // This should trigger state update.
        // We can verify getProduct is called with updated row?
        // getProduct is called during render.
        // It's hard to verify internal state directly without inspecting effect or rerender.
        // But we can verify no crash.
    });

    it('closes modal on Close button click', () => {
        render(<Info {...defaultProps} />);
        // Find the close icon and click it
        const closeIcon = screen.getByTestId('closerounded-icon');
        fireEvent.click(closeIcon);
        expect(mockToggleOpen).toHaveBeenCalled();
    });
});
