import React, { useCallback, useMemo, useReducer } from 'react';

import { Board } from '../../components/Board';
import { GameControls } from '../../components/GameControls';
import { GamePageLayout } from '../../components/GamePageLayout';
import { GAME_CONSTANTS } from '../../config';
import { useGamePage } from '../../hooks/useGamePage';
import { useSkipTransition } from '../../hooks/useSkipTransition';
import Info from '../components/Info';
import {
    LAYOUT_CONSTANTS,
    LIGHTS_OUT_STYLES,
    getLightsOutGameConfig,
} from '../config';
import { useHandler, usePalette } from '../hooks/boardUtils';
import type { BoardState, BoardAction } from '../types';
import { handleBoard, isSolved, getInitialState } from '../utils/boardHandlers';
import {
    getFrontProps,
    getBackProps,
    getExampleProps,
} from '../utils/renderers';

import { PAGE_TITLES } from '@/config/constants';
import { useMobile } from '@/hooks';
import { useCellFactory } from '@/utils/gameUtils';
import { createCellIndex, type CellIndex } from '@/utils/types';

export default function LightsOut() {
    const mobile = useMobile('sm');
    const {
        rows,
        cols,
        state,
        dispatch,
        size,
        solved,
        handleNext,
        getDragProps,
        controlsProps,
    } = useGamePage<BoardState, BoardAction>({
        ...getLightsOutGameConfig(mobile),
        reducer: handleBoard,
        getInitialState,
        isSolved: (s: BoardState) => s.initialized && isSolved(s.grid),
        interaction: {
            createAction: (r: number, c: number) => ({
                type: 'adjacent' as const,
                row: createCellIndex(r),
                col: createCellIndex(c),
            }),
            touchTimeout: GAME_CONSTANTS.timing.interactionDelay,
            transition: LIGHTS_OUT_STYLES.TRANSITION.FAST,
        },
    });

    const [open, toggleOpen] = useReducer((open: boolean) => !open, false);

    const palette = usePalette(state.score);

    const allOn = useMemo(
        () =>
            state.initialized &&
            state.grid.every((row: number) => row === (1 << cols) - 1),
        [state.initialized, state.grid, cols],
    );

    const getters = useHandler(state, palette);

    const boardKey = `${String(rows)},${String(cols)},${String(state.score)}`;
    const skipTransition = useSkipTransition(boardKey);

    const frontProps = useCellFactory(getFrontProps, getDragProps, [
        getters,
        skipTransition,
    ]);
    const backProps = useMemo(
        () => getBackProps(getters, skipTransition),
        [getters, skipTransition],
    );

    /** Apply the calculator's solution pattern to the top row of the board and close the modal. */
    const handleApply = useCallback(
        (solution: number[]) => {
            const moves = solution
                .map((val, col) =>
                    val
                        ? { row: createCellIndex(0), col: createCellIndex(col) }
                        : null,
                )
                .filter(
                    (m): m is { row: CellIndex; col: CellIndex } => m !== null,
                );
            if (moves.length > 0) {
                dispatch({ type: 'multi_adjacent', moves });
            }
            toggleOpen();
        },
        [dispatch, toggleOpen],
    );

    const controls = (
        <GameControls {...controlsProps} onOpenInfo={toggleOpen} />
    );

    return (
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
                cellRows={rows - 1}
                cellCols={cols - 1}
                overlayProps={frontProps}
                cellProps={backProps}
            />
            {open && (
                <Info
                    rows={rows}
                    cols={cols}
                    size={size}
                    open={open}
                    palette={palette}
                    toggleOpen={toggleOpen}
                    onApply={handleApply}
                    getFrontProps={getExampleProps}
                    getBackProps={getBackProps}
                />
            )}
        </GamePageLayout>
    );
}
