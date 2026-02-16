import { Paper, Grid } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

import { navigationPaperSx, navigationGridSx } from './Navigation.styles';

import { toSxArray } from '@/utils/muiUtils';

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
            sx={
                [
                    ...toSxArray(navigationPaperSx),
                    { opacity },
                    ...toSxArray(sx),
                ] as SxProps<Theme>
            }
        >
            <Grid container spacing={2} sx={navigationGridSx}>
                {children}
            </Grid>
        </Paper>
    );
}
