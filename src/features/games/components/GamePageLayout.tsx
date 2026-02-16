import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';

import { getContentSx, getBoardSx } from './GamePageLayout.styles';
import { TrophyOverlay, type TrophyOverlayProps } from './TrophyOverlay';

import { PageLayout } from '@/components/layout/PageLayout';
import { COLORS } from '@/config/theme';

/** Grouped layout-related style overrides for the game page chrome. */
export interface GameLayoutConfig {
    /** Bottom padding for the content area. */
    paddingBottom?: string | object;
    /** Additional styles merged into the content wrapper. */
    contentSx?: SxProps<Theme>;
    /** Additional styles merged into the board wrapper. */
    boardSx?: SxProps<Theme>;
}

export interface GamePageLayoutProps {
    children: React.ReactNode;
    controls: React.ReactNode;
    infoUrl?: string;
    title?: string;
    background?: string;
    /** Props forwarded directly to the TrophyOverlay component. */
    trophyProps?: TrophyOverlayProps;
    /** Grouped layout style overrides (padding, content and board sx). */
    layout?: GameLayoutConfig;
    onClick?: (e: React.MouseEvent) => void;
}

/**
 * Standard layout wrapper for all game pages. Provides sensible defaults
 * for board padding, text selection, and trophy colors so individual game
 * pages only need to specify what differs.  Error handling is provided by
 * the route-level `FeatureErrorLayout` wrapper.
 */
export function GamePageLayout({
    children,
    controls,
    infoUrl,
    title,
    background = COLORS.surface.background,
    trophyProps = {},
    layout = {},
    onClick,
}: GamePageLayoutProps) {
    const {
        paddingBottom = { xs: '80px', md: '120px' },
        contentSx = {},
        boardSx,
    } = layout;

    return (
        <PageLayout
            title={title}
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
            <Box sx={getContentSx(paddingBottom, contentSx)}>
                <Box sx={getBoardSx(boardSx)}>
                    {children}
                    <TrophyOverlay {...trophyProps} />
                </Box>
            </Box>
            {controls}
        </PageLayout>
    );
}
