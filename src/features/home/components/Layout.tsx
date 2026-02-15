import { Container, Box } from '@mui/material';
import React from 'react';

import { SPACING, COMPONENT_VARIANTS } from '@/config/theme';

/**
 * Props for Section component.
 */
interface SectionProps {
    /** Content to render inside the section */
    children: React.ReactNode;
    /** Optional ID for anchor links */
    id?: string;
    /** Vertical padding (default: SPACING.padding.lg) */
    paddingY?: string;
    /** Horizontal padding (default: SPACING.padding.lg) */
    paddingX?: string;
    /** Maximum width of content (default: SPACING.maxWidth.lg) */
    maxWidth?: string;
    /** Additional MUI sx props */
    sx?: Record<string, unknown>;
    /** Additional props passed to Container */
    [key: string]: unknown;
}

/**
 * Props for HeroContainer component.
 */
interface HeroContainerProps {
    /** Hero content to display */
    children: React.ReactNode;
    /** Bottom padding (default: '4rem') */
    paddingBottom?: string;
    /** Maximum width of content (default: SPACING.maxWidth.lg) */
    maxWidth?: string;
    /** Additional MUI sx props */
    sx?: Record<string, unknown>;
    /** Additional props passed to Container */
    [key: string]: unknown;
}

/**
 * Section component provides consistent section layout with proper spacing
 * and responsive padding for the home page's content blocks.
 */
export function Section({
    children,
    id,
    paddingY = SPACING.padding.lg,
    paddingX = SPACING.padding.lg,
    maxWidth = SPACING.maxWidth.lg,
    ...props
}: SectionProps) {
    return (
        <Container
            maxWidth={false}
            id={id}
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
 * with centered content and responsive padding for the home page.
 */
export function HeroContainer({
    children,
    paddingBottom = '4rem',
    maxWidth = SPACING.maxWidth.lg,
    ...props
}: HeroContainerProps) {
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
