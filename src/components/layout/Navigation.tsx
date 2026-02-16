import { Paper, Grid } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import React from 'react';

import {
    SPACING,
    SHADOWS,
    COMPONENT_VARIANTS,
    LAYOUT,
    ANIMATIONS,
} from '@/config/theme';

export interface NavigationProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
    opacity?: number;
}

export function Navigation({ children, ...rest }: NavigationProps) {
    return (
        <Paper
            elevation={0}
            component="nav"
            role="navigation"
            aria-label="Game controls navigation"
            onClick={e => {
                e.stopPropagation();
            }}
            sx={{
                transform: 'translateX(-50%)',
                position: 'absolute',
                bottom: SPACING.padding.xl,
                left: '50%',
                zIndex: LAYOUT.zIndex.navigation,
                ...ANIMATIONS.presets.glass,
                borderRadius: SPACING.borderRadius.lg,
                boxShadow: SHADOWS.lg,
                padding: `${SPACING.padding.sm} ${SPACING.padding.lg}`,
                ...rest,
            }}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    ...COMPONENT_VARIANTS.flexCenter,
                    flexWrap: 'nowrap',
                    minWidth: 0,
                }}
            >
                {children}
            </Grid>
        </Paper>
    );
}
