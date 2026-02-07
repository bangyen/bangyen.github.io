import React, {
    useReducer,
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
} from 'react';
import { Box, Grid } from '../../../components/mui';
import {
    AddRounded,
    RemoveRounded,
    EmojiEventsRounded,
    Psychology,
} from '../../../components/icons';
import { GhostCanvas } from './GhostCanvas';
import { CellState } from './boardHandlers';
import { Controls } from '../../../components/ui/Controls';
import { TooltipButton } from '../../../components/ui/TooltipButton';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import { PAGE_TITLES } from '../../../config/constants';
import { useWindow, useMobile } from '../../../hooks';
import { convertPixels } from '../../interpreters/utils/gridUtils';
import { COLORS } from '../../../config/theme';
import {
    handleBoard,
    getInitialState,
    FORWARD,
    BACKWARD,
} from './boardHandlers';
import { NUMBER_SIZE_RATIO, STORAGE_KEYS, TIMING_CONSTANTS } from './constants';

export default function Slant(): React.ReactElement {
    const { height, width } = useWindow();
    const mobile = useMobile('sm');
    const [isGhostMode, setIsGhostMode] = useState(false);

    // Default size handling
    // Default size handling
    const [desiredSize, setDesiredSize] = useState<number | null>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.SIZE);
        return saved && saved !== 'null' ? parseInt(saved, 10) : 5;
    });

    const dynamicSize = useMemo(() => {
        const headerOffset = mobile ? 64 : 80;
        // Leave space for controls and padding
        const converted = convertPixels(
            4, // Base cell size reference
            height - headerOffset - 100,
            Math.min(width, 1000)
        );

        let r = converted.rows - 1;
        const c = converted.cols - 1;
        if (mobile) r -= 2;

        return { rows: Math.max(3, r), cols: Math.max(3, c) };
    }, [height, width, mobile]);

    const { rows, cols } = useMemo(() => {
        const dScore = desiredSize ?? 5;
        // Clamp to screen
        return {
            rows: Math.min(dScore, dynamicSize.rows),
            cols: Math.min(dScore, dynamicSize.cols),
        };
    }, [desiredSize, dynamicSize]);

    // Calculate cell size to fit the board
    const size = useMemo(() => {
        const maxW = Math.min(width, 1200) * 0.95;
        const maxH = (height - 160) * 0.95;

        const possibleW = maxW / (cols + 1); // +1 because intersections stick out
        const possibleH = maxH / (rows + 1);

        const pxSize = Math.min(possibleW, possibleH, 100); // Max 100px
        return pxSize / 16; // rem
    }, [width, height, rows, cols]);

    const [state, dispatch] = useReducer(handleBoard, { rows, cols }, init =>
        getInitialState(init.rows, init.cols)
    );

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SIZE, String(desiredSize));
    }, [desiredSize]);

    useEffect(() => {
        if (state.rows !== rows || state.cols !== cols) {
            dispatch({ type: 'resize', rows, cols });
        }
    }, [rows, cols, state.rows, state.cols]);

    // Ghost mode state
    const [ghostMoves, setGhostMoves] = useState<Map<string, CellState>>(
        new Map()
    );

    // Reset ghost moves when puzzle changes
    useEffect(() => {
        setGhostMoves(new Map());
    }, [state.numbers, state.rows, state.cols]);

    useEffect(() => {
        document.title = PAGE_TITLES.slant;
    }, []);

    const handlePlus = () => {
        setDesiredSize(prev => (prev ? prev + 1 : 4));
    };

    const handleMinus = () => {
        setDesiredSize(prev => (prev && prev > 3 ? prev - 1 : 3));
    };

    const handleReset = useCallback(() => {
        dispatch({ type: 'new' });
    }, [dispatch]);

    useEffect(() => {
        if (state.solved) {
            const timeout = setTimeout(() => {
                handleReset();
            }, TIMING_CONSTANTS.WIN_ANIMATION_DELAY);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [state.solved, handleReset]);

    const [interactionAllowed, setInteractionAllowed] = useState(false);

    useEffect(() => {
        if (state.solved) {
            const timeout = setTimeout(() => {
                setInteractionAllowed(true);
            }, TIMING_CONSTANTS.INTERACTION_DELAY);
            return () => {
                clearTimeout(timeout);
            };
        } else {
            setInteractionAllowed(false);
        }
    }, [state.solved]);

    const [isDragging, setIsDragging] = useState<number | null>(null); // null, 0 (left), or 2 (right)
    const draggedCells = useRef(new Set<string>());
    const lastTouchTime = useRef(0);

    const addDraggedCell = useCallback((pos: string) => {
        draggedCells.current.add(pos);
    }, []);

    useEffect(() => {
        const handleStopDragging = () => {
            setIsDragging(null);
            draggedCells.current.clear();
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging === null) return;

            const touch = e.touches[0];
            if (!touch) return;

            const element = document.elementFromPoint(
                touch.clientX,
                touch.clientY
            );
            if (!element) return;

            const cell = element.closest('[data-pos]');
            if (cell) {
                const pos = cell.getAttribute('data-pos');
                if (pos && !draggedCells.current.has(pos)) {
                    const [r, c] = pos.split(',').map(Number);
                    if (r !== undefined && c !== undefined) {
                        dispatch({
                            type: 'toggle',
                            row: r,
                            col: c,
                            reverse: isDragging === 2,
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
    }, [isDragging, addDraggedCell]);

    // Props for Cells
    const getCellProps = (r: number, c: number) => {
        const value = state.grid[r]?.[c];
        const pos = `${String(r)},${String(c)}`;
        const isError = state.cycleCells.has(pos);

        return {
            onMouseDown: (e: React.MouseEvent) => {
                if (state.solved) return;
                if (e.button !== 0 && e.button !== 2) return;
                if (
                    Date.now() - lastTouchTime.current <
                    TIMING_CONSTANTS.TOUCH_HOLD_DELAY
                )
                    return;

                e.preventDefault(); // Prevent text selection
                setIsDragging(e.button);
                dispatch({
                    type: 'toggle',
                    row: r,
                    col: c,
                    reverse: e.button === 2,
                });
                addDraggedCell(pos);
            },
            onMouseEnter: () => {
                if (
                    isDragging !== null &&
                    !draggedCells.current.has(pos) &&
                    !state.solved
                ) {
                    dispatch({
                        type: 'toggle',
                        row: r,
                        col: c,
                        reverse: isDragging === 2,
                    });
                    addDraggedCell(pos);
                }
            },
            onContextMenu: (e: React.MouseEvent) => {
                e.preventDefault();
            },
            onTouchStart: (e: React.TouchEvent) => {
                if (state.solved) return;
                if (e.cancelable) e.preventDefault();
                lastTouchTime.current = Date.now();
                setIsDragging(0); // Touch counts as left click
                dispatch({ type: 'toggle', row: r, col: c });
                addDraggedCell(pos);
            },
            'data-pos': pos,
            sx: {
                cursor: 'pointer',
                border: `1px solid ${COLORS.border.subtle}`,
                position: 'relative',
                transition: 'all 0.2s',
                touchAction: 'none',
                '&:hover': {
                    backgroundColor: COLORS.interactive.hover,
                },
            },
            children: (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                    }}
                >
                    {value === FORWARD && (
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '130%',
                                height: '6px',
                                backgroundColor: isError
                                    ? COLORS.data.red
                                    : COLORS.text.primary,
                                borderRadius: '99px',
                                top: '50%',
                                left: '50%',
                                transform:
                                    'translate(-50%, -50%) rotate(-45deg)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                transition: 'all 0.2s',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                    {value === BACKWARD && (
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '130%',
                                height: '6px',
                                backgroundColor: isError
                                    ? COLORS.data.red
                                    : COLORS.text.primary,
                                borderRadius: '99px',
                                top: '50%',
                                left: '50%',
                                transform:
                                    'translate(-50%, -50%) rotate(45deg)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                transition: 'all 0.2s',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </Box>
            ),
        };
    };

    const numberSize = size * NUMBER_SIZE_RATIO;
    const numberSpace = size - numberSize;

    // Props for Numbers (Grid Overlay)
    const getNumberProps = (r: number, c: number) => {
        const value = state.numbers[r]?.[c];
        const hasError = state.errorNodes.has(`${String(r)},${String(c)}`);
        const isSatisfied = state.satisfiedNodes.has(
            `${String(r)},${String(c)}`
        );

        return {
            children: (
                <Box
                    sx={{
                        opacity: isSatisfied && !hasError ? 0.2 : 1,
                        transition: 'opacity 0.3s',
                    }}
                >
                    {value ?? ''}
                </Box>
            ),
            sx: {
                borderRadius: '50%',
                backgroundColor: hasError
                    ? COLORS.data.red
                    : COLORS.surface.background,
                border:
                    value !== null
                        ? `2px solid ${
                              hasError
                                  ? COLORS.data.red
                                  : isSatisfied
                                    ? 'transparent'
                                    : COLORS.border.subtle
                          }`
                        : 'none',
                fontSize: `${String(numberSize * 0.5)}rem`,
                fontWeight: '800',
                color: hasError ? '#fff' : COLORS.text.primary,
                boxShadow:
                    isSatisfied && !hasError
                        ? 'none'
                        : '0 4px 8px rgba(0,0,0,0.1)',
                zIndex: 5,
                opacity: value !== null ? 1 : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                transform: hasError ? 'scale(1.1)' : 'scale(1)',
                position: 'relative',
                pointerEvents: 'none',
            },
        };
    };

    useEffect(() => {
        if (!state.auto || state.solved) return;

        const timeout = setTimeout(() => {
            dispatch({ type: 'nextLogical' });
        }, TIMING_CONSTANTS.AUTO_PLAY_SPEED);
        return () => {
            clearTimeout(timeout);
        };
    }, [state.auto, state.solved, state.grid]);

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                background: `radial-gradient(circle at 50% 50%, ${COLORS.surface.elevated} 0%, ${COLORS.surface.background} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                height: '100vh',
                transition: 'background 0.5s ease-in-out',
            }}
        >
            <GlobalHeader
                showHome={true}
                infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
            />

            <Box
                onClick={() => {
                    if (isGhostMode) setIsGhostMode(false);
                }}
                sx={{
                    flex: 1,
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: `${String(size)}rem`,
                }}
            >
                {/* Main Game Card */}
                <Box
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                    }}
                >
                    {isGhostMode ? (
                        <GhostCanvas
                            rows={rows}
                            cols={cols}
                            numbers={state.numbers}
                            size={size}
                            initialMoves={ghostMoves}
                            onMove={(pos, val) => {
                                setGhostMoves(prev => {
                                    const next = new Map(prev);
                                    if (val === undefined) next.delete(pos);
                                    else next.set(pos, val);
                                    return next;
                                });
                            }}
                        />
                    ) : (
                        <>
                            {/* Grid Container - Isolation for perfect alignment */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    userSelect: 'none',
                                }}
                            >
                                {/* Main Grid */}
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <CustomGrid
                                        size={size}
                                        rows={rows}
                                        cols={cols}
                                        cellProps={getCellProps}
                                        space={0}
                                        sx={{ width: 'fit-content' }}
                                    />
                                </Box>

                                {/* Numbers Grid Overlay */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        transform: `translate(-${String(
                                            numberSize / 2
                                        )}rem, -${String(numberSize / 2)}rem)`,
                                        zIndex: 10,
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <CustomGrid
                                        size={numberSize}
                                        rows={rows + 1}
                                        cols={cols + 1}
                                        cellProps={getNumberProps}
                                        space={numberSpace}
                                        sx={{ width: 'fit-content' }}
                                    />
                                </Box>
                            </Box>

                            {/* Win Overlay */}
                            <Box
                                onClick={handleReset}
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: state.solved ? 1 : 0,
                                    transform: state.solved
                                        ? 'scale(1)'
                                        : 'scale(0.5)',
                                    visibility: state.solved
                                        ? 'visible'
                                        : 'hidden',
                                    transition:
                                        'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    zIndex: 20,
                                    backgroundColor: 'transparent',
                                    pointerEvents: interactionAllowed
                                        ? 'auto'
                                        : 'none',
                                    cursor: interactionAllowed
                                        ? 'pointer'
                                        : 'default',
                                    backdropFilter: 'blur(2px)',
                                }}
                            >
                                <EmojiEventsRounded
                                    sx={{
                                        fontSize: `${String(size)}rem`, // Match Lights Out proportions
                                        color: COLORS.primary.main,
                                        filter: `drop-shadow(0 0 30px ${COLORS.primary.main}88)`,
                                        animation: state.solved
                                            ? 'float 3s ease-in-out infinite'
                                            : 'none',
                                        '@keyframes float': {
                                            '0%, 100%': {
                                                transform: 'translateY(0)',
                                            },
                                            '50%': {
                                                transform: 'translateY(-10px)',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>

            <Controls
                handler={() => () => undefined}
                onAutoPlay={() => {
                    dispatch({ type: 'auto' });
                }}
                autoPlayEnabled={state.auto}
            >
                <TooltipButton
                    title="Decrease Size"
                    Icon={RemoveRounded}
                    onClick={handleMinus}
                    disabled={rows <= 3}
                />
                <TooltipButton
                    title="Increase Size"
                    Icon={AddRounded}
                    onClick={handlePlus}
                    disabled={
                        rows >= 10 ||
                        (rows >= dynamicSize.rows && cols >= dynamicSize.cols)
                    }
                />
                <TooltipButton
                    title={isGhostMode ? 'Close Calculator' : 'Open Calculator'}
                    Icon={Psychology}
                    onClick={() => {
                        setIsGhostMode(!isGhostMode);
                    }}
                    sx={{
                        color: isGhostMode ? COLORS.primary.main : 'inherit',
                        backgroundColor: isGhostMode
                            ? `${COLORS.primary.main}20`
                            : 'transparent',
                    }}
                />
            </Controls>
        </Grid>
    );
}
