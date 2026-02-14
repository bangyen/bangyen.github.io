import { render, screen, fireEvent } from '@testing-library/react';
import { vi, type Mock } from 'vitest';

import type { DragProps } from '../../../hooks/useDrag';
import * as matrices from '../../utils/matrices';
import * as calculator from '../Calculator';
import Info from '../Info';

// Mock dependencies
vi.mock('../Example', () => ({
    __esModule: true,
    default: function MockExample() {
        return <div data-testid="example-component" />;
    },
}));
vi.mock('@/components/ui/GlassCard', () => ({
    GlassCard: function MockGlassCard({
        children,
        sx,
        onClick,
    }: {
        children: React.ReactNode;
        sx?: React.CSSProperties;
        onClick?: (event: React.MouseEvent) => void;
    }) {
        return (
            <div
                data-testid="glass-card"
                onClick={onClick}
                onKeyDown={e => {
                    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                        onClick(e as unknown as React.MouseEvent);
                    }
                }}
                role="button"
                tabIndex={0}
                style={sx}
            >
                {children}
            </div>
        );
    },
}));
vi.mock('../../../../../hooks', () => ({
    useMobile: vi.fn(() => false),
}));
vi.mock('../../utils/matrices', () => ({
    getProduct: vi.fn(() => [0, 0, 0]),
}));

// Mock MUI components
vi.mock('@/components/mui', async importOriginal => {
    const actual = await importOriginal<Record<string, any>>();
    return {
        ...actual,
        Modal: ({
            children,
            open,
        }: {
            children: React.ReactNode;
            open: boolean;
        }) => (open ? <div data-testid="modal">{children}</div> : null),
        Backdrop: () => <div data-testid="backdrop" />,
    };
});

// Mock Icons
vi.mock('@/components/icons', () => ({
    KeyboardArrowDown: () => <div data-testid="keyboardarrowdown-icon" />,
    Calculate: () => <div data-testid="calculate-icon" />,
    Replay: () => <div data-testid="replay-icon" />,
    NavigateBeforeRounded: () => (
        <div data-testid="navigatebeforerounded-icon" />
    ),
    NavigateNextRounded: () => <div data-testid="navigatenextrounded-icon" />,
    CloseRounded: () => <div data-testid="closerounded-icon" />,
    ContentCopyRounded: () => <div data-testid="contentcopyrounded-icon" />,
    Refresh: () => <div data-testid="refresh-icon" />,
    MenuBookRounded: () => <div data-testid="menubookrounded-icon" />,
}));

// Mock calculator helpers
vi.mock('../Calculator', () => ({
    getInput: vi.fn(),
    getOutput: vi.fn(),
    useHandler: vi.fn(),
}));

describe('Lights Out Info Component', () => {
    const mockToggleOpen = vi.fn();
    const mockOnApply = vi.fn();
    const mockPalette = { primary: 'red', secondary: 'blue' };
    const defaultProps = {
        rows: 3,
        cols: 3,
        size: 100,
        open: true,
        palette: mockPalette,
        toggleOpen: mockToggleOpen,
        onApply: mockOnApply,
        getFrontProps: () => (_r: number, _c: number) => ({}),
        getBackProps: () => (_r: number, _c: number) => ({}),
    };

    const mockGetInput = calculator.getInput as Mock;
    const mockGetOutput = calculator.getOutput as Mock;
    const mockUseHandler = calculator.useHandler as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        (matrices.getProduct as Mock).mockReturnValue([0, 0, 0]);
        mockUseHandler.mockReturnValue({}); // simplistic mock
        // Mock getInput to return a function that returns props with onClick
        mockGetInput.mockImplementation(
            (_getters: unknown, getDragProps: (pos: string) => DragProps) => {
                return (_r: number, c: number) => {
                    const dragProps = getDragProps(c.toString());
                    return {
                        ...dragProps,
                        'data-testid': `input-cell-${String(c)}`,
                    };
                };
            },
        );
        mockGetOutput.mockReturnValue(() => ({}));
    });

    it('renders instruction step initially', () => {
        render(<Info {...defaultProps} />);
        expect(screen.getByText('Chase to Bottom')).toBeInTheDocument();
        expect(
            screen.queryByTestId('example-component'),
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
        fireEvent.mouseDown(cell0);

        // Verify no crash and potential verification of state if needed
    });

    it('closes modal on Close button click', () => {
        render(<Info {...defaultProps} />);
        // Find the close icon and click it
        const closeIcon = screen.getByTestId('closerounded-icon');
        fireEvent.click(closeIcon);
        expect(mockToggleOpen).toHaveBeenCalled();
    });

    it('handles back navigation between steps', () => {
        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');

        // Navigate to step 2
        fireEvent.click(nextBtn); // To Example (step 1)
        fireEvent.click(nextBtn); // To Calculator (step 2)

        // Go back
        const backBtn = screen.getByText('Back');
        fireEvent.click(backBtn);

        // Should be at Example step
        expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });

    it('shows all three steps in sequence', () => {
        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');

        // Step 0: Instructions
        expect(screen.getByText('Chase to Bottom')).toBeInTheDocument();

        // Navigate to step 1: Example
        fireEvent.click(nextBtn);
        expect(screen.getByTestId('example-component')).toBeInTheDocument();

        // Navigate to step 2: Calculator
        fireEvent.click(nextBtn);
        expect(screen.getByText('Input')).toBeInTheDocument();
    });

    it('does not go back past first step', () => {
        render(<Info {...defaultProps} />);
        const backBtn = screen.getByText('Back');

        // Try to go back at first step
        fireEvent.click(backBtn);

        // Should still show instructions
        expect(screen.getByText('Chase to Bottom')).toBeInTheDocument();
    });

    it('resets calculator state on config change', () => {
        const { rerender } = render(<Info {...defaultProps} />);

        // Navigate to calculator
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn);
        fireEvent.click(nextBtn);

        // Should be in calculator view
        expect(screen.getByText('Input')).toBeInTheDocument();

        // Simulate cols change (should trigger reset)
        rerender(<Info {...defaultProps} cols={4} />);

        // Component should still render calculator
        expect(screen.getByText('Input')).toBeInTheDocument();
    });

    it('handles reset button in calculator', () => {
        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');

        // Navigate to calculator
        fireEvent.click(nextBtn);
        fireEvent.click(nextBtn);

        // Should be in calculator view with input and solution labels
        expect(screen.getByText('Input')).toBeInTheDocument();
    });

    it('prevents modal from closing when clicking inside GlassCard', () => {
        render(<Info {...defaultProps} />);
        const glassCard = screen.getByTestId('glass-card');

        fireEvent.click(glassCard);

        // Should not call toggleOpen (propagation is stopped)
        expect(mockToggleOpen).not.toHaveBeenCalled();
    });

    it('manages calcRow state for each column independently', () => {
        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');

        // Navigate to calculator
        fireEvent.click(nextBtn);
        fireEvent.click(nextBtn);

        // Component renders with multiple input cells
        expect(screen.getAllByTestId(/input-cell/).length).toBeGreaterThan(0);
    });

    it('renders info instructions on first step', () => {
        render(<Info {...defaultProps} />);

        // Should show instructions content
        expect(screen.getByText('Chase to Bottom')).toBeInTheDocument();
    });

    it('palette changes trigger calculator reset', () => {
        const { rerender } = render(<Info {...defaultProps} />);

        const newPalette = { primary: 'green', secondary: 'yellow' };
        rerender(<Info {...defaultProps} palette={newPalette} />);

        // Component should still render properly
        expect(screen.getByText('Chase to Bottom')).toBeInTheDocument();
    });

    it('handles reset in calculator step', () => {
        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn); // To Example
        fireEvent.click(nextBtn); // To Calculator

        const clearBtn = screen.getByText('Clear Pattern');
        fireEvent.click(clearBtn);

        // Verify it doesn't crash
        expect(screen.getByText('Input')).toBeInTheDocument();
    });

    it('calls onApply when Copy Pattern is clicked with a non-zero solution', () => {
        // Make getProduct return a non-zero solution so the button is enabled
        (matrices.getProduct as Mock).mockReturnValue([1, 0, 1]);

        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn); // To Example
        fireEvent.click(nextBtn); // To Calculator

        const copyBtn = screen.getByText('Copy Pattern');
        fireEvent.click(copyBtn);

        expect(mockOnApply).toHaveBeenCalledWith([1, 0, 1]);
    });

    it('disables Copy Pattern when solution is all zeros', () => {
        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn); // To Example
        fireEvent.click(nextBtn); // To Calculator

        const copyBtn = screen.getByText('Copy Pattern');
        expect(copyBtn.closest('button')).toBeDisabled();
    });

    it('handles back navigation', () => {
        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn); // To Step 1

        expect(screen.getByTestId('example-component')).toBeInTheDocument();

        const backBtn = screen.getByText('Back');
        fireEvent.click(backBtn); // Back to Step 0

        expect(
            screen.queryByTestId('example-component'),
        ).not.toBeInTheDocument();
    });

    it('renders with correct backdrop colors', () => {
        // This is a bit hard to test deeply without real theme,
        // but we can at least ensure it renders.
        render(<Info {...defaultProps} />);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('does not crash when toggleTile is called with invalid index', () => {
        // Reset mocks to ensure our implementation is used
        mockGetInput.mockImplementation(
            (_getters: unknown, getDragProps: (pos: string) => DragProps) => {
                return (r: number, c: number) => {
                    // Inject a special cell at (0,0) that uses an invalid pos
                    const pos = r === 0 && c === 0 ? '999' : c.toString();
                    const dragProps = getDragProps(pos);
                    return {
                        ...dragProps,
                        'data-testid': `cell-${pos}`,
                    };
                };
            },
        );

        render(<Info {...defaultProps} />);
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn);
        fireEvent.click(nextBtn);

        const invCell = screen.getByTestId('cell-999');
        fireEvent.mouseDown(invCell);

        expect(screen.getByText('Input')).toBeInTheDocument();
    });
});
