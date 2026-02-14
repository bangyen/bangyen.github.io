import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import React, { forwardRef } from 'react';

import { SPACING, COMPONENT_VARIANTS } from '@/config/theme';

/**
 * Props for GlassCard component.
 */
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Content to render inside the card */
    children: ReactNode;
    /** Padding around content (default: SPACING.padding.md) */
    padding?: number | string;
    /** Additional MUI sx props */
    sx?: SxProps<Theme>;
    /** CSS class name */
    className?: string;
    /** Whether to apply interactive hover effects */
    interactive?: boolean;
}

/**
 * Glassmorphism-styled card component with blur effect and semi-transparent background.
 *
 * Features:
 * - Frosted glass aesthetic with backdrop blur
 * - Optional interactive variant with hover effects
 * - Customizable padding and styling
 * - Forward ref support for DOM access
 *
 * @param props - Component props
 * @param ref - Forwarded ref to the underlying div element
 * @returns Styled card component
 *
 * @example
 * ```tsx
 * // Basic card
 * <GlassCard>
 *   <Typography>Content</Typography>
 * </GlassCard>
 *
 * // Interactive card with custom padding
 * <GlassCard interactive padding="2rem">
 *   <Button>Click me</Button>
 * </GlassCard>
 * ```
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    function GlassCard(
        {
            children,
            padding = SPACING.padding.md,
            sx,
            className,
            interactive = false,
            ...props
        },
        ref,
    ) {
        return (
            <Box
                ref={ref}
                className={`glass-card ${className ?? ''}`}
                sx={
                    [
                        {
                            ...(interactive
                                ? COMPONENT_VARIANTS.interactiveCard
                                : COMPONENT_VARIANTS.card),
                            padding,
                        },
                        ...(Array.isArray(sx)
                            ? (sx as SxProps<Theme>[])
                            : [sx]),
                    ] as SxProps<Theme>
                }
                {...props}
            >
                {children}
            </Box>
        );
    },
);
