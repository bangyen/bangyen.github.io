import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Interpreters from '../Interpreters';

// Mock child components
vi.mock('../../Text/StunStep', () => ({
    default: function MockStunStep({
        navigation,
    }: {
        navigation: React.ReactNode;
    }) {
        return (
            <div data-testid="stun-step">StunStep Interpreter {navigation}</div>
        );
    },
}));
vi.mock('../../Text/Suffolk', () => ({
    default: function MockSuffolk({
        navigation,
    }: {
        navigation: React.ReactNode;
    }) {
        return (
            <div data-testid="suffolk">Suffolk Interpreter {navigation}</div>
        );
    },
}));
vi.mock('../../Grid/WII2D', () => ({
    default: function MockWII2D({
        navigation,
    }: {
        navigation: React.ReactNode;
    }) {
        return <div data-testid="wii2d">WII2D Interpreter {navigation}</div>;
    },
}));
vi.mock('../../Grid/Back', () => ({
    default: function MockBack({
        navigation,
    }: {
        navigation: React.ReactNode;
    }) {
        return <div data-testid="back">Back Interpreter {navigation}</div>;
    },
}));

// Mock navigation to test interaction
vi.mock('../../components/InterpreterNavigation', () => ({
    InterpreterNavigation: ({
        active,
        onChange,
    }: {
        active: string;
        onChange: (v: string) => void;
    }) => (
        <select
            data-testid="nav-select"
            value={active}
            onChange={e => {
                onChange(e.target.value);
            }}
        >
            <option value="stun-step">StunStep</option>
            <option value="suffolk">Suffolk</option>
            <option value="wii2d">WII2D</option>
            <option value="back">Back</option>
        </select>
    ),
}));
vi.mock('@/components/ui/TooltipButton', () => ({
    TooltipButton: ({ title }: { title: string }) => (
        <button aria-label={title}>{title}</button>
    ),
}));

vi.mock('@/components/ui/Controls', () => ({
    TooltipButton: ({ title }: { title: string }) => (
        <button aria-label={title}>{title}</button>
    ),
    Controls: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

// Mock the ThemeProvider since we just need the context to exist
vi.mock('@/hooks/useTheme', () => ({
    useThemeContext: () => ({
        mode: 'light',
        resolvedMode: 'light',
        toggleTheme: vi.fn(),
    }),
}));

describe('Interpreters Page Integration', () => {
    const renderWithRouter = (initialEntry = '/interpreters') => {
        return render(
            <MemoryRouter initialEntries={[initialEntry]}>
                <Routes>
                    <Route path="/interpreters" element={<Interpreters />} />
                </Routes>
            </MemoryRouter>
        );
    };

    test('renders StunStep by default', () => {
        renderWithRouter();
        expect(screen.getByTestId('stun-step')).toBeInTheDocument();
    });

    test('renders Suffolk based on URL param', () => {
        renderWithRouter('/interpreters?type=suffolk');
        expect(screen.getByTestId('suffolk')).toBeInTheDocument();
    });

    test('renders WII2D based on URL param', () => {
        renderWithRouter('/interpreters?type=wii2d');
        expect(screen.getByTestId('wii2d')).toBeInTheDocument();
    });

    test('renders Back based on URL param', () => {
        renderWithRouter('/interpreters?type=back');
        expect(screen.getByTestId('back')).toBeInTheDocument();
    });

    test('renders default interpreter (StunStep) for unknown param', () => {
        renderWithRouter('/interpreters?type=unknown');
        expect(screen.getByTestId('stun-step')).toBeInTheDocument();
    });

    test('switches interpreter when navigation changes', () => {
        renderWithRouter();

        // Default
        expect(screen.getByTestId('stun-step')).toBeInTheDocument();

        // Switch to WII2D
        fireEvent.change(screen.getByTestId('nav-select'), {
            target: { value: 'wii2d' },
        });

        expect(screen.getByTestId('wii2d')).toBeInTheDocument();
        expect(screen.queryByTestId('stun-step')).not.toBeInTheDocument();
    });
});
