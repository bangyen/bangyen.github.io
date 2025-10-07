import React from 'react';
import { Container, Box } from '../components/mui';
import { SPACING, COMPONENT_VARIANTS, COLORS } from '../config/theme';

/**
 * Section component provides consistent section layout with proper spacing
 * and responsive padding for improved maintainability.
 */
export function Section({
    children,
    id,
    paddingY = SPACING.padding.lg,
    paddingX = SPACING.padding.lg,
    maxWidth = SPACING.maxWidth.lg,
    ...props
}) {
    return (
        <Container
            maxWidth={false}
            sx={{
                paddingY,
                paddingX,
                ...props.sx,
            }}
            {...props}
        >
            <Box sx={{ maxWidth, margin: '0 auto' }}>{children}</Box>
        </Container>
    );
}

/**
 * BackgroundBox component provides consistent background positioning
 * for page background elements.
 */
export function BackgroundBox({ children, ...props }) {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: COLORS.surface.background,
                zIndex: -1,
                ...props.sx,
            }}
            {...props}
        >
            {children}
        </Box>
    );
}

/**
 * HeroContainer component provides consistent hero section layout
 * with centered content and responsive padding.
 */
export function HeroContainer({
    children,
    paddingBottom = '4rem',
    maxWidth = SPACING.maxWidth.lg,
    ...props
}) {
    return (
        <Container
            maxWidth={false}
            sx={{
                flex: 1,
                ...COMPONENT_VARIANTS.flexCenter,
                paddingTop: 0,
                paddingBottom,
                paddingX: {
                    xs: SPACING.padding.sm,
                    md: SPACING.padding.lg,
                },
                maxWidth: '100%',
                overflowX: 'hidden',
                ...props.sx,
            }}
            {...props}
        >
            <Box sx={{ maxWidth, margin: '0 auto' }}>{children}</Box>
        </Container>
    );
}

/**
 * PageLayout component provides consistent page layout with background,
 * full height, and proper positioning for improved maintainability.
 */
export function PageLayout({ children, ...props }) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                position: 'relative',
                background: COLORS.surface.background,
                boxSizing: 'border-box',
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'hidden',
                ...props.sx,
            }}
            {...props}
        >
            {children}
        </Box>
    );
}
