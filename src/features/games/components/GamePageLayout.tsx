import React from 'react';
import { Box, Grid } from '../../../components/mui';
import { SxProps, Theme } from '@mui/material';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import { COLORS } from '../../../config/theme';
import { useMobile } from '../../../hooks';
import { TrophyOverlay } from './TrophyOverlay';

/** Normalizes SxProps to an array for safe spreading in MUI sx prop. */
function toSxArray(sx: SxProps<Theme> | undefined): SxProps<Theme>[] {
    if (sx === undefined) return [];
    return (Array.isArray(sx) ? sx : [sx]) as SxProps<Theme>[];
}

interface GamePageLayoutProps {
    children: React.ReactNode;
    controls: React.ReactNode;
    infoUrl?: string;
    title?: string;
    background?: string;
    paddingBottom?: string | object;
    contentSx?: SxProps<Theme>;

    // Board helper props from GameBoard
    showTrophy?: boolean;
    onReset?: () => void;
    boardSize?: number;
    iconSizeRatio?: number;
    primaryColor?: string;
    secondaryColor?: string;
    useSecondaryTrophy?: boolean;
    boardSx?: SxProps<Theme>;
}

export function GamePageLayout({
    children,
    controls,
    infoUrl,
    _title, // Reserved for future use
    background = COLORS.surface.background,
    paddingBottom = { xs: '80px', md: '120px' },
    contentSx = {},

    // GameBoard defaults
    showTrophy = false,
    onReset,
    boardSize = 0,
    iconSizeRatio = 1.0,
    primaryColor,
    secondaryColor,
    useSecondaryTrophy = false,
    boardSx,
}: GamePageLayoutProps & { _title?: string }) {
    const _mobile = useMobile('sm');

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                background,
                position: 'relative',
                overflow: 'hidden',
                height: '100vh',
                transition: 'background 0.5s ease-in-out',
            }}
        >
            <GlobalHeader showHome={true} infoUrl={infoUrl} />
            <Box
                sx={
                    [
                        {
                            flex: 1,
                            position: 'relative',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            pb: paddingBottom,
                        },
                        ...toSxArray(contentSx),
                    ] as SxProps<Theme>
                }
            >
                <Box
                    sx={
                        [
                            {
                                position: 'relative',
                                width: 'fit-content',
                            },
                            ...toSxArray(boardSx),
                        ] as SxProps<Theme>
                    }
                >
                    {children}
                    <TrophyOverlay
                        show={showTrophy}
                        onReset={onReset}
                        size={boardSize}
                        iconSizeRatio={iconSizeRatio}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        useSecondary={useSecondaryTrophy}
                    />
                </Box>
            </Box>
            {controls}
        </Grid>
    );
}
