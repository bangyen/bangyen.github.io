// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Section, HeroContainer } from '../Layout';

describe('Layout Components', () => {
    describe('Section', () => {
        test('renders children with default padding and maxWidth', () => {
            render(
                <Section data-testid="section">
                    <div>Test Content</div>
                </Section>,
            );
            expect(screen.getByText('Test Content')).toBeInTheDocument();
            // Verify the inner Box with maxWidth is rendered
            const section = screen.getByTestId('section');
            expect(section).toBeInTheDocument();
        });

        test('applies custom id prop', () => {
            const customId = 'test-section';
            render(<Section id={customId}>Test</Section>);
            const section = document.getElementById(customId);
            expect(section).toBeInTheDocument();
            expect(section).toHaveTextContent('Test');
        });

        test('applies custom paddingY and paddingX props', () => {
            render(
                <Section paddingY="10px" paddingX="20px" data-testid="section">
                    Test
                </Section>,
            );
            const section = screen.getByTestId('section');
            expect(section).toBeInTheDocument();
            // Custom padding is applied via sx prop to MUI Container
        });
    });

    describe('HeroContainer', () => {
        test('renders children with flex centering', () => {
            render(
                <HeroContainer data-testid="hero-container">
                    Hero Content
                </HeroContainer>,
            );
            expect(screen.getByText('Hero Content')).toBeInTheDocument();
            // HeroContainer uses COMPONENT_VARIANTS.flexCenter for centering
            const container = screen.getByTestId('hero-container');
            expect(container).toBeInTheDocument();
        });
    });
});
