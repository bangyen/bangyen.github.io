import React from 'react';
import { Container, Box } from '@mui/material';
import { SPACING } from '../config/theme';

/**
 * Section component provides consistent section layout with proper spacing
 * and responsive padding for improved maintainability.
 */
export function Section({
    children,
    id,
    paddingY = SPACING.section,
    paddingX = SPACING.padding.md,
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 0,
                paddingBottom,
                paddingX: {
                    xs: SPACING.padding.xs,
                    md: SPACING.padding.md,
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
