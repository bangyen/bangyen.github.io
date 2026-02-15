import { Container, Box } from '@mui/material';
import React from 'react';

import { SPACING, COMPONENT_VARIANTS, COLORS } from '@/config/theme';

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
 * Props for BackgroundBox component.
 */
interface BackgroundBoxProps {
    /** Background content (gradients, patterns, etc.) */
    children: React.ReactNode;
    /** Additional MUI sx props */
    sx?: Record<string, unknown>;
    /** Additional props passed to Box */
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
 * Props for PageLayout component.
 */
interface PageLayoutProps {
    /** Page content */
    children: React.ReactNode;
    /** Additional MUI sx props */
    sx?: Record<string, unknown>;
    /** Additional props passed to Box */
    [key: string]: unknown;
}

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
 * BackgroundBox component provides consistent background positioning
 * for page background elements.
 */
export function BackgroundBox({ children, ...props }: BackgroundBoxProps) {
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

/**
 * Thin full-height wrapper that applies a consistent background and
 * box-model to a page's root element.  Unlike the main `PageLayout`
 * in `PageLayout.tsx` (which also renders `GlobalHeader`), this is
 * a pure styling shell with no chrome.
 */
export function PageWrapper({ children, ...props }: PageLayoutProps) {
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
