import React, { forwardRef, ReactNode } from 'react';
import { Box } from '../mui';
import { SPACING, COMPONENT_VARIANTS } from '../../config/theme';
import type { SxProps, Theme } from '@mui/material/styles';

interface GlassCardProps {
    children: ReactNode;
    padding?: number | string;
    sx?: SxProps<Theme>;
    className?: string;
    interactive?: boolean;
    [key: string]: any;
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
                className={`glass-card ${className || ''}`}
                sx={{
                    ...(interactive
                        ? COMPONENT_VARIANTS.interactiveCard
                        : COMPONENT_VARIANTS.card),
                    padding,
                    ...sx,
                }}
                {...props}
            >
                {children}
            </Box>
        );
    }
);
