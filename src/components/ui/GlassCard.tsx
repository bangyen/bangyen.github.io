import React, { forwardRef, ReactNode } from 'react';
import { Box } from '../mui';
import { SPACING, COMPONENT_VARIANTS } from '../../config/theme';
import type { SxProps, Theme } from '@mui/material/styles';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padding?: number | string;
    sx?: SxProps<Theme>;
    className?: string;
    interactive?: boolean;
}

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
        ref
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
    }
);
