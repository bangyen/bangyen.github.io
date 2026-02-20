import type { SxProps, Theme } from '@mui/material';
import React, { type ReactNode, type MouseEvent } from 'react';

import { BoardContainerBase, ContentContainer } from './GamePage.styles';
import { DEFAULT_CONTENT_PADDING, GAME_TEXT } from '../config/constants';

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
 *   <GameControls ... />
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

export interface GamePageContentProps {
    children: ReactNode;
    paddingBottom?: string | object;
    sx?: SxProps<Theme>;
}

GamePage.Content = function GamePageContent({
    children,
    paddingBottom = DEFAULT_CONTENT_PADDING,
    sx,
}: GamePageContentProps) {
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

export interface GamePageBoardContainerProps {
    children: ReactNode;
    padding?: { mobile: string | number; desktop: string | number };
    borderRadius?: string | number;
    border?: string;
    sx?: SxProps<Theme>;
}

GamePage.BoardContainer = function GamePageBoardContainer({
    children,
    padding,
    borderRadius,
    border,
    sx,
}: GamePageBoardContainerProps) {
    return (
        <BoardContainerBase
            customPadding={padding}
            customBorderRadius={borderRadius}
            customBorder={border}
            sx={sx}
        >
            {children}
        </BoardContainerBase>
    );
};
