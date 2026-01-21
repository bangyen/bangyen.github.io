import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Interpreters from '../Interpreters';

// Mock child components
jest.mock(
    '../../Text/StunStep',
    () =>
        function MockStunStep({ navigation }: { navigation: React.ReactNode }) {
            return (
                <div data-testid="stun-step">
                    StunStep Interpreter {navigation}
                </div>
            );
        }
);
jest.mock(
    '../../Text/Suffolk',
    () =>
        function MockSuffolk({ navigation }: { navigation: React.ReactNode }) {
            return (
                <div data-testid="suffolk">
                    Suffolk Interpreter {navigation}
                </div>
            );
        }
);
jest.mock(
    '../../Grid/WII2D',
    () =>
        function MockWII2D({ navigation }: { navigation: React.ReactNode }) {
            return (
                <div data-testid="wii2d">WII2D Interpreter {navigation}</div>
            );
        }
);
jest.mock(
    '../../Grid/Back',
    () =>
        function MockBack({ navigation }: { navigation: React.ReactNode }) {
            return <div data-testid="back">Back Interpreter {navigation}</div>;
        }
);

// Mock navigation to test interaction
jest.mock('../../components/InterpreterNavigation', () => ({
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
            onChange={e => onChange(e.target.value)}
        >
            <option value="stun-step">StunStep</option>
            <option value="suffolk">Suffolk</option>
            <option value="wii2d">WII2D</option>
            <option value="back">Back</option>
        </select>
    ),
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
