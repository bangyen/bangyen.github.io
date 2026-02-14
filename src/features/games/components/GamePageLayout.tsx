import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { GameErrorBoundary } from './GameErrorBoundary';
import { TrophyOverlay } from './TrophyOverlay';
import { BOARD_STYLES } from '../config';

import { PageLayout } from '@/components/layout/PageLayout';
import { Box } from '@/components/mui';
import { COLORS } from '@/config/theme';
import { toSxArray } from '@/utils/muiUtils';

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
    onClick?: (e: React.MouseEvent) => void;
}

/**
 * Standard layout wrapper for all game pages. Provides sensible defaults
 * for board padding, text selection, trophy colors, and error handling so
 * individual game pages only need to specify what differs.
 */
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
    iconSizeRatio = 1,
    primaryColor = COLORS.primary.main,
    secondaryColor = COLORS.primary.main,
    useSecondaryTrophy = false,
    boardSx,
    onClick,
}: GamePageLayoutProps & { _title?: string }) {
    return (
        <GameErrorBoundary>
            <PageLayout
                infoUrl={infoUrl}
                background={background}
                containerSx={{
                    height: '100vh',
                    transition: 'background 0.5s ease-in-out',
                    cursor: onClick ? 'pointer' : 'inherit',
                }}
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={onClick}
            >
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
                                    userSelect: 'none',
                                    padding: {
                                        xs: BOARD_STYLES.PADDING.MOBILE,
                                        sm: BOARD_STYLES.PADDING.DESKTOP,
                                    },
                                    borderRadius: BOARD_STYLES.BORDER_RADIUS,
                                    border: BOARD_STYLES.BORDER,
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
            </PageLayout>
        </GameErrorBoundary>
    );
}
