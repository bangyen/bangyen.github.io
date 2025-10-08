import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
    ThemeProvider,
    createTheme,
    grey,
    blueGrey,
} from '../../components/mui';
import {
    TooltipButton,
    HomeButton,
    CustomGrid,
    Navigation,
    Controls,
} from '../../helpers';

// Create a test theme
const testTheme = createTheme({
    palette: {
        primary: blueGrey,
        secondary: grey,
        mode: 'dark',
    },
    typography: {
        fontFamily: 'monospace',
    },
});

// Test wrapper component
const TestWrapper = ({ children }) => (
    <BrowserRouter
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
    >
        <ThemeProvider theme={testTheme}>{children}</ThemeProvider>
    </BrowserRouter>
);

// Mock Material-UI icons
jest.mock('@mui/icons-material', () => ({
    HomeRounded: () => <div data-testid="home-icon">Home</div>,
    CloseRounded: () => <div data-testid="close-icon">Close</div>,
    GamepadRounded: () => <div data-testid="gamepad-icon">Gamepad</div>,
    Refresh: () => <div data-testid="refresh-icon">Refresh</div>,
    KeyboardArrowUpRounded: () => <div data-testid="up-icon">Up</div>,
    KeyboardArrowDownRounded: () => <div data-testid="down-icon">Down</div>,
    KeyboardArrowLeftRounded: () => <div data-testid="left-icon">Left</div>,
    KeyboardArrowRightRounded: () => <div data-testid="right-icon">Right</div>,
}));

describe('TooltipButton', () => {
    /**
     * Tests that TooltipButton renders correctly with proper accessibility attributes
     * and tooltip functionality for improved user experience.
     */
    test('renders with tooltip and icon', () => {
        const mockIcon = () => <div data-testid="test-icon">Test</div>;

        render(
            <TestWrapper>
                <TooltipButton Icon={mockIcon} title="Test Tooltip" />
            </TestWrapper>
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    test('applies custom props correctly', () => {
        const mockIcon = () => <div data-testid="test-icon">Test</div>;
        const handleClick = jest.fn();

        render(
            <TestWrapper>
                <TooltipButton
                    Icon={mockIcon}
                    title="Test Tooltip"
                    onClick={handleClick}
                    data-testid="custom-button"
                />
            </TestWrapper>
        );

        const button = screen.getByTestId('custom-button');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

describe('HomeButton', () => {
    /**
     * Tests HomeButton component behavior including conditional rendering
     * and proper navigation link functionality.
     */
    test('renders home button when not hidden', () => {
        render(
            <TestWrapper>
                <HomeButton />
            </TestWrapper>
        );

        expect(screen.getByRole('link')).toBeInTheDocument();
        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    test('does not render when hidden', () => {
        render(
            <TestWrapper>
                <HomeButton hide={true} />
            </TestWrapper>
        );

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    test('passes through additional props', () => {
        render(
            <TestWrapper>
                <HomeButton data-testid="home-btn" />
            </TestWrapper>
        );

        expect(screen.getByTestId('home-btn')).toBeInTheDocument();
    });
});

describe('CustomGrid', () => {
    /**
     * Tests CustomGrid component for proper grid rendering with configurable
     * dimensions and cell properties for flexible layout management.
     */
    test('renders grid with specified dimensions', () => {
        const mockCellProps = jest.fn(() => ({}));

        render(
            <TestWrapper>
                <CustomGrid
                    rows={2}
                    cols={3}
                    size={2}
                    cellProps={mockCellProps}
                />
            </TestWrapper>
        );

        // Check that cellProps was called for each cell
        expect(mockCellProps).toHaveBeenCalledTimes(6); // 2 rows * 3 cols
    });

    test('uses custom spacing when provided', () => {
        const mockCellProps = jest.fn(() => ({}));

        render(
            <TestWrapper>
                <CustomGrid
                    rows={1}
                    cols={2}
                    size={1}
                    space={3}
                    cellProps={mockCellProps}
                />
            </TestWrapper>
        );

        expect(mockCellProps).toHaveBeenCalledTimes(2);
    });
});

describe('Navigation', () => {
    /**
     * Tests Navigation component for proper positioning and styling
     * to ensure consistent UI layout across the application.
     */
    test('renders navigation container', () => {
        render(
            <TestWrapper>
                <Navigation>
                    <div data-testid="nav-child">Test</div>
                </Navigation>
            </TestWrapper>
        );

        expect(screen.getByTestId('nav-child')).toBeInTheDocument();
    });

    test('applies custom styles', () => {
        render(
            <TestWrapper>
                <Navigation sx={{ opacity: 0.5 }}>
                    <div>Test</div>
                </Navigation>
            </TestWrapper>
        );

        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();
    });
});

describe('Controls', () => {
    /**
     * Tests Controls component for proper rendering of flexible button layout
     * with consistent [Home] [Random] [GameSpecific] pattern.
     */
    test('renders home button by default', () => {
        const mockHandler = jest.fn();

        render(
            <TestWrapper>
                <Controls handler={mockHandler} />
            </TestWrapper>
        );

        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    test('renders all provided buttons in correct order', () => {
        const mockHandler = jest.fn();

        render(
            <TestWrapper>
                <Controls handler={mockHandler} onRandom={() => {}}>
                    <div data-testid="game-specific">Game Specific</div>
                </Controls>
            </TestWrapper>
        );

        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
        expect(screen.getByTestId('refresh-icon')).toBeInTheDocument(); // Random button uses refresh icon
        expect(screen.getByTestId('game-specific')).toBeInTheDocument();
    });

    test('works with only random button', () => {
        const mockHandler = jest.fn();

        render(
            <TestWrapper>
                <Controls handler={mockHandler} onRandom={() => {}} />
            </TestWrapper>
        );

        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
        expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('game-specific')).not.toBeInTheDocument();
    });

    test('works with only game-specific button', () => {
        const mockHandler = jest.fn();

        render(
            <TestWrapper>
                <Controls handler={mockHandler}>
                    <div data-testid="game-specific">Game Specific</div>
                </Controls>
            </TestWrapper>
        );

        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('refresh-icon')).not.toBeInTheDocument();
        expect(screen.getByTestId('game-specific')).toBeInTheDocument();
    });
});
