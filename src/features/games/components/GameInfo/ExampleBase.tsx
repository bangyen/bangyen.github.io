import { Box, Button, styled } from '@mui/material';

import { COLORS } from '@/config/theme';

/**
 * Shared container for the example animation. Supports side-by-side
 * layout on desktop and stacked layout on mobile.
 */
export const ExampleContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(4),
    width: '100%',
    maxWidth: '800px',
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        gap: theme.spacing(8),
    },
}));

/**
 * Shared action button group for the example animation.
 * Positions controls (Play/Pause, Step Back/Next, Toggles) in a grid.
 */
export const ExampleActions = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(1.5),
    justifyContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '320px',
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr',
        width: 'auto',
        maxWidth: 'none',
    },
}));

/**
 * Shared action button used within the ExampleActions group.
 * Matches the platform's glassmorphism aesthetic.
 */
export const ExampleActionButton = styled(Button)(({ theme }) => ({
    borderColor: COLORS.border.subtle,
    color: COLORS.text.secondary,
    width: '140px',
    [theme.breakpoints.up('sm')]: {
        width: '180px',
    },
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    '& .MuiButton-startIcon': {
        marginRight: theme.spacing(0.5),
        [theme.breakpoints.up('sm')]: {
            marginRight: theme.spacing(1),
        },
    },
}));
