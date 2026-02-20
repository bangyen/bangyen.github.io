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

interface BoardContainerBaseProps {
    customPadding?: { mobile: string | number; desktop: string | number };
    customBorderRadius?: string | number;
    customBorder?: string;
}

const BoardContainerBase = styled(Box, {
    shouldForwardProp: prop =>
        !['customPadding', 'customBorderRadius', 'customBorder'].includes(
            prop as string,
        ),
})<BoardContainerBaseProps>(
    ({ theme, customPadding, customBorderRadius, customBorder }) => ({
        position: 'relative',
        width: 'fit-content',
        userSelect: 'none',
        padding: customPadding?.mobile ?? BOARD_STYLES.PADDING.MOBILE,
        [theme.breakpoints.up('sm')]: {
            padding: customPadding?.desktop ?? BOARD_STYLES.PADDING.DESKTOP,
        },
        borderRadius: customBorderRadius ?? BOARD_STYLES.BORDER_RADIUS,
        border: customBorder ?? BOARD_STYLES.BORDER,
    }),
);

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

export interface GamePageControlsProps {
    children: ReactNode;
}

GamePage.Controls = function GamePageControls({
    children,
}: GamePageControlsProps) {
    return children;
};
