import { Paper, Grid } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

import {
    SPACING,
    SHADOWS,
    COMPONENT_VARIANTS,
    LAYOUT,
    ANIMATIONS,
} from '@/config/theme';

/** Fixed bottom-center Paper container for game controls. */
const navigationPaperSx: SxProps<Theme> = {
    transform: 'translateX(-50%)',
    position: 'absolute',
    bottom: SPACING.padding.xl,
    left: '50%',
    zIndex: LAYOUT.zIndex.navigation,
    ...ANIMATIONS.presets.glass,
    borderRadius: SPACING.borderRadius.lg,
    boxShadow: SHADOWS.lg,
    padding: `${SPACING.padding.sm} ${SPACING.padding.lg}`,
};

/** Inner grid container for navigation items. */
const navigationGridSx: SxProps<Theme> = {
    ...COMPONENT_VARIANTS.flexCenter,
    flexWrap: 'nowrap',
    minWidth: 0,
};

export interface NavigationProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
    opacity?: number;
}

/**
 * Fixed bottom-center navigation bar for game controls.
 * Renders a glassmorphic Paper with horizontally aligned items.
 */
export function Navigation({ children, sx, opacity }: NavigationProps) {
    return (
        <Paper
            elevation={0}
            component="nav"
            role="navigation"
            aria-label="Game controls navigation"
            onClick={e => {
                e.stopPropagation();
            }}
            sx={[navigationPaperSx, { opacity }, sx] as SxProps<Theme>}
        >
            <Grid container spacing={2} sx={navigationGridSx}>
                {children}
            </Grid>
        </Paper>
    );
}
