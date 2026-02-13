import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { HeroSection } from '../HeroSection';

import { PERSONAL_INFO } from '@/config/constants';

// Mock scrollIntoView
globalThis.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('HeroSection and Sub-components', () => {
    test('renders personal info correctly', () => {
        render(<HeroSection />);

        expect(screen.getByText(PERSONAL_INFO.name)).toBeInTheDocument();
        expect(screen.getByText(PERSONAL_INFO.title)).toBeInTheDocument();
        expect(screen.getByText(PERSONAL_INFO.location)).toBeInTheDocument();
        expect(screen.getByText(/Hello, I'm/i)).toBeInTheDocument();
    });

    test('renders Tech Stack section', () => {
        render(<HeroSection />);
        expect(screen.getByText('Tech Stack')).toBeInTheDocument();
        // Check for specific skills from constants
        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('PyTorch')).toBeInTheDocument();
    });

    test('renders Connect section', () => {
        render(<HeroSection />);
        expect(screen.getByText("Let's Connect")).toBeInTheDocument();
        expect(screen.getByText('View GitHub')).toBeInTheDocument();
        expect(screen.getByText('Available for Projects')).toBeInTheDocument();
    });

    test('View Work button scrolls to featured-work', () => {
        // Create the element that scrollIntoView targets
        const featuredWork = document.createElement('div');
        featuredWork.id = 'featured-work';
        document.body.append(featuredWork);

        render(<HeroSection />);

        const viewWorkBtn = screen.getByText('View Work');
        fireEvent.click(viewWorkBtn);

        expect(featuredWork.scrollIntoView).toHaveBeenCalledWith(
            expect.objectContaining({
                behavior: 'smooth',
                block: 'start',
            }),
        );

        featuredWork.remove();
    });

    test('handles missing element gracefully on View Work click', () => {
        // No featured-work element in body
        render(<HeroSection />);
        const viewWorkBtn = screen.getByText('View Work');

        // Should not throw
        expect(() => fireEvent.click(viewWorkBtn)).not.toThrow();
    });
});
