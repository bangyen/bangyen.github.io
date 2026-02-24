import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { GameControls, type GameControlsProps } from './GameControls';
import {
    BoardContainerBase,
    ContentContainer,
} from './StandardGameLayout.styles';
import { TrophyOverlay, type TrophyOverlayProps } from './TrophyOverlay';
import { DEFAULT_CONTENT_PADDING, GAME_TEXT } from '../config/constants';
import type { BaseControlsProps } from '../hooks/types';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { FeatureErrorFallback } from '@/components/layout/FeatureErrorFallback';
import { PageLayout } from '@/components/layout/PageLayout';
import { COLORS } from '@/config/theme';

export interface StandardGameLayoutProps<TBoardProps, TInfoProps> {
    /** Page title (e.g., "Lights Out"). */
    title: string;
    /** External URL for game information. */
    infoUrl: string;
    /** Props for the board or game container. */
    boardProps: TBoardProps;
    /** Standardised game state from useBaseGame. */
    gameState: {
        controlsProps: BaseControlsProps & Partial<GameControlsProps>;
        solved: boolean;
    };
    /** Page/Content layout overrides. */
    layoutProps: {
        boardSx?: SxProps<Theme>;
        contentSx?: SxProps<Theme>;
        paddingBottom?: string | object;
    };
    /** Props for the info modal. Must include toggleOpen. */
    infoProps: TInfoProps & { toggleOpen: () => void };
    /** Props for the win overlay. */
    trophyProps: TrophyOverlayProps;
    /** Whether to show the win overlay. */
    showTrophy: boolean;
    /** Function to render the specific game board. */
    renderBoard: (props: TBoardProps) => React.ReactNode;
    /** The game-specific Info modal component. */
    InfoComponent: React.ComponentType<TInfoProps>;
    /** Optional click handler for the entire page background. */
    onPageClick?: (e: React.MouseEvent) => void;
    /** Optional overrides for the standard control bar. */
    controlsConfig?: {
        onRefresh?: () => void;
        disabled?: boolean;
        hidden?: boolean;
    };
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
    layoutProps,
    infoProps,
    trophyProps,
    showTrophy,
    renderBoard,
    InfoComponent,
    onPageClick,
    controlsConfig,
    background = COLORS.surface.background,
}: StandardGameLayoutProps<TBoardProps, TInfoProps>) {
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
                                pb:
                                    layoutProps.paddingBottom ??
                                    DEFAULT_CONTENT_PADDING,
                            },
                            ...(Array.isArray(layoutProps.contentSx)
                                ? (layoutProps.contentSx as readonly SxProps<Theme>[])
                                : [layoutProps.contentSx]),
                        ].filter(Boolean) as SxProps<Theme>
                    }
                >
                    <BoardContainerBase sx={layoutProps.boardSx}>
                        {renderBoard(boardProps)}
                        <TrophyOverlay show={showTrophy} {...trophyProps} />
                    </BoardContainerBase>
                </ContentContainer>
            </ErrorBoundary>
            <GameControls
                {...gameState.controlsProps}
                onRefresh={
                    controlsConfig?.onRefresh ??
                    gameState.controlsProps.onRefresh
                }
                disabled={
                    controlsConfig?.disabled ?? gameState.controlsProps.disabled
                }
                hidden={
                    controlsConfig?.hidden ?? gameState.controlsProps.hidden
                }
            >
                <GameControls.Refresh />
                <GameControls.ResizeMinus />
                <GameControls.ResizePlus />
                <GameControls.Info onClick={infoProps.toggleOpen} />
            </GameControls>
            <InfoComponent {...infoProps} />
        </PageLayout>
    );
}
