import React from 'react';
import { Box, Grid } from '../../../components/mui';
import { SxProps, Theme } from '@mui/material';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import { COLORS } from '../../../config/theme';
import { useMobile } from '../../../hooks';
import { EmojiEventsRounded } from '../../../components/icons';

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
                sx={[
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
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    ...(contentSx
                        ? Array.isArray(contentSx)
                            ? contentSx
                            : [contentSx]
                        : []),
                ]}
            >
                <Box
                    sx={[
                        {
                            position: 'relative',
                            width: 'fit-content',
                        },
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        ...(boardSx
                            ? Array.isArray(boardSx)
                                ? boardSx
                                : [boardSx]
                            : []),
                    ]}
                >
                    {children}
                    <Box
                        onClick={onReset}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: showTrophy ? 1 : 0,
                            transform: showTrophy ? 'scale(1)' : 'scale(0.5)',
                            visibility: showTrophy ? 'visible' : 'hidden',
                            transition:
                                'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            cursor: 'pointer',
                            zIndex: 10,
                            backgroundColor: 'transparent',
                        }}
                    >
                        {boardSize > 0 && (
                            <EmojiEventsRounded
                                sx={{
                                    fontSize: `${(boardSize * iconSizeRatio).toString()}rem`,
                                    color: useSecondaryTrophy
                                        ? secondaryColor
                                        : primaryColor,
                                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
            {controls}
        </Grid>
    );
}
