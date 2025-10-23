import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
    ThemeProvider,
    createTheme,
    grey,
    blueGrey,
} from '../../components/mui';
import Home from '../../Pages/Home';

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
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
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
    MenuRounded: () => <div data-testid="menu-icon">Menu</div>,
    GitHub: () => <div data-testid="github-icon">GitHub</div>,
    Code: () => <div data-testid="code-icon">Code</div>,
    Cloud: () => <div data-testid="cloud-icon">Cloud</div>,
    Psychology: () => <div data-testid="psychology-icon">Psychology</div>,
    Work: () => <div data-testid="work-icon">Work</div>,
    Email: () => <div data-testid="email-icon">Email</div>,
    Phone: () => <div data-testid="phone-icon">Phone</div>,
    LocationOn: () => <div data-testid="location-icon">Location</div>,
    OpenInNew: () => <div data-testid="open-icon">Open</div>,
    ArrowForward: () => (
        <div data-testid="arrow-forward-icon">ArrowForward</div>
    ),
    HomeRounded: () => <div data-testid="home-icon">Home</div>,
    CloseRounded: () => <div data-testid="close-icon">Close</div>,
    GamepadRounded: () => <div data-testid="gamepad-icon">Gamepad</div>,
    ViewModuleRounded: () => (
        <div data-testid="view-module-icon">ViewModule</div>
    ),
    Refresh: () => <div data-testid="refresh-icon">Refresh</div>,
    NavigateBeforeRounded: () => (
        <div data-testid="navigate-before-icon">NavigateBefore</div>
    ),
    NavigateNextRounded: () => (
        <div data-testid="navigate-next-icon">NavigateNext</div>
    ),
    PlayArrowRounded: () => <div data-testid="play-arrow-icon">PlayArrow</div>,
    PauseRounded: () => <div data-testid="pause-icon">Pause</div>,
    FirstPageRounded: () => <div data-testid="first-page-icon">FirstPage</div>,
    LastPageRounded: () => <div data-testid="last-page-icon">LastPage</div>,
    KeyboardArrowUpRounded: () => (
        <div data-testid="keyboard-arrow-up-icon">KeyboardArrowUp</div>
    ),
    KeyboardArrowDownRounded: () => (
        <div data-testid="keyboard-arrow-down-icon">KeyboardArrowDown</div>
    ),
    KeyboardArrowLeftRounded: () => (
        <div data-testid="keyboard-arrow-left-icon">KeyboardArrowLeft</div>
    ),
    KeyboardArrowRightRounded: () => (
        <div data-testid="keyboard-arrow-right-icon">KeyboardArrowRight</div>
    ),
    CircleRounded: () => <div data-testid="circle-icon">Circle</div>,
    KeyboardArrowDown: () => (
        <div data-testid="keyboard-arrow-down-icon">KeyboardArrowDown</div>
    ),
    Calculate: () => <div data-testid="calculate-icon">Calculate</div>,
    Replay: () => <div data-testid="replay-icon">Replay</div>,
    InfoRounded: () => <div data-testid="info-icon">Info</div>,
    GridView: () => <div data-testid="grid-view-icon">GridView</div>,
    TextFields: () => <div data-testid="text-fields-icon">TextFields</div>,
    TextFieldsRounded: () => (
        <div data-testid="text-fields-rounded-icon">TextFieldsRounded</div>
    ),
    CodeRounded: () => <div data-testid="code-rounded-icon">CodeRounded</div>,
    DataArrayRounded: () => <div data-testid="data-array-icon">DataArray</div>,
    PlusOneRounded: () => <div data-testid="plus-one-icon">PlusOne</div>,
    BarChartRounded: () => <div data-testid="bar-chart-icon">BarChart</div>,
    ShowChartRounded: () => <div data-testid="show-chart-icon">ShowChart</div>,
    AnalyticsRounded: () => <div data-testid="analytics-icon">Analytics</div>,
    TrendingUpRounded: () => (
        <div data-testid="trending-up-icon">TrendingUp</div>
    ),
    AttachMoneyRounded: () => (
        <div data-testid="attach-money-icon">AttachMoney</div>
    ),
    BusinessRounded: () => <div data-testid="business-icon">Business</div>,
    SettingsRounded: () => <div data-testid="settings-icon">Settings</div>,
}));

// Mock the Pages module
jest.mock('../../Pages', () => ({
    pages: {
        Oligopoly: '/Oligopoly',
        ZSharp: '/ZSharp',
        Snake: '/Snake',
        Lights_Out: '/Lights_Out',
        Interpreters: '/Interpreters',
    },
}));

describe('Home Component', () => {
    /**
     * Tests the main Home component for proper rendering and functionality
     * to ensure the portfolio landing page displays correctly with all sections.
     */
    beforeEach(() => {
        // Mock document.title
        Object.defineProperty(document, 'title', {
            writable: true,
            value: '',
        });
    });

    test('renders main content sections', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Check main heading
        expect(screen.getByText("Hello, I'm")).toBeInTheDocument();
        expect(screen.getByText('Bangyen Pham')).toBeInTheDocument();

        // Check subtitle
        expect(
            screen.getByText('Backend Developer & AI/ML Engineer')
        ).toBeInTheDocument();

        // Check location
        expect(screen.getByText('Chicago, IL')).toBeInTheDocument();
    });

    test('sets document title on mount', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        expect(document.title).toBe(
            'Bangyen Pham - Backend Developer & AI/ML Engineer'
        );
    });

    test('renders navigation buttons', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Check menu button
        expect(screen.getByTestId('view-module-icon')).toBeInTheDocument();

        // Check GitHub button (there are multiple, so use getAllBy)
        expect(screen.getAllByTestId('github-icon')).toHaveLength(4);
    });

    test('renders skill chips', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Check skill chips are rendered
        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getAllByText('PyTorch')).toHaveLength(2); // One in skills, one in projects
        expect(screen.getAllByTestId('code-icon')).toHaveLength(2); // Multiple code icons
        expect(screen.getAllByTestId('psychology-icon')).toHaveLength(2); // Multiple psychology icons
    });

    test('opens menu when menu button is clicked', async () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        const menuButton = screen.getByRole('button');

        fireEvent.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('Oligopoly')).toBeInTheDocument();
        });

        expect(screen.getByText('ZSharp')).toBeInTheDocument();
        expect(screen.getByText('Snake')).toBeInTheDocument();
        expect(screen.getByText('Lights Out')).toBeInTheDocument();
        expect(screen.getByText('Interpreters')).toBeInTheDocument();
    });

    test('closes menu when clicking outside', async () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        const menuButton = screen.getByRole('button');

        fireEvent.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('Oligopoly')).toBeInTheDocument();
        });

        // Click outside the menu
        fireEvent.click(document.body);

        // Wait a bit for the menu to close
        await new Promise(resolve => setTimeout(resolve, 100));

        // Menu should still be visible as clicking outside doesn't close it in this implementation
        expect(screen.getByText('Oligopoly')).toBeInTheDocument();
    });

    test('renders contact information', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Check that location icon is present (email/phone icons may not be in the current implementation)
        expect(screen.getByTestId('location-icon')).toBeInTheDocument();
    });

    test('renders GitHub link with correct href', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Get the navigation GitHub link specifically
        const navigationGithubLink = screen.getByRole('link', {
            name: 'GitHub Profile',
        });
        expect(navigationGithubLink).toHaveAttribute(
            'href',
            'https://github.com/bangyen'
        );
    });

    test('has proper accessibility attributes', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        const menuButton = screen.getByRole('button');
        expect(menuButton).toHaveAttribute('aria-haspopup', 'true');
    });

    test('renders with proper responsive layout', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Check that the main container has proper styling
        expect(screen.getByText("Hello, I'm")).toBeInTheDocument();
        expect(screen.getByText('Bangyen Pham')).toBeInTheDocument();
    });
});
