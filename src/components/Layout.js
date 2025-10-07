import React from 'react';
import { Container, Box } from '../components/mui';
import { SPACING, COMPONENT_VARIANTS } from '../config/theme';

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
