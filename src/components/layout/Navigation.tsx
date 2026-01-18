import React, { ReactNode } from 'react';
import { Paper, Grid } from '../mui';
import {
    COLORS,
    SPACING,
    SHADOWS,
    COMPONENT_VARIANTS,
} from '../../config/theme';

interface NavigationProps {
    children: ReactNode;
    [key: string]: any;
}

export function Navigation({ children, ...rest }: NavigationProps) {
    return (
        <Paper
            elevation={0}
            component="nav"
            role="navigation"
            aria-label="Game controls navigation"
            sx={{
                transform: 'translateX(-50%)',
                position: 'absolute',
                bottom: 50,
                left: '50%',
                zIndex: 10,
                backgroundColor: COLORS.surface.glass,
                backdropFilter: 'blur(24px) saturate(180%)',
                border: `1px solid ${COLORS.border.subtle}`,
                borderRadius: SPACING.borderRadius.lg,
                boxShadow: SHADOWS.lg,
                padding: '16px 24px',
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
