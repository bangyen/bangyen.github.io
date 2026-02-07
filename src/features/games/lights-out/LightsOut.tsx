import React, { useMemo, useEffect, useReducer, useCallback } from 'react';
import { Grid, Box } from '../../../components/mui';
import {
    MenuBookRounded,
    CircleRounded,
    AddRounded,
    RemoveRounded,
    EmojiEventsRounded,
} from '../../../components/icons';
import { Controls } from '../../../components/ui/Controls';
import { TooltipButton } from '../../../components/ui/TooltipButton';
import { Board, useHandler, usePalette, Getters } from '../components/Board';
import { PAGE_TITLES } from '../../../config/constants';
import { GAME_CONSTANTS } from '../config/gameConfig';
import { LAYOUT, COLORS } from '../../../config/theme';
import { getGrid, handleBoard, isSolved } from './boardHandlers';
import Info from './Info';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import {
    TIMING_CONSTANTS,
    LIGHTS_OUT_STYLES,
    STORAGE_KEYS,
    LAYOUT_CONSTANTS,
} from './constants';
import { useDrag, DragProps } from '../hooks/useDrag';
import { useGridSize } from '../hooks/useGridSize';

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
            children: <CircleRounded />,
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
    const { rows, cols, dynamicSize, handlePlus, handleMinus, mobile } =
        useGridSize({
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

    const { getDragProps } = useDrag({
        onAction: pos => {
            if (solved) return;
            const [r, c] = pos.split(',').map(Number);
            if (r !== undefined && c !== undefined) {
                dispatch({
                    type: 'adjacent',
                    row: r,
                    col: c,
                });
            }
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

    const frontProps = getFrontProps(getters, getDragProps);
    const backProps = getBackProps(getters);

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                background: COLORS.surface.background,
                position: 'relative',
                overflow: 'hidden',
                height: '100vh', // Force height to prevent dynamic resizing
            }}
        >
            <GlobalHeader
                showHome={true}
                infoUrl="https://en.wikipedia.org/wiki/Lights_Out_(game)"
            />
            <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    pb: { xs: '80px', md: '120px' }, // Push board up away from controls
                }}
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
                    <Box
                        onClick={handleNext}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: solved ? 1 : 0,
                            transform: solved ? 'scale(1)' : 'scale(0.5)',
                            visibility: solved ? 'visible' : 'hidden',
                            transition:
                                'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            cursor: 'pointer',
                            zIndex: 10,
                            backgroundColor: 'transparent',
                        }}
                    >
                        <EmojiEventsRounded
                            sx={{
                                fontSize: `${(
                                    size * LAYOUT_CONSTANTS.ICON_SIZE_RATIO
                                ).toString()}rem`,
                                color: allOn
                                    ? palette.secondary
                                    : palette.primary,
                            }}
                        />
                    </Box>
                </Box>
            </Box>
            <Controls
                handler={() => () => undefined} // No directional controls for Lights Out
                onRefresh={handleNext}
            >
                <TooltipButton
                    title="Decrease Size"
                    Icon={RemoveRounded}
                    onClick={handleMinus}
                    disabled={rows <= 2 && cols <= 2}
                />
                <TooltipButton
                    title="Increase Size"
                    Icon={AddRounded}
                    onClick={handlePlus}
                    disabled={
                        rows === dynamicSize.rows && cols === dynamicSize.cols
                    }
                />
                <TooltipButton
                    title="How to Play"
                    Icon={MenuBookRounded}
                    onClick={toggleOpen}
                />
            </Controls>
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
        </Grid>
    );
}
