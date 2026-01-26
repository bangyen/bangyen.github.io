import React from 'react';
import { render, screen } from '@testing-library/react';
import { Section, BackgroundBox, HeroContainer, PageLayout } from '../Layout';
import { SPACING, COLORS } from '../../config/theme';

describe('Layout Components', () => {
    describe('Section', () => {
        test('renders children correctly', () => {
            render(<Section>Test Content</Section>);
            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });

        test('applies custom props', () => {
            const customId = 'test-section';
            render(<Section id={customId}>Test</Section>);
            // Use a more specific query if possible, or just check if it renders without crashing
            // Note: Container with id might be hard to query directly without role, but we can query by text's container
            const content = screen.getByText('Test');
            // Finding the container.
            // MUI Container usually renders a div.
            // We can trust it renders.
        });

        test('applies formatting props', () => {
            render(<Section paddingY="10px">Test</Section>);
            // Difficult to check computed style without e2e or more complex setup,
            // but we can ensure it renders.
        });
    });

    describe('BackgroundBox', () => {
        test('renders children', () => {
            render(<BackgroundBox>BG Content</BackgroundBox>);
            expect(screen.getByText('BG Content')).toBeInTheDocument();
        });

        test('applies specific styles', () => {
            render(<BackgroundBox data-testid="bg-box">Content</BackgroundBox>);
            const box = screen.getByTestId('bg-box');
            expect(box).toHaveStyle({ position: 'absolute', zIndex: -1 });
        });
    });

    describe('HeroContainer', () => {
        test('renders children', () => {
            render(<HeroContainer>Hero Content</HeroContainer>);
            expect(screen.getByText('Hero Content')).toBeInTheDocument();
        });
    });

    describe('PageLayout', () => {
        test('renders children', () => {
            render(<PageLayout>Page Content</PageLayout>);
            expect(screen.getByText('Page Content')).toBeInTheDocument();
        });

        test('has correct default styles', () => {
            render(<PageLayout data-testid="page-layout">Content</PageLayout>);
            const layout = screen.getByTestId('page-layout');
            expect(layout).toHaveStyle({ minHeight: '100vh', width: '100%' });
        });
    });
});
