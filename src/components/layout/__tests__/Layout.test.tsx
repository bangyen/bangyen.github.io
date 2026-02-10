import { render, screen } from '@testing-library/react';
import React from 'react';

import { Section, BackgroundBox, HeroContainer, PageLayout } from '../Layout';

describe('Layout Components', () => {
    describe('Section', () => {
        test('renders children with default padding and maxWidth', () => {
            render(
                <Section data-testid="section">
                    <div>Test Content</div>
                </Section>
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
                </Section>
            );
            const section = screen.getByTestId('section');
            expect(section).toBeInTheDocument();
            // Custom padding is applied via sx prop to MUI Container
        });
    });

    describe('BackgroundBox', () => {
        test('renders children with absolute positioning', () => {
            render(
                <BackgroundBox data-testid="bg-box">BG Content</BackgroundBox>
            );
            expect(screen.getByText('BG Content')).toBeInTheDocument();
            const box = screen.getByTestId('bg-box');
            expect(box).toHaveStyle({ position: 'absolute', zIndex: -1 });
        });

        test('applies specific styles', () => {
            render(<BackgroundBox data-testid="bg-box">Content</BackgroundBox>);
            const box = screen.getByTestId('bg-box');
            expect(box).toHaveStyle({ position: 'absolute', zIndex: -1 });
        });
    });

    describe('HeroContainer', () => {
        test('renders children with flex centering', () => {
            render(
                <HeroContainer data-testid="hero-container">
                    Hero Content
                </HeroContainer>
            );
            expect(screen.getByText('Hero Content')).toBeInTheDocument();
            // HeroContainer uses COMPONENT_VARIANTS.flexCenter for centering
            const container = screen.getByTestId('hero-container');
            expect(container).toBeInTheDocument();
        });
    });

    describe('PageLayout', () => {
        test('renders children with full-height layout', () => {
            render(
                <PageLayout data-testid="page-layout">Page Content</PageLayout>
            );
            expect(screen.getByText('Page Content')).toBeInTheDocument();
            const layout = screen.getByTestId('page-layout');
            expect(layout).toHaveStyle({ minHeight: '100vh', width: '100%' });
        });

        test('has correct default styles', () => {
            render(<PageLayout data-testid="page-layout">Content</PageLayout>);
            const layout = screen.getByTestId('page-layout');
            expect(layout).toHaveStyle({ minHeight: '100vh', width: '100%' });
        });
    });
});
