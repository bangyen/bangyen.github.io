import { Box, styled, type SxProps, type Theme } from '@mui/material';
import React from 'react';

import { GameControls, type GameControlsProps } from './GameControls';
import { TrophyOverlay, type TrophyOverlayProps } from './TrophyOverlay';
import {
    DEFAULT_CONTENT_PADDING,
    GAME_TEXT,
    BOARD_STYLES,
} from '../config/constants';
import type { BaseControlsProps } from '../hooks/types';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { FeatureErrorFallback } from '@/components/layout/FeatureErrorFallback';
import { PageLayout } from '@/components/layout/PageLayout';
import { COLORS } from '@/config/theme';

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

export interface StandardGameLayoutProps<TBoardProps, TInfoProps> {
    /** Page title (e.g., "Lights Out"). */
    title: string;
    /** External URL for game information. */
    infoUrl: string;
    /** Props for the board or game container. */
    boardProps?: TBoardProps;
    /** Standardised game state from useBaseGame. */
    gameState?: {
        controlsProps: BaseControlsProps & Partial<GameControlsProps>;
        solved: boolean;
    };
    /** Top-level layout properties. */
    boardSx?: SxProps<Theme>;
    contentSx?: SxProps<Theme>;
    paddingBottom?: string | object;
    /** Standard base game props if passed directly. */
    controlsProps?: BaseControlsProps & Partial<GameControlsProps>;
    solved?: boolean;
    /** Props for the info modal. */
    infoProps: TInfoProps & { toggleOpen: () => void };
    /** Props for the win overlay. */
    trophyProps: TrophyOverlayProps;
    /** Function to render the specific game board. */
    renderBoard: (props: TBoardProps) => React.ReactNode;
    /** The game-specific Info modal component. */
    InfoComponent: React.ComponentType<TInfoProps>;
    /** Optional click handler for the entire page background. */
    onPageClick?: (e: React.MouseEvent) => void;
    /** Optional background color override. */
    background?: string;
}

/**
 * A standardized layout component for game pages.
 *
 * Encapsulates the common structure: PageLayout -> ErrorBoundary -> Content -> Board -> Trophy -> Controls -> Info.
 * Consolidates the former GamePage and StandardGameLayout into a single orchestration layer.
 */
export function StandardGameLayout<TBoardProps, TInfoProps>({
    title,
    infoUrl,
    boardProps,
    gameState,
    boardSx,
    contentSx,
    paddingBottom,
    controlsProps,
    solved,
    infoProps,
    trophyProps,
    renderBoard,
    InfoComponent,
    onPageClick,
    background = COLORS.surface.background,
}: StandardGameLayoutProps<TBoardProps, TInfoProps>) {
    // Flattened source of truth
    const finalSolved = solved ?? gameState?.solved ?? false;
    const finalControlsProps = controlsProps ?? gameState?.controlsProps;
    const finalBoardProps = (boardProps ?? {}) as TBoardProps;

    return (
        <PageLayout
            title={title}
            infoUrl={infoUrl}
            background={background}
            containerSx={{
                height: '100vh',
                transition: 'background 0.5s ease-in-out',
                cursor: onPageClick ? 'pointer' : 'inherit',
            }}
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onClick={onPageClick}
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
                            {
                                pb: paddingBottom ?? DEFAULT_CONTENT_PADDING,
                            },
                            ...(Array.isArray(contentSx)
                                ? (contentSx as readonly SxProps<Theme>[])
                                : [contentSx]),
                        ].filter(Boolean) as SxProps<Theme>
                    }
                >
                    <BoardContainerBase sx={boardSx}>
                        {renderBoard(finalBoardProps)}
                        <TrophyOverlay show={finalSolved} {...trophyProps} />
                    </BoardContainerBase>
                </ContentContainer>
            </ErrorBoundary>
            {finalControlsProps && (
                <GameControls {...finalControlsProps}>
                    <GameControls.Refresh />
                    <GameControls.ResizeMinus />
                    <GameControls.ResizePlus />
                    <GameControls.Info onClick={infoProps.toggleOpen} />
                </GameControls>
            )}
            <InfoComponent {...infoProps} />
        </PageLayout>
    );
}
