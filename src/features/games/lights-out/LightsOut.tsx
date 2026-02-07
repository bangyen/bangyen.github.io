import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { MenuBookRounded } from '../../../components/icons';
import { TooltipButton } from '../../../components/ui/TooltipButton';
import { Board, useHandler, usePalette } from '../components/Board';
import { GameControls } from '../components/GameControls';
import { PAGE_TITLES } from '../../../config/constants';
import { GAME_CONSTANTS } from '../config/gameConfig';
import { LAYOUT } from '../../../config/theme';
import { getGrid, handleBoard, isSolved } from './boardHandlers';
import Info from './Info';
import {
    TIMING_CONSTANTS,
    STORAGE_KEYS,
    LAYOUT_CONSTANTS,
    LIGHTS_OUT_STYLES,
} from './constants';
import { useGridSize } from '../hooks/useGridSize';
import { useGamePersistence } from '../hooks/useGamePersistence';
import { useGameInteraction } from '../hooks/useGameInteraction';
import { useWinTransition } from '../hooks/useWinTransition';
import { usePageTitle } from '../hooks/usePageTitle';
import { GamePageLayout } from '../components/GamePageLayout';
import { getFrontProps, getBackProps, getExampleProps } from './renderers';

import { BoardState } from './boardHandlers';

export default function LightsOut() {
    const {
        rows,
        cols,
        dynamicSize,
        handlePlus,
        handleMinus,
        mobile,
        minSize,
        maxSize,
    } = useGridSize({
        storageKey: STORAGE_KEYS.SIZE,
        defaultSize: null,
        headerOffset: {
            mobile: LAYOUT.headerHeight.xs,
            desktop: LAYOUT.headerHeight.md,
        },
        cellSizeReference: {
            mobile: GAME_CONSTANTS.gridSizes.mobile,
            desktop: GAME_CONSTANTS.gridSizes.desktop,
        },
        paddingOffset: 120, // Reserve space for bottom controls
        mobileRowOffset: -2,
    });

    const initial = useMemo(
        () => ({
            grid: getGrid(rows, cols),
            score: 0,
            rows,
            cols,
            initialized: false,
        }),
        [rows, cols]
    );

    const [state, dispatch] = useReducer(handleBoard, initial);

    const [open, toggleOpen] = useReducer((open: boolean) => !open, false);

    const palette = usePalette(state.score);

    const solved = useMemo(
        () => state.initialized && isSolved(state.grid),
        [state.initialized, state.grid]
    );

    const { getDragProps } = useGameInteraction({
        onToggle: (r, c) => {
            dispatch({ type: 'adjacent', row: r, col: c });
        },
        checkEnabled: () => !solved,
        touchTimeout: TIMING_CONSTANTS.GHOST_CLICK_TIMEOUT,
        transition: LIGHTS_OUT_STYLES.TRANSITION.FAST,
    });

    const allOn = useMemo(
        () => state.initialized && state.grid.flat().every(cell => cell === 1),
        [state.initialized, state.grid]
    );

    const handleNext = useCallback(() => {
        dispatch({ type: 'next' });
    }, []);

    useGamePersistence<BoardState>({
        storageKey: STORAGE_KEYS.STATE,
        rows,
        cols,
        state,
        onRestore: saved => {
            dispatch({ type: 'restore', state: saved });
        },
    });

    useWinTransition(solved, handleNext, TIMING_CONSTANTS.WIN_ANIMATION_DELAY);

    usePageTitle(PAGE_TITLES.lightsOut);

    useEffect(() => {
        dispatch({
            type: 'resize',
            newRows: rows,
            newCols: cols,
        });
    }, [rows, cols]);

    const getters = useHandler(state, palette);

    const size = mobile
        ? GAME_CONSTANTS.gridSizes.mobile
        : GAME_CONSTANTS.gridSizes.desktop;

    const frontProps = useMemo(
        () => getFrontProps(getters, getDragProps),
        [getters, getDragProps]
    );
    const backProps = useMemo(() => getBackProps(getters), [getters]);

    const controls = (
        <GameControls
            rows={rows}
            cols={cols}
            dynamicSize={dynamicSize}
            minSize={minSize}
            maxSize={maxSize}
            handlePlus={handlePlus}
            handleMinus={handleMinus}
            onRefresh={handleNext}
        >
            <TooltipButton
                title="How to Play"
                Icon={MenuBookRounded}
                onClick={toggleOpen}
            />
        </GameControls>
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
    );
}
