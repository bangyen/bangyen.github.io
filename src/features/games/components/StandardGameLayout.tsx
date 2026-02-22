import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { GameControls, type GameControlsProps } from './GameControls';
import { GamePage } from './GamePage';
import { TrophyOverlay, type TrophyOverlayProps } from './TrophyOverlay';
import type { BaseControlsProps } from '../hooks/types';

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
}

/**
 * A standardized layout component for game pages.
 *
 * Encapsulates the common structure: GamePage -> Content -> Board -> Trophy -> Controls -> Info.
 * This ensures UI consistency and reduces boilerplate in individual game page components.
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
}: StandardGameLayoutProps<TBoardProps, TInfoProps>) {
    return (
        <>
            <GamePage title={title} infoUrl={infoUrl} onClick={onPageClick}>
                <GamePage.Content
                    sx={layoutProps.contentSx}
                    paddingBottom={layoutProps.paddingBottom}
                >
                    <GamePage.BoardContainer sx={layoutProps.boardSx}>
                        {renderBoard(boardProps)}
                        <TrophyOverlay show={showTrophy} {...trophyProps} />
                    </GamePage.BoardContainer>
                </GamePage.Content>
                <GameControls
                    {...gameState.controlsProps}
                    onRefresh={
                        controlsConfig?.onRefresh ??
                        gameState.controlsProps.onRefresh
                    }
                    disabled={
                        controlsConfig?.disabled ??
                        gameState.controlsProps.disabled
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
            </GamePage>
            <InfoComponent
                {...(infoProps as TInfoProps & Record<string, unknown>)}
            />
        </>
    );
}
