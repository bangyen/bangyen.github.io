import { Box, styled } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import React, { type ReactNode, type MouseEvent } from 'react';

import {
    BOARD_STYLES,
    DEFAULT_CONTENT_PADDING,
    GAME_TEXT,
} from '../config/constants';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { FeatureErrorFallback } from '@/components/layout/FeatureErrorFallback';
import { PageLayout } from '@/components/layout/PageLayout';
import { COLORS } from '@/config/theme';

export interface GamePageProps {
    children: ReactNode;
    title?: string;
    infoUrl?: string;
    background?: string;
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

const BoardContainerBase = styled(Box)({
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
 * GamePage Compound Component.
 * Usage:
 * <GamePage title="Lights" infoUrl="...">
 *   <GamePage.Content paddingBottom="...">
 *     <GamePage.BoardContainer sx="...">
 *       <Board ... />
 *       <TrophyOverlay />
 *     </GamePage.BoardContainer>
 *   </GamePage.Content>
 *   <GamePage.Controls>
 *     <GameControls ... />
 *   </GamePage.Controls>
 * </GamePage>
 */
export function GamePage({
    children,
    title,
    infoUrl,
    background = COLORS.surface.background,
    onClick,
}: GamePageProps) {
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
            {children}
        </PageLayout>
    );
}

GamePage.Content = function GamePageContent({
    children,
    paddingBottom = DEFAULT_CONTENT_PADDING,
    sx,
}: {
    children: ReactNode;
    paddingBottom?: string | object;
    sx?: SxProps<Theme>;
}) {
    return (
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
                        ...(Array.isArray(sx) ? sx : [sx]),
                    ] as SxProps<Theme>
                }
            >
                {children}
            </ContentContainer>
        </ErrorBoundary>
    );
};

GamePage.BoardContainer = function GamePageBoardContainer({
    children,
    sx,
}: {
    children: ReactNode;
    sx?: SxProps<Theme>;
}) {
    return <BoardContainerBase sx={sx}>{children}</BoardContainerBase>;
};

GamePage.Controls = function GamePageControls({
    children,
}: {
    children: ReactNode;
}) {
    return children;
};
