import { Box, styled } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { MouseEvent, ReactNode } from 'react';

import { TrophyOverlay, type TrophyOverlayProps } from './TrophyOverlay';
import {
    BOARD_STYLES,
    DEFAULT_CONTENT_PADDING,
    GAME_TEXT,
} from '../config/constants';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { FeatureErrorFallback } from '@/components/layout/FeatureErrorFallback';
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
    children: ReactNode;
    controls: ReactNode;
    infoUrl?: string;
    title?: string;
    background?: string;
    /** Props forwarded directly to the TrophyOverlay component. */
    trophyProps?: TrophyOverlayProps;
    /** Grouped layout style overrides (padding, content and board sx). */
    layout?: GameLayoutConfig;
    onClick?: (e: MouseEvent) => void;
}

const ContentContainer = styled(Box)({
    flex: 1,
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
});

const BoardContainer = styled(Box)({
    position: 'relative',
    width: 'fit-content',
    userSelect: 'none',
    padding: BOARD_STYLES.PADDING.MOBILE,
    '@media (min-width:600px)': {
        padding: BOARD_STYLES.PADDING.DESKTOP,
    },
    borderRadius: BOARD_STYLES.BORDER_RADIUS,
    border: BOARD_STYLES.BORDER,
});

/**
 * Standard layout wrapper for all game pages. Provides sensible defaults
 * for board padding, text selection, and trophy colors so individual game
 * pages only need to specify what differs.  Error handling is provided by
 * the route-level `RouteFeatureError` wrapper.
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
        paddingBottom = DEFAULT_CONTENT_PADDING,
        contentSx,
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
            <ErrorBoundary
                FallbackComponent={FeatureErrorFallback}
                fallbackProps={{
                    title: GAME_TEXT.errors.boardTitle,
                    resetLabel: GAME_TEXT.errors.boardReset,
                }}
            >
                <ContentContainer
                    sx={
                        [
                            { pb: paddingBottom },
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            ...(Array.isArray(contentSx)
                                ? contentSx
                                : [contentSx]),
                        ] as SxProps<Theme>
                    }
                >
                    <BoardContainer sx={boardSx}>
                        {children}
                        <TrophyOverlay {...trophyProps} />
                    </BoardContainer>
                </ContentContainer>
            </ErrorBoundary>
            {controls}
        </PageLayout>
    );
}
