import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from '../HeroSection';
import { TechStack } from '../HeroSection/TechStack';
import { ConnectSection } from '../HeroSection/ConnectSection';
import { BrowserRouter } from 'react-router-dom';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock useMobile to return false (desktop mode)
jest.mock('../../../../hooks', () => ({
    ...jest.requireActual('../../../../hooks'),
    useMobile: jest.fn(() => false),
}));

describe('HeroSection Components', () => {
    describe('HeroSection', () => {
        test('renders hero content', () => {
            render(<HeroSection />);
            expect(screen.getByText(/Hello, I'm/i)).toBeInTheDocument();
        });

        test('handles "View Work" click and scrolls', () => {
            // Mock getElementById
            const mockElement = document.createElement('div');
            mockElement.id = 'featured-work';
            document.body.appendChild(mockElement);

            render(<HeroSection />);
            // In desktop mode (useMobile=false), View Work should be visible
            const viewWork = screen.getByText(/View Work/i);
            fireEvent.click(viewWork);

            expect(mockElement.scrollIntoView).toHaveBeenCalled();

            document.body.removeChild(mockElement);
        });

        test('handles missing element for scroll', () => {
            render(<HeroSection />);
            const viewWork = screen.getByText(/View Work/i);
            // Clicking when element is missing shouldn't crash
            fireEvent.click(viewWork);
        });
    });

    describe('TechStack', () => {
        test('renders skills', () => {
            render(<TechStack />);
            expect(screen.getByText(/Tech Stack/i)).toBeInTheDocument();
            expect(screen.getByText(/Python/i)).toBeInTheDocument();
        });
    });

    describe('ConnectSection', () => {
        test('renders connection links', () => {
            render(
                <BrowserRouter>
                    <ConnectSection />
                </BrowserRouter>
            );
            expect(screen.getByText(/Connect/i)).toBeInTheDocument();
            expect(screen.getByText(/View GitHub/i)).toBeInTheDocument();
            expect(
                screen.getByText(/Available for Projects/i)
            ).toBeInTheDocument();
        });
    });
});
