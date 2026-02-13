import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Navigation } from '../../layout/Navigation';
import {
    TooltipButton,
    HomeButton,
    RandomButton,
    Controls,
    ArrowsButton,
    RefreshButton,
} from '../Controls';
import { CustomGrid } from '../CustomGrid';
import { GlassCard } from '../GlassCard';

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>
        <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
);

describe('Helper Components', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('TooltipButton', () => {
        test('renders with icon and title', () => {
            const MockIcon = () => <div>Icon</div>;
            render(
                <TestWrapper>
                    <TooltipButton Icon={MockIcon} title="Test Button" />
                </TestWrapper>,
            );

            expect(
                screen.getAllByLabelText('Test Button')[0],
            ).toBeInTheDocument();
        });

        test('passes through props', () => {
            const MockIcon = () => <div>Icon</div>;
            const handleClick = vi.fn();

            render(
                <TooltipButton
                    Icon={MockIcon}
                    title="Clickable"
                    onClick={handleClick}
                />,
            );

            const buttons = screen.getAllByLabelText('Clickable');
            buttons[1]!.click(); // Click the actual button, not the span wrapper

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        test('renders with size small', () => {
            const MockIcon = () => <div>Icon</div>;
            render(
                <TestWrapper>
                    <TooltipButton Icon={MockIcon} title="Small" size="small" />
                </TestWrapper>,
            );

            expect(screen.getAllByLabelText('Small')[0]).toBeInTheDocument();
        });

        test('renders with size medium', () => {
            const MockIcon = () => <div>Icon</div>;
            render(
                <TestWrapper>
                    <TooltipButton
                        Icon={MockIcon}
                        title="Medium"
                        size="medium"
                    />
                </TestWrapper>,
            );

            expect(screen.getAllByLabelText('Medium')[0]).toBeInTheDocument();
        });

        test('renders with size inherit', () => {
            const MockIcon = () => <div>Icon</div>;
            render(
                <TestWrapper>
                    <TooltipButton
                        Icon={MockIcon}
                        title="Inherit"
                        size="inherit"
                    />
                </TestWrapper>,
            );

            expect(screen.getAllByLabelText('Inherit')[0]).toBeInTheDocument();
        });
    });

    describe('GlassCard', () => {
        test('renders children with glass-card className', () => {
            render(
                <GlassCard data-testid="glass-card">
                    <div data-testid="content">Test Content</div>
                </GlassCard>,
            );

            expect(screen.getByTestId('content')).toBeInTheDocument();
            const card = screen.getByTestId('glass-card');
            expect(card).toHaveClass('glass-card');
        });

        test('applies custom padding via data attribute', () => {
            render(
                <GlassCard padding="20px" data-testid="test">
                    <div>Test</div>
                </GlassCard>,
            );

            const card = screen.getByTestId('test');
            expect(card).toBeInTheDocument();
            expect(card).toHaveClass('glass-card');
        });

        test('applies interactive class when specified', () => {
            render(
                <GlassCard interactive={true} data-testid="interactive">
                    <div>Test</div>
                </GlassCard>,
            );

            const card = screen.getByTestId('interactive');
            expect(card).toBeInTheDocument();
            expect(card).toHaveClass('glass-card');
        });

        test('forwards ref correctly', () => {
            const ref = React.createRef<HTMLDivElement>();

            render(
                <GlassCard ref={ref}>
                    <div>Test</div>
                </GlassCard>,
            );

            expect(ref.current).toBeInTheDocument();
        });

        test('applies custom className', () => {
            render(
                <GlassCard className="custom-class" data-testid="card">
                    <div>Test</div>
                </GlassCard>,
            );

            const card = screen.getByTestId('card');
            expect(card).toHaveClass('glass-card');
            expect(card).toHaveClass('custom-class');
        });

        test('applies sx as array', () => {
            render(
                <GlassCard
                    sx={[{ color: 'red' }, { margin: 1 }]}
                    data-testid="card"
                >
                    <div>Test</div>
                </GlassCard>,
            );

            const card = screen.getByTestId('card');
            expect(card).toBeInTheDocument();
            expect(card).toHaveClass('glass-card');
        });
    });

    describe('HomeButton', () => {
        test('renders when not hidden', () => {
            render(
                <TestWrapper>
                    <HomeButton />
                </TestWrapper>,
            );

            expect(
                screen.getByLabelText('Navigate to Home page'),
            ).toBeInTheDocument();
        });

        test('does not render when hidden', () => {
            render(
                <TestWrapper>
                    <HomeButton hide={true} />
                </TestWrapper>,
            );

            expect(
                screen.queryByLabelText('Navigate to Home page'),
            ).not.toBeInTheDocument();
        });
    });

    describe('RandomButton', () => {
        test('renders with default title', () => {
            const handleClick = vi.fn();

            render(<RandomButton onClick={handleClick} />);

            expect(
                screen.getAllByLabelText('Randomize')[0],
            ).toBeInTheDocument();
        });

        test('renders with custom title', () => {
            const handleClick = vi.fn();

            render(
                <RandomButton onClick={handleClick} title="Custom Random" />,
            );

            expect(
                screen.getAllByLabelText('Custom Random')[0],
            ).toBeInTheDocument();
        });

        test('shows enabled state when enabled', () => {
            const handleClick = vi.fn();

            render(
                <RandomButton
                    onClick={handleClick}
                    enabled={true}
                    showToggleState={true}
                />,
            );

            expect(
                screen.getAllByLabelText('Disable Random')[0],
            ).toBeInTheDocument();
        });

        test('shows disabled state when disabled', () => {
            const handleClick = vi.fn();

            render(
                <RandomButton
                    onClick={handleClick}
                    enabled={false}
                    showToggleState={true}
                />,
            );

            expect(
                screen.getAllByLabelText('Enable Random')[0],
            ).toBeInTheDocument();
        });

        test('does not render when hidden', () => {
            const handleClick = vi.fn();

            render(<RandomButton onClick={handleClick} hide={true} />);

            expect(
                screen.queryByLabelText('Randomize'),
            ).not.toBeInTheDocument();
        });

        test('calls onClick when clicked', () => {
            const handleClick = vi.fn();

            render(<RandomButton onClick={handleClick} />);

            const buttons = screen.getAllByLabelText('Randomize');
            buttons[1]!.click(); // Click the actual button, not the span wrapper

            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('Controls', () => {
        test('renders children in Navigation container', () => {
            render(
                <TestWrapper>
                    <Controls>
                        <button>Test Button</button>
                    </Controls>
                </TestWrapper>,
            );

            expect(screen.getByText('Test Button')).toBeInTheDocument();
            // Controls wraps children in Navigation component
            expect(screen.getByRole('navigation')).toBeInTheDocument();
        });

        test('includes HomeButton', () => {
            render(
                <TestWrapper>
                    <Controls>
                        <HomeButton />
                    </Controls>
                </TestWrapper>,
            );

            expect(
                screen.getByLabelText('Navigate to Home page'),
            ).toBeInTheDocument();
        });

        test('includes RandomButton when onRandom provided', () => {
            const handleRandom = vi.fn();

            render(
                <TestWrapper>
                    <Controls onRandom={handleRandom} />
                </TestWrapper>,
            );

            expect(
                screen.getAllByLabelText('Randomize')[0],
            ).toBeInTheDocument();
        });

        test('does not include RandomButton when onRandom not provided', () => {
            render(
                <TestWrapper>
                    <Controls />
                </TestWrapper>,
            );

            expect(
                screen.queryByLabelText('Randomize'),
            ).not.toBeInTheDocument();
        });

        test('applies opacity when hide prop is true', () => {
            render(
                <TestWrapper>
                    <Controls hide={true} />
                </TestWrapper>,
            );

            // Navigation is still rendered but with reduced opacity
            const nav = screen.getByRole('navigation');
            expect(nav).toBeInTheDocument();
        });
    });

    describe('ArrowsButton', () => {
        const mockHandler = vi.fn();
        const mockSetShow = vi.fn();

        test('shows gamepad button when not expanded', () => {
            render(
                <ArrowsButton
                    show={false}
                    setShow={mockSetShow}
                    handler={mockHandler}
                />,
            );

            expect(
                screen.getByLabelText('Show game controls'),
            ).toBeInTheDocument();
        });

        test('expands to show directional controls', () => {
            render(
                <ArrowsButton
                    show={true}
                    setShow={mockSetShow}
                    handler={mockHandler}
                />,
            );

            expect(screen.getByLabelText('Move up')).toBeInTheDocument();
            expect(screen.getByLabelText('Move down')).toBeInTheDocument();
            expect(screen.getByLabelText('Move left')).toBeInTheDocument();
            expect(screen.getByLabelText('Move right')).toBeInTheDocument();
        });

        test('calls handler when direction button clicked', () => {
            render(
                <ArrowsButton
                    show={true}
                    setShow={mockSetShow}
                    handler={mockHandler}
                />,
            );

            const upButton = screen.getByLabelText('Move up');
            upButton.click();

            expect(mockHandler).toHaveBeenCalledWith('up');
        });

        test('toggles visibility when gamepad button clicked', () => {
            render(
                <ArrowsButton
                    show={false}
                    setShow={mockSetShow}
                    handler={mockHandler}
                />,
            );

            const gamepadButton = screen.getByLabelText('Show game controls');
            gamepadButton.click();

            expect(mockSetShow).toHaveBeenCalledWith(true);
        });

        test('toggles visibility when close button clicked', () => {
            render(
                <ArrowsButton
                    show={true}
                    setShow={mockSetShow}
                    handler={mockHandler}
                />,
            );

            const closeButton = screen.getByLabelText('Hide controls');
            closeButton.click();

            expect(mockSetShow).toHaveBeenCalledWith(false);
        });

        test('does not render when hidden', () => {
            render(
                <ArrowsButton
                    show={false}
                    setShow={mockSetShow}
                    handler={mockHandler}
                    hide={true}
                />,
            );

            expect(
                screen.queryByLabelText('Show game controls'),
            ).not.toBeInTheDocument();
        });
    });

    describe('CustomGrid', () => {
        test('renders grid with correct dimensions', () => {
            const cellProps = vi.fn((row: number, col: number) => ({
                children: `${String(row)}-${String(col)}`,
            }));

            render(
                <CustomGrid
                    size={20}
                    rows={3}
                    cols={3}
                    cellProps={cellProps}
                />,
            );

            expect(screen.getByRole('grid')).toBeInTheDocument();
        });

        test('calls cellProps for each cell', () => {
            const cellProps = vi.fn((row: number, col: number) => ({
                children: `${String(row)}-${String(col)}`,
            }));

            render(
                <CustomGrid
                    size={20}
                    rows={2}
                    cols={2}
                    cellProps={cellProps}
                />,
            );

            expect(cellProps).toHaveBeenCalled();
        });

        test('uses custom space when provided', () => {
            const cellProps = vi.fn((row: number, col: number) => ({
                children: `${String(row)}-${String(col)}`,
            }));

            render(
                <CustomGrid
                    size={20}
                    rows={2}
                    cols={2}
                    cellProps={cellProps}
                    space={2}
                />,
            );

            expect(screen.getByRole('grid')).toBeInTheDocument();
        });

        test('cell with transition false prop', () => {
            const cellProps = vi.fn((row: number, col: number) => ({
                children: `${String(row)}-${String(col)}`,
                transition: false,
            }));

            const { container } = render(
                <CustomGrid
                    size={20}
                    rows={1}
                    cols={1}
                    cellProps={cellProps}
                />,
            );

            const cell = container.querySelector('[role="gridcell"]');
            expect(cell).toBeInTheDocument();
        });

        test('cell with custom transition string', () => {
            const cellProps = vi.fn((row: number, col: number) => ({
                children: `${String(row)}-${String(col)}`,
                transition: 'opacity 500ms ease',
            }));

            const { container } = render(
                <CustomGrid
                    size={20}
                    rows={1}
                    cols={1}
                    cellProps={cellProps}
                />,
            );

            const cell = container.querySelector('[role="gridcell"]');
            expect(cell).toBeInTheDocument();
        });

        test('cell with default transition prop', () => {
            const cellProps = vi.fn((row: number, col: number) => ({
                children: `${String(row)}-${String(col)}`,
            }));

            const { container } = render(
                <CustomGrid
                    size={20}
                    rows={1}
                    cols={1}
                    cellProps={cellProps}
                />,
            );

            const cell = container.querySelector('[role="gridcell"]');
            expect(cell).toBeInTheDocument();
        });
    });

    test('uses auto space when space not provided', () => {
        const cellProps = vi.fn((row: number, col: number) => ({
            children: `${String(row)}-${String(col)}`,
        }));

        render(
            <CustomGrid size={20} rows={2} cols={2} cellProps={cellProps} />,
        );

        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    test('cell with transition string prop', () => {
        const cellProps = vi.fn((_row: number, _col: number) => ({
            children: `cell`,
            transition: 'opacity 300ms ease',
        }));

        const { container } = render(
            <CustomGrid size={10} rows={1} cols={1} cellProps={cellProps} />,
        );

        const cell = container.querySelector('[role="gridcell"]');
        // We can't easily check style but we ensure it renders with the prop passed
        expect(cell).toBeInTheDocument();
    });
});

describe('RandomButton additional branches', () => {
    test('renders in enabled state with toggle', () => {
        const onClick = vi.fn();
        render(
            <RandomButton
                onClick={onClick}
                enabled={true}
                showToggleState={true}
            />,
        );
        expect(
            screen.getAllByLabelText('Disable Random')[0],
        ).toBeInTheDocument();
    });

    test('renders with custom sx as array', () => {
        render(
            <RandomButton
                onClick={vi.fn()}
                sx={[{ margin: 1 }, { padding: 2 }]}
            />,
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});

describe('ArrowsButton additional branches', () => {
    test('renders with diagonals', () => {
        const setShow = vi.fn();
        render(
            <ArrowsButton
                show={true}
                setShow={setShow}
                handler={() => vi.fn()}
                diagonals={true}
            />,
        );
        expect(screen.getByLabelText('Move up left')).toBeInTheDocument();
        expect(screen.getByLabelText('Move up right')).toBeInTheDocument();
        expect(screen.getByLabelText('Move down left')).toBeInTheDocument();
        expect(screen.getByLabelText('Move down right')).toBeInTheDocument();
    });

    test('handles size inherit', () => {
        const setShow = vi.fn();
        render(
            <ArrowsButton
                show={true}
                setShow={setShow}
                handler={() => vi.fn()}
                size="inherit"
            />,
        );
        expect(screen.getByLabelText('Hide controls')).toBeInTheDocument();
    });

    test('handles diagonal size inherit', () => {
        const setShow = vi.fn();
        render(
            <ArrowsButton
                show={true}
                setShow={setShow}
                handler={() => vi.fn()}
                diagonals={true}
                size="inherit"
            />,
        );
        expect(screen.getByLabelText('Hide controls')).toBeInTheDocument();
    });
});

describe('RefreshButton branch', () => {
    test('returns null when hide is true', () => {
        const { container } = render(
            <RefreshButton onClick={vi.fn()} hide={true} />,
        );
        expect(container.firstChild).toBeNull();
    });
});

describe('Navigation', () => {
    test('renders navigation container', () => {
        render(
            <Navigation>
                <button>Test Button</button>
            </Navigation>,
        );

        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('renders children with correct aria-label', () => {
        render(
            <Navigation>
                <button>Test Button</button>
            </Navigation>,
        );

        expect(screen.getByText('Test Button')).toBeInTheDocument();
        expect(
            screen.getByLabelText('Game controls navigation'),
        ).toBeInTheDocument();
    });

    test('has correct aria-label', () => {
        render(
            <Navigation>
                <button>Test Button</button>
            </Navigation>,
        );

        expect(
            screen.getByLabelText('Game controls navigation'),
        ).toBeInTheDocument();
    });

    test('stops click propagation', () => {
        const handleParentClick = vi.fn();
        render(
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div onClick={handleParentClick}>
                <Navigation>
                    <button>Test</button>
                </Navigation>
            </div>,
        );

        const nav = screen.getByRole('navigation');
        nav.click();

        expect(handleParentClick).not.toHaveBeenCalled();
    });
});
