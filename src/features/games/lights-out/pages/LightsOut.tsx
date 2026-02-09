import React, { useMemo, useReducer } from 'react';
import { MenuBookRounded } from '@/components/icons';
import { TooltipButton } from '@/components/ui/TooltipButton';
import { Board } from '../../components/Board';
import { useHandler, usePalette } from '../hooks/boardUtils';
import { GameControls } from '../../components/GameControls';
import { PAGE_TITLES } from '@/config/constants';
import { GAME_CONSTANTS } from '../../config/gameConfig';
import { LAYOUT } from '@/config/theme';
import { handleBoard, isSolved, getInitialState } from '../utils/boardHandlers';
import Info from '../components/Info';
import {
    STORAGE_KEYS,
    LAYOUT_CONSTANTS,
    LIGHTS_OUT_STYLES,
} from '../utils/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useGameInteraction } from '../../hooks/useGameInteraction';
import { GamePageLayout } from '../../components/GamePageLayout';
import { useCellFactory } from '@/utils/gameUtils';
import {
    getFrontProps,
    getBackProps,
    getExampleProps,
} from '../utils/renderers';
import { GameErrorBoundary } from '../../components/GameErrorBoundary';

import { BoardState, BoardAction } from '../utils/boardHandlers';
import { createCellIndex } from '@/utils/types';

export default function LightsOut() {
    const {
        rows,
        cols,
        state,
        dispatch,
        size,
        mobile,
        solved,
        handleNext,
        controlsProps,
    } = useBaseGame<BoardState, BoardAction>({
        storageKeys: {
            size: STORAGE_KEYS.SIZE,
            state: STORAGE_KEYS.STATE,
        },
        pageTitle: PAGE_TITLES.lightsOut,
        gridConfig: {
            defaultSize: null,
            minSize: 2,
            maxSize: 10,
            headerOffset: {
                mobile: LAYOUT.headerHeight.xs,
                desktop: LAYOUT.headerHeight.md,
            },
            paddingOffset: 120,
            cellSizeReference: {
                mobile: GAME_CONSTANTS.gridSizes.mobile,
                desktop: GAME_CONSTANTS.gridSizes.desktop,
            },
            mobileRowOffset: -2,
        },
        boardConfig: {
            paddingOffset: 180,
            boardMaxWidth: 1200,
            boardSizeFactor: 0.9,
            maxCellSize: 80,
            remBase: 16,
        },
        reducer: handleBoard,
        getInitialState,
        winAnimationDelay: GAME_CONSTANTS.timing.winAnimationDelay,
        isSolved: s => s.initialized && isSolved(s.grid),
    });

    const [open, toggleOpen] = useReducer((open: boolean) => !open, false);

    const palette = usePalette(state.score);

    const { getDragProps } = useGameInteraction({
        onToggle: (r, c) => {
            dispatch({
                type: 'adjacent',
                row: createCellIndex(r),
                col: createCellIndex(c),
            });
        },
        checkEnabled: () => !solved,
        touchTimeout: GAME_CONSTANTS.timing.interactionDelay,
        transition: LIGHTS_OUT_STYLES.TRANSITION.FAST,
    });

    const allOn = useMemo(
        () =>
            state.initialized &&
            state.grid.every((row: number) => row === (1 << cols) - 1),
        [state.initialized, state.grid, cols]
    );

    const getters = useHandler(state, palette);

    const frontProps = useCellFactory(getFrontProps, getDragProps, [getters]);
    const backProps = useMemo(() => getBackProps(getters), [getters]);

    const controls = (
        <GameControls {...controlsProps}>
            <TooltipButton
                title="How to Play"
                Icon={MenuBookRounded}
                onClick={toggleOpen}
            />
        </GameControls>
    );

    return (
        <GameErrorBoundary>
            <GamePageLayout
                title={PAGE_TITLES.lightsOut}
                infoUrl="https://en.wikipedia.org/wiki/Lights_Out_(game)"
                showTrophy={solved}
                onReset={handleNext}
                boardSize={size}
                iconSizeRatio={LAYOUT_CONSTANTS.ICON_SIZE_RATIO}
                primaryColor={palette.primary}
                secondaryColor={palette.secondary}
                useSecondaryTrophy={allOn}
                boardSx={{
                    marginTop: mobile
                        ? `${String(LAYOUT_CONSTANTS.OFFSET.MOBILE)}px`
                        : `${String(LAYOUT_CONSTANTS.OFFSET.DESKTOP)}px`,
                }}
                controls={controls}
            >
                <Board
                    size={size}
                    rows={rows}
                    cols={cols}
                    frontProps={frontProps}
                    backProps={backProps}
                />
                {open && (
                    <Info
                        rows={rows}
                        cols={cols}
                        size={size}
                        open={open}
                        palette={palette}
                        toggleOpen={toggleOpen}
                        getFrontProps={getExampleProps}
                        getBackProps={getBackProps}
                    />
                )}
            </GamePageLayout>
        </GameErrorBoundary>
    );
}
