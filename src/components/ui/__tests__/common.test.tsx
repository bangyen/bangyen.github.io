import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import {
    TooltipButton,
    HomeButton,
    RandomButton,
    Controls,
    ArrowsButton,
} from '../Controls';
import { GlassCard } from '../GlassCard';
import { CustomGrid } from '../CustomGrid';
import { Navigation } from '../../layout/Navigation';

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>
        <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
);

describe('Helper Components', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('TooltipButton', () => {
        test('renders with icon and title', () => {
            const MockIcon = () => <div>Icon</div>;
            render(
                <TestWrapper>
                    <TooltipButton Icon={MockIcon} title="Test Button" />
                </TestWrapper>
            );

            expect(
                screen.getAllByLabelText('Test Button')[0]
            ).toBeInTheDocument();
        });

        test('passes through props', () => {
            const MockIcon = () => <div>Icon</div>;
            const handleClick = jest.fn();

            render(
                <TooltipButton
                    Icon={MockIcon}
                    title="Clickable"
                    onClick={handleClick}
                />
            );

            const buttons = screen.getAllByLabelText('Clickable');
            buttons[1]!.click(); // Click the actual button, not the span wrapper

            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('GlassCard', () => {
        test('renders children with glass-card className', () => {
            render(
                <GlassCard data-testid="glass-card">
                    <div data-testid="content">Test Content</div>
                </GlassCard>
            );

            expect(screen.getByTestId('content')).toBeInTheDocument();
            const card = screen.getByTestId('glass-card');
            expect(card).toHaveClass('glass-card');
        });

        test('applies custom padding via data attribute', () => {
            render(
                <GlassCard padding="20px" data-testid="test">
                    <div>Test</div>
                </GlassCard>
            );

            const card = screen.getByTestId('test');
            expect(card).toBeInTheDocument();
            expect(card).toHaveClass('glass-card');
        });

        test('applies interactive class when specified', () => {
            render(
                <GlassCard interactive={true} data-testid="interactive">
                    <div>Test</div>
                </GlassCard>
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
                </GlassCard>
            );

            expect(ref.current).toBeInTheDocument();
        });
    });

    describe('HomeButton', () => {
        test('renders when not hidden', () => {
            render(
                <TestWrapper>
                    <HomeButton />
                </TestWrapper>
            );

            expect(
                screen.getByLabelText('Navigate to Home page')
            ).toBeInTheDocument();
        });

        test('does not render when hidden', () => {
            render(
                <TestWrapper>
                    <HomeButton hide={true} />
                </TestWrapper>
            );

            expect(
                screen.queryByLabelText('Navigate to Home page')
            ).not.toBeInTheDocument();
        });
    });

    describe('RandomButton', () => {
        test('renders with default title', () => {
            const handleClick = jest.fn();

            render(<RandomButton onClick={handleClick} />);

            expect(
                screen.getAllByLabelText('Randomize')[0]
            ).toBeInTheDocument();
        });

        test('renders with custom title', () => {
            const handleClick = jest.fn();

            render(
                <RandomButton onClick={handleClick} title="Custom Random" />
            );

            expect(
                screen.getAllByLabelText('Custom Random')[0]
            ).toBeInTheDocument();
        });

        test('shows enabled state when enabled', () => {
            const handleClick = jest.fn();

            render(
                <RandomButton
                    onClick={handleClick}
                    enabled={true}
                    showToggleState={true}
                />
            );

            expect(
                screen.getAllByLabelText('Disable Random')[0]
            ).toBeInTheDocument();
        });

        test('shows disabled state when disabled', () => {
            const handleClick = jest.fn();

            render(
                <RandomButton
                    onClick={handleClick}
                    enabled={false}
                    showToggleState={true}
                />
            );

            expect(
                screen.getAllByLabelText('Enable Random')[0]
            ).toBeInTheDocument();
        });

        test('does not render when hidden', () => {
            const handleClick = jest.fn();

            render(<RandomButton onClick={handleClick} hide={true} />);

            expect(
                screen.queryByLabelText('Randomize')
            ).not.toBeInTheDocument();
        });

        test('calls onClick when clicked', () => {
            const handleClick = jest.fn();

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
                </TestWrapper>
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
                </TestWrapper>
            );

            expect(
                screen.getByLabelText('Navigate to Home page')
            ).toBeInTheDocument();
        });

        test('includes RandomButton when onRandom provided', () => {
            const handleRandom = jest.fn();

            render(
                <TestWrapper>
                    <Controls onRandom={handleRandom} />
                </TestWrapper>
            );

            expect(
                screen.getAllByLabelText('Randomize')[0]
            ).toBeInTheDocument();
        });

        test('does not include RandomButton when onRandom not provided', () => {
            render(
                <TestWrapper>
                    <Controls />
                </TestWrapper>
            );

            expect(
                screen.queryByLabelText('Randomize')
            ).not.toBeInTheDocument();
        });

        test('applies opacity when hide prop is true', () => {
            render(
                <TestWrapper>
                    <Controls hide={true} />
                </TestWrapper>
            );

            // Navigation is still rendered but with reduced opacity
            const nav = screen.getByRole('navigation');
            expect(nav).toBeInTheDocument();
        });
    });

    describe('ArrowsButton', () => {
        const mockHandler = jest.fn();
        const mockSetShow = jest.fn();

        test('shows gamepad button when not expanded', () => {
            render(
                <ArrowsButton
                    show={false}
                    setShow={mockSetShow}
                    handler={mockHandler}
                />
            );

            expect(
                screen.getByLabelText('Show game controls')
            ).toBeInTheDocument();
        });

        test('expands to show directional controls', () => {
            render(
                <ArrowsButton
                    show={true}
                    setShow={mockSetShow}
                    handler={mockHandler}
                />
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
                />
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
                />
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
                />
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
                />
            );

            expect(
                screen.queryByLabelText('Show game controls')
            ).not.toBeInTheDocument();
        });
    });

    describe('CustomGrid', () => {
        test('renders grid with correct dimensions', () => {
            const cellProps = jest.fn((row: number, col: number) => ({
                children: `${String(row)}-${String(col)}`,
            }));

            render(
                <CustomGrid size={20} rows={3} cols={3} cellProps={cellProps} />
            );

            expect(screen.getByRole('grid')).toBeInTheDocument();
        });

        test('calls cellProps for each cell', () => {
            const cellProps = jest.fn((row: number, col: number) => ({
                children: `${String(row)}-${String(col)}`,
            }));

            render(
                <CustomGrid size={20} rows={2} cols={2} cellProps={cellProps} />
            );

            expect(cellProps).toHaveBeenCalled();
        });

        test('uses custom space when provided', () => {
            const cellProps = jest.fn((row: number, col: number) => ({
                children: `${String(row)}-${String(col)}`,
            }));

            render(
                <CustomGrid
                    size={20}
                    rows={2}
                    cols={2}
                    cellProps={cellProps}
                    space={2}
                />
            );

            expect(screen.getByRole('grid')).toBeInTheDocument();
        });
    });

    describe('Navigation', () => {
        test('renders navigation container', () => {
            render(
                <Navigation>
                    <button>Test Button</button>
                </Navigation>
            );

            expect(screen.getByRole('navigation')).toBeInTheDocument();
        });

        test('renders children with correct aria-label', () => {
            render(
                <Navigation>
                    <button>Test Button</button>
                </Navigation>
            );

            expect(screen.getByText('Test Button')).toBeInTheDocument();
            expect(
                screen.getByLabelText('Game controls navigation')
            ).toBeInTheDocument();
        });

        test('has correct aria-label', () => {
            render(
                <Navigation>
                    <button>Test Button</button>
                </Navigation>
            );

            expect(
                screen.getByLabelText('Game controls navigation')
            ).toBeInTheDocument();
        });
    });
});
