import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Box } from '../../../components/mui';
import { MenuBookRounded } from '../../../components/icons';
import { TooltipButton } from '../../../components/ui/TooltipButton';
import { Board, useHandler, usePalette, Getters } from '../components/Board';
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
import { DragProps } from '../hooks/useDrag';
import { useGamePersistence } from '../hooks/useGamePersistence';
import { useGameInteraction } from '../hooks/useGameInteraction';
import { GamePageLayout } from '../components/GamePageLayout';
import { TrophyOverlay } from '../components/TrophyOverlay';
import { BoardState } from './boardHandlers';

const ICON = (
    <Box
        sx={{
            width: '45%',
            height: '45%',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
        }}
    />
);

function getFrontProps(
    getters: Getters,
    getDragProps: (pos: string) => DragProps
) {
    const { getColor, getBorder } = getters;

    return (row: number, col: number) => {
        const style = getBorder(row, col);
        const { front, back } = getColor(row, col);
        const pos = `${row.toString()},${col.toString()}`;
        const dragProps = getDragProps(pos);

        return {
            ...dragProps,
            children: ICON,
            backgroundColor: front,
            color: front,
            style,
            sx: {
                ...dragProps.sx,
                '&:hover': {
                    cursor: 'pointer',
                    color: back,
                },
            },
        };
    };
}

function getBackProps(getters: Getters) {
    return (row: number, col: number) => {
        return {
            backgroundColor: getters.getFiller(row, col),
            transition: LIGHTS_OUT_STYLES.TRANSITION.FAST,
        };
    };
}

function getExampleProps(getters: Getters) {
    const frontProps = getFrontProps(getters, (pos: string) => ({
        onMouseDown: () => undefined,
        onMouseEnter: () => undefined,
        onTouchStart: () => undefined,
        'data-pos': pos,
        sx: { touchAction: 'none' as const, transition: 'none' },
    }));

    return (row: number, col: number) => {
        const props = frontProps(row, col);
        return {
            ...props,
            onMouseDown: undefined,
            onMouseEnter: undefined,
            onTouchStart: undefined,
            sx: {},
        };
    };
}

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

    useEffect(() => {
        if (solved) {
            const timeout = setTimeout(() => {
                handleNext();
            }, TIMING_CONSTANTS.WIN_ANIMATION_DELAY);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [solved, handleNext]);

    useEffect(() => {
        document.title = PAGE_TITLES.lightsOut;
    }, []);

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
            controls={controls}
        >
            <Box
                sx={{
                    position: 'relative',
                    marginTop: mobile
                        ? `${String(LAYOUT_CONSTANTS.OFFSET.MOBILE)}px`
                        : `${String(LAYOUT_CONSTANTS.OFFSET.DESKTOP)}px`,
                }}
            >
                <Board
                    size={size}
                    rows={rows}
                    cols={cols}
                    frontProps={frontProps}
                    backProps={backProps}
                />
            </Box>
            <TrophyOverlay
                show={solved}
                onClick={handleNext}
                size={size}
                iconSizeRatio={LAYOUT_CONSTANTS.ICON_SIZE_RATIO}
                primaryColor={palette.primary}
                secondaryColor={palette.secondary}
                useSecondary={allOn}
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
