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
jest.mock('../../../../hooks', () => ({
    useMobile: jest.fn(() => false),
}));
jest.mock('../matrices', () => ({
    getProduct: jest.fn(() => [0, 0, 0]),
}));

// Mock MUI components
jest.mock('../../../../components/mui', () => {
    const actual = jest.requireActual<Record<string, unknown>>(
        '../../../../components/mui'
    );
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
jest.mock('../../../../components/icons', () => ({
    KeyboardArrowDown: () => <div data-testid="keyboardarrowdown-icon" />,
    Calculate: () => <div data-testid="calculate-icon" />,
    Replay: () => <div data-testid="replay-icon" />,
    NavigateBeforeRounded: () => (
        <div data-testid="navigatebeforerounded-icon" />
    ),
    NavigateNextRounded: () => <div data-testid="navigatenextrounded-icon" />,
    CloseRounded: () => <div data-testid="closerounded-icon" />,
    Refresh: () => <div data-testid="refresh-icon" />,
    MenuBookRounded: () => <div data-testid="menubookrounded-icon" />,
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
        getFrontProps: () => (_r: number, _c: number) => ({}),
        getBackProps: () => (_r: number, _c: number) => ({}),
    };

    const mockGetInput = calculator.getInput as jest.Mock;
    const mockGetOutput = calculator.getOutput as jest.Mock;
    const mockUseHandler = calculator.useHandler as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseHandler.mockReturnValue({}); // simplistic mock
        // Mock getInput to return a function that returns props with onClick
        mockGetInput.mockImplementation(
            (
                _getters: unknown,
                toggleTile: (c: number) => void,
                _isDragging: boolean,
                _setIsDragging: (v: boolean) => void,
                _draggedCols: React.RefObject<Set<number>>,
                _addDraggedCol: (c: number) => void,
                _lastTouchTime: React.RefObject<number>
            ) => {
                return (_r: number, c: number) => ({
                    onMouseDown: () => {
                        toggleTile(c);
                    },
                    'data-testid': `input-cell-${String(c)}`,
                });
            }
        );
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
});
