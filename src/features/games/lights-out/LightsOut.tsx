import React, {
    useMemo,
    useEffect,
    useReducer,
    useState,
    useCallback,
    useRef,
} from 'react';
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
import {
    getGrid,
    handleBoard,
    getNextMove,
    isSolved,
    BoardAction,
} from './boardHandlers';
import { useWindow, useMobile } from '../../../hooks';
import { convertPixels } from '../../interpreters/utils/gridUtils';
import Info from './Info';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import {
    TIMING_CONSTANTS,
    LIGHTS_OUT_STYLES,
    STORAGE_KEYS,
    LAYOUT_CONSTANTS,
} from './constants';

function getFrontProps(
    getters: Getters,
    dispatch: (action: BoardAction) => void,
    isDragging = false,
    setIsDragging: (val: boolean) => void = () => undefined,
    draggedCells: React.RefObject<Set<string>>,
    addDraggedCell: (pos: string) => void = () => undefined,
    lastTouchTime: React.RefObject<number>
) {
    const { getColor, getBorder } = getters;

    const flipAdj = (row: number, col: number) => {
        dispatch({
            type: 'adjacent',
            row,
            col,
        });
    };

    return (row: number, col: number) => {
        const style = getBorder(row, col);
        const { front, back } = getColor(row, col);
        const pos = `${row.toString()},${col.toString()}`;

        return {
            onMouseDown: (e: React.MouseEvent) => {
                if (e.button !== 0) return; // Only left click
                // Ignore ghost clicks on mobile
                if (
                    Date.now() - lastTouchTime.current <
                    TIMING_CONSTANTS.GHOST_CLICK_TIMEOUT
                )
                    return;
                setIsDragging(true);
                flipAdj(row, col);
                addDraggedCell(pos);
            },
            onMouseEnter: () => {
                if (isDragging && !draggedCells.current.has(pos)) {
                    flipAdj(row, col);
                    addDraggedCell(pos);
                }
            },
            onTouchStart: (e: React.TouchEvent) => {
                // Prevent ghost mouse events and scrolling
                if (e.cancelable) e.preventDefault();
                lastTouchTime.current = Date.now();
                setIsDragging(true);
                flipAdj(row, col);
                addDraggedCell(pos);
            },
            'data-pos': pos,
            children: <CircleRounded />,
            backgroundColor: front,
            color: front,
            style,
            sx: {
                '&:hover': {
                    cursor: 'pointer',
                    color: back,
                },
                touchAction: 'none', // Prevent scrolling while dragging
                transition: LIGHTS_OUT_STYLES.TRANSITION.FAST,
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
    const frontProps = getFrontProps(
        getters,
        () => undefined,
        false,
        () => undefined,
        { current: new Set() } as React.RefObject<Set<string>>,
        () => undefined,
        { current: 0 } as React.RefObject<number>
    );

    return (row: number, col: number) => {
        const props = frontProps(row, col);
        return {
            ...props,
            onMouseDown: undefined,
            onMouseEnter: undefined,
            sx: undefined,
        };
    };
}

export default function LightsOut(): React.ReactElement {
    const { height, width } = useWindow();
    const mobile = useMobile('sm');
    const size = mobile
        ? GAME_CONSTANTS.gridSizes.mobile
        : GAME_CONSTANTS.gridSizes.desktop;

    const [desiredSize, setDesiredSize] = useState<number | null>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.SIZE);
        return saved && saved !== 'null' ? parseInt(saved, 10) : null;
    });

    const dynamicSize = useMemo(() => {
        const headerOffset = mobile
            ? LAYOUT.headerHeight.xs
            : LAYOUT.headerHeight.md;
        const converted = convertPixels(
            size,
            height - headerOffset,
            Math.min(width, 1300)
        );

        let r = converted.rows - 1;
        const c = converted.cols - 1;
        if (mobile) r -= 2;

        return { rows: Math.max(2, r), cols: Math.max(2, c) };
    }, [size, height, width, mobile]);

    const { rows, cols } = useMemo(() => {
        if (desiredSize === null) return dynamicSize;
        return {
            rows: Math.min(desiredSize, dynamicSize.rows),
            cols: Math.min(desiredSize, dynamicSize.cols),
        };
    }, [desiredSize, dynamicSize]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SIZE, String(desiredSize));
    }, [desiredSize]);

    const initial = useMemo(
        () => ({
            grid: getGrid(rows, cols),
            score: 0,
            rows,
            cols,
            auto: false,
            initialized: false,
        }),
        [rows, cols]
    );

    const [state, dispatch] = useReducer(handleBoard, initial);

    const [open, toggleOpen] = useReducer((open: boolean) => !open, false);

    const [isDragging, setIsDragging] = useState(false);
    const draggedCells = useRef(new Set<string>());
    const lastTouchTime = useRef(0);

    const addDraggedCell = useCallback((pos: string) => {
        draggedCells.current.add(pos);
    }, []);

    useEffect(() => {
        const handleStopDragging = () => {
            setIsDragging(false);
            draggedCells.current.clear();
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging) return;

            const touch = e.touches[0];
            if (!touch) return;

            const element = document.elementFromPoint(
                touch.clientX,
                touch.clientY
            );
            if (!element) return;

            // Find the cell element (either the div itself or its parent/child)
            const cell = element.closest('[data-pos]');
            if (cell) {
                const pos = cell.getAttribute('data-pos');
                if (pos && !draggedCells.current.has(pos)) {
                    const [r, c] = pos.split(',').map(Number);
                    if (r !== undefined && c !== undefined) {
                        dispatch({
                            type: 'adjacent',
                            row: r,
                            col: c,
                        });
                        addDraggedCell(pos);
                    }
                }
            }
        };

        window.addEventListener('mouseup', handleStopDragging);
        window.addEventListener('touchend', handleStopDragging);
        window.addEventListener('touchcancel', handleStopDragging);
        window.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });

        return () => {
            window.removeEventListener('mouseup', handleStopDragging);
            window.removeEventListener('touchend', handleStopDragging);
            window.removeEventListener('touchcancel', handleStopDragging);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isDragging, draggedCells, addDraggedCell, dispatch]);

    const palette = usePalette(state.score);

    const solved = useMemo(
        () => state.initialized && isSolved(state.grid),
        [state.initialized, state.grid]
    );

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

    const [moveQueue, setMoveQueue] = React.useState<
        { row: number; col: number }[]
    >([]);

    useEffect(() => {
        if (!state.auto) {
            if (moveQueue.length > 0) setMoveQueue([]);
            return;
        }

        const timeout = setTimeout(() => {
            if (moveQueue.length > 0) {
                const nextMove = moveQueue[0];
                if (nextMove) {
                    dispatch({
                        type: 'adjacent',
                        row: nextMove.row,
                        col: nextMove.col,
                    });
                    setMoveQueue(moveQueue.slice(1));
                }
            } else {
                const moves = getNextMove(state.grid);
                if (moves && moves.length > 0) {
                    const firstMove = moves[0];
                    if (moves.length === 1 && firstMove) {
                        dispatch({
                            type: 'adjacent',
                            row: firstMove.row,
                            col: firstMove.col,
                        });
                    } else {
                        setMoveQueue(moves);
                    }
                } else {
                    dispatch({ type: 'auto' });
                }
            }
        }, TIMING_CONSTANTS.AUTO_PLAY_SPEED);
        return () => {
            clearTimeout(timeout);
        };
    }, [state.auto, state.grid, moveQueue]);

    const handlePlus = () => {
        const maxSquare = Math.min(dynamicSize.rows, dynamicSize.cols);
        const currentMin = Math.min(rows, cols);

        if (rows !== cols) {
            // Already at max rectangle, do nothing (button should be disabled)
            return;
        }

        if (currentMin < maxSquare) {
            setDesiredSize(currentMin + 1);
        } else {
            // Jump to full rectangle
            setDesiredSize(null);
        }
    };

    const handleMinus = () => {
        const currentMin = Math.min(rows, cols);

        if (rows !== cols) {
            // From rectangle jump to largest possible square
            setDesiredSize(currentMin);
        } else if (currentMin > 2) {
            setDesiredSize(currentMin - 1);
        }
    };

    const getters = useHandler(state, palette);

    const frontProps = getFrontProps(
        getters,
        action => {
            if (solved) return;
            dispatch(action);
        },
        isDragging,
        setIsDragging,
        draggedCells,
        addDraggedCell,
        lastTouchTime
    );
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
                onAutoPlay={() => {
                    dispatch({ type: 'auto' });
                }}
                autoPlayEnabled={state.auto}
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
