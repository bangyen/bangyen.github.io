import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { Board } from '../../components/Board';
import { GameControls } from '../../components/GameControls';
import { GamePageLayout } from '../../components/GamePageLayout';
import { GAME_CONSTANTS } from '../../config';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useGameInteraction } from '../../hooks/useGameInteraction';
import Info from '../components/Info';
import { STORAGE_KEYS, LAYOUT_CONSTANTS, LIGHTS_OUT_STYLES } from '../config';
import { useHandler, usePalette } from '../hooks/boardUtils';
import type { BoardState, BoardAction } from '../types';
import { handleBoard, isSolved, getInitialState } from '../utils/boardHandlers';
import {
    getFrontProps,
    getBackProps,
    getExampleProps,
} from '../utils/renderers';

import { MenuBookRounded } from '@/components/icons';
import { TooltipButton } from '@/components/ui/TooltipButton';
import { PAGE_TITLES } from '@/config/constants';
import { LAYOUT } from '@/config/theme';
import { useMobile } from '@/hooks';
import { useCellFactory } from '@/utils/gameUtils';
import { createCellIndex } from '@/utils/types';

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
        controlsProps,
    } = useBaseGame<BoardState, BoardAction>({
        storageKeys: {
            size: STORAGE_KEYS.SIZE,
            state: STORAGE_KEYS.STATE,
        },
        pageTitle: PAGE_TITLES.lightsOut,
        gridConfig: {
            defaultSize: null,
            minSize: 3,
            maxSize: 10,
            headerOffset: {
                mobile: LAYOUT.headerHeight.xs,
                desktop: LAYOUT.headerHeight.md,
            },
            paddingOffset: {
                x: mobile ? 60 : 80,
                y: 60,
            },
            cellSizeReference: {
                mobile: GAME_CONSTANTS.gridSizes.mobile,
                desktop: GAME_CONSTANTS.gridSizes.desktop,
            },
            mobileRowOffset: 2,
        },
        boardConfig: {
            paddingOffset: {
                x: mobile ? 40 : 120,
                y: 100,
            },
            boardMaxWidth: 1200,
            boardSizeFactor: 0.94,
            maxCellSize: 80,
            remBase: 16,
        },
        reducer: handleBoard,
        getInitialState,
        winAnimationDelay: GAME_CONSTANTS.timing.winAnimationDelay,
        isSolved: (s: BoardState) => s.initialized && isSolved(s.grid),
    });

    const [open, toggleOpen] = useReducer((open: boolean) => !open, false);

    const palette = usePalette(state.score);

    const { getDragProps } = useGameInteraction({
        onToggle: (r: number, c: number) => {
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
        [state.initialized, state.grid, cols],
    );

    const getters = useHandler(state, palette);

    // Suppress CSS transitions when the board is regenerated (resize or
    // refresh) so the new state appears instantly without artifacts from
    // border-radius and color transitions animating between old/new grids.
    const boardKeyRef = useRef('');
    const skipTransitionRef = useRef(false);
    const [, setTick] = useState(0);

    const boardKey = `${String(rows)},${String(cols)},${String(state.score)}`;
    if (boardKey !== boardKeyRef.current) {
        // Skip transitions on every regeneration except the very first render.
        skipTransitionRef.current = boardKeyRef.current !== '';
        boardKeyRef.current = boardKey;
    }

    useEffect(() => {
        if (!skipTransitionRef.current) return;
        const raf = requestAnimationFrame(() => {
            skipTransitionRef.current = false;
            setTick(t => t + 1);
        });
        return () => {
            cancelAnimationFrame(raf);
        };
    }, [boardKey]);

    const skipTransition = skipTransitionRef.current;

    const frontProps = useCellFactory(getFrontProps, getDragProps, [
        getters,
        skipTransition,
    ]);
    const backProps = useMemo(
        () => getBackProps(getters, skipTransition),
        [getters, skipTransition],
    );

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
