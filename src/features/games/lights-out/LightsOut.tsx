import React, {
    useMemo,
    useEffect,
    useReducer,
    useState,
    useCallback,
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

function getFrontProps(
    getters: Getters,
    dispatch: (action: BoardAction) => void,
    isDragging = false,
    setIsDragging: (val: boolean) => void = () => undefined,
    draggedCells = new Set<string>(),
    addDraggedCell: (pos: string) => void = () => undefined
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
                setIsDragging(true);
                flipAdj(row, col);
                addDraggedCell(pos);
            },
            onMouseEnter: () => {
                if (isDragging && !draggedCells.has(pos)) {
                    flipAdj(row, col);
                    addDraggedCell(pos);
                }
            },
            children: <CircleRounded />,
            backgroundColor: front,
            color: front,
            style,
            sx: {
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
    const frontProps = getFrontProps(
        getters,
        () => undefined,
        false,
        () => undefined,
        new Set(),
        () => undefined
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

    const [manualRows, setManualRows] = useState<number | null>(() => {
        const saved = localStorage.getItem('lights-out-rows');
        return saved ? parseInt(saved, 10) : null;
    });
    const [manualCols, setManualCols] = useState<number | null>(() => {
        const saved = localStorage.getItem('lights-out-cols');
        return saved ? parseInt(saved, 10) : null;
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
        if (manualRows !== null && manualCols !== null) {
            return { rows: manualRows, cols: manualCols };
        }
        return dynamicSize;
    }, [manualRows, manualCols, dynamicSize]);

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
    const [draggedCells, setDraggedCells] = useState(new Set<string>());

    const addDraggedCell = useCallback((pos: string) => {
        setDraggedCells(prev => new Set(prev).add(pos));
    }, []);

    useEffect(() => {
        const handleMouseUp = () => {
            setIsDragging(false);
            setDraggedCells(new Set());
        };

        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const palette = usePalette(state.score);

    const solved = useMemo(
        () => state.initialized && isSolved(state.grid),
        [state.initialized, state.grid]
    );

    const handleNext = useCallback(() => {
        dispatch({ type: 'next' });
    }, []);

    useEffect(() => {
        if (solved) {
            const timeout = setTimeout(() => {
                handleNext();
            }, 2000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [solved, handleNext]);

    useEffect(() => {
        document.title = PAGE_TITLES.lightsOut;
    }, []);

    useEffect(() => {
        if (manualRows !== null) {
            localStorage.setItem('lights-out-rows', manualRows.toString());
        }
        if (manualCols !== null) {
            localStorage.setItem('lights-out-cols', manualCols.toString());
        }
    }, [manualRows, manualCols]);

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
        }, 300);
        return () => {
            clearTimeout(timeout);
        };
    }, [state.auto, state.grid, moveQueue]);

    const handlePlus = () => {
        if (rows < dynamicSize.rows && cols < dynamicSize.cols) {
            setManualRows(rows + 1);
            setManualCols(cols + 1);
        }
    };

    const handleMinus = () => {
        const minDim = Math.min(rows, cols);
        if (rows !== cols) {
            setManualRows(minDim);
            setManualCols(minDim);
        } else {
            const nextDim = Math.max(2, minDim - 1);
            setManualRows(nextDim);
            setManualCols(nextDim);
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
        addDraggedCell
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
                        marginTop: mobile ? '-28px' : '-40px',
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
                            backgroundColor: solved
                                ? 'rgba(0,0,0,0.1)'
                                : 'transparent',
                        }}
                    >
                        <EmojiEventsRounded
                            sx={{
                                fontSize: { xs: '6rem', sm: '10rem' },
                                color: COLORS.primary.main,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
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
                        rows >= dynamicSize.rows || cols >= dynamicSize.cols
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
