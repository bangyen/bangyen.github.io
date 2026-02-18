import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { FeatureErrorLayout } from '../FeatureErrorLayout';

vi.mock('../ErrorFallback', () => ({
    ErrorFallback: () => <div data-testid="error-fallback">Fallback</div>,
}));

const ThrowingComponent = () => {
    throw new Error('boom');
};

const HealthyComponent = () => <div>Healthy</div>;

describe('FeatureErrorLayout', () => {
    const originalConsoleError = console.error;

    beforeAll(() => {
        console.error = vi.fn();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    it('renders child routes via Outlet when no error occurs', () => {
        render(
            <MemoryRouter initialEntries={['/test']}>
                <Routes>
                    <Route element={<FeatureErrorLayout />}>
                        <Route path="/test" element={<HealthyComponent />} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('Healthy')).toBeInTheDocument();
    });

    it('renders FeatureErrorFallback with custom title when a child crashes', () => {
        render(
            <MemoryRouter initialEntries={['/crash']}>
                <Routes>
                    <Route
                        element={
                            <FeatureErrorLayout
                                title="Game Error"
                                resetLabel="Reset Game"
                            />
                        }
                    >
                        <Route path="/crash" element={<ThrowingComponent />} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('Game Error')).toBeInTheDocument();
        expect(screen.getByText('Reset Game')).toBeInTheDocument();
    });

    it('uses default title and resetLabel when not provided', () => {
        render(
            <MemoryRouter initialEntries={['/crash']}>
                <Routes>
                    <Route element={<FeatureErrorLayout />}>
                        <Route path="/crash" element={<ThrowingComponent />} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
});
