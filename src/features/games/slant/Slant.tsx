import React, {
    useReducer,
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
} from 'react';
import { Box, Grid } from '../../../components/mui';
import { EmojiEventsRounded, Psychology } from '../../../components/icons';
import { GhostCanvas } from './GhostCanvas';
import { GameControls } from '../components/GameControls';
import { CellState } from './boardHandlers';
import { TooltipButton } from '../../../components/ui/TooltipButton';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';
import { PAGE_TITLES } from '../../../config/constants';
import { COLORS, ANIMATIONS } from '../../../config/theme';
import {
    handleBoard,
    getInitialState,
    FORWARD,
    BACKWARD,
    EMPTY,
} from './boardHandlers';
import {
    NUMBER_SIZE_RATIO,
    STORAGE_KEYS,
    TIMING_CONSTANTS,
    SLANT_STYLES,
    LAYOUT_CONSTANTS,
    GAME_LOGIC_CONSTANTS,
    MOBILE_PADDING,
    DESKTOP_PADDING,
} from './constants';
import { SlantState } from './boardHandlers';
import { useDrag } from '../hooks/useDrag';
import { useGridSize } from '../hooks/useGridSize';

interface SavedSlantState extends Omit<
    SlantState,
    'errorNodes' | 'cycleCells' | 'satisfiedNodes'
> {
    errorNodes: string[];
    cycleCells: string[];
    satisfiedNodes: string[];
}

export default function Slant() {
    const {
        rows,
        cols,
        handlePlus,
        handleMinus,
        mobile,
        width,
        height,
        dynamicSize,
        minSize,
        maxSize,
    } = useGridSize({
        storageKey: STORAGE_KEYS.SIZE,
        defaultSize: GAME_LOGIC_CONSTANTS.DEFAULT_SIZE,
        minSize: GAME_LOGIC_CONSTANTS.MIN_SIZE,
        headerOffset: {
            mobile: LAYOUT_CONSTANTS.HEADER_OFFSET.MOBILE,
            desktop: LAYOUT_CONSTANTS.HEADER_OFFSET.DESKTOP,
        },
        paddingOffset: 160,
        widthLimit: LAYOUT_CONSTANTS.WIDTH_LIMIT,
        cellSizeReference: 4,
        mobileRowOffset: -2,
    });

    const [isGhostMode, setIsGhostMode] = useState(false);

    // Calculate cell size to fit the board
    const size = useMemo(() => {
        const maxW =
            Math.min(width, LAYOUT_CONSTANTS.BOARD_MAX_WIDTH) *
            LAYOUT_CONSTANTS.BOARD_SIZE_FACTOR;
        const maxH =
            (height -
                (mobile
                    ? LAYOUT_CONSTANTS.HEADER_OFFSET.MOBILE
                    : LAYOUT_CONSTANTS.HEADER_OFFSET.DESKTOP) -
                LAYOUT_CONSTANTS.PADDING_OFFSET) *
            LAYOUT_CONSTANTS.BOARD_SIZE_FACTOR;

        const pxSize = Math.min(
            maxW / (cols + 1), // +1 because intersections stick out
            maxH / (rows + 1),
            LAYOUT_CONSTANTS.MAX_CELL_SIZE
        ); // Max 100px
        return pxSize / LAYOUT_CONSTANTS.REM_BASE; // rem
    }, [width, height, mobile, rows, cols]);

    const initial = useMemo(() => getInitialState(rows, cols), [rows, cols]);

    const [state, dispatch] = useReducer(handleBoard, initial);

    // Sync localStorage and state on init or rows/cols change
    useEffect(() => {
        const stateKey = `${STORAGE_KEYS.STATE}-${String(rows)}x${String(cols)}`;
        const saved = localStorage.getItem(stateKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as SavedSlantState;
                if (parsed.rows === rows && parsed.cols === cols) {
                    dispatch({
                        type: 'hydrate',
                        state: {
                            ...parsed,
                            errorNodes: new Set(parsed.errorNodes),
                            cycleCells: new Set(parsed.cycleCells),
                            satisfiedNodes: new Set(parsed.satisfiedNodes),
                        } as SlantState,
                    });
                }
            } catch (_e) {
                // Ignore corrupted state
            }
        }
    }, [rows, cols]);

    // Ghost mode state
    const [ghostMoves, setGhostMoves] = useState<Map<string, CellState>>(
        new Map()
    );

    // Load ghost moves when state changes
    useEffect(() => {
        const ghostKey = `${STORAGE_KEYS.GHOST_MOVES}-${String(state.rows)}x${String(state.cols)}`;
        const saved = localStorage.getItem(ghostKey);
        if (saved) {
            try {
                setGhostMoves(
                    new Map(JSON.parse(saved) as [string, CellState][])
                );
            } catch (_e) {
                setGhostMoves(new Map());
            }
        } else {
            setGhostMoves(new Map());
        }
    }, [state.numbers, state.rows, state.cols]);

    // Save state on change
    useEffect(() => {
        const stateKey = `${STORAGE_KEYS.STATE}-${String(state.rows)}x${String(state.cols)}`;
        const ghostKey = `${STORAGE_KEYS.GHOST_MOVES}-${String(state.rows)}x${String(state.cols)}`;

        const hasMoves = state.grid.some(row =>
            row.some(cell => cell !== EMPTY)
        );
        const hasGhostMoves = ghostMoves.size > 0;

        if (!hasMoves && !hasGhostMoves) {
            localStorage.removeItem(stateKey);
            localStorage.removeItem(ghostKey);
            return;
        }

        const toSave = {
            ...state,
            errorNodes: Array.from(state.errorNodes),
            cycleCells: Array.from(state.cycleCells),
            satisfiedNodes: Array.from(state.satisfiedNodes),
        };
        localStorage.setItem(stateKey, JSON.stringify(toSave));

        if (hasGhostMoves) {
            localStorage.setItem(
                ghostKey,
                JSON.stringify(Array.from(ghostMoves.entries()))
            );
        } else {
            localStorage.removeItem(ghostKey);
        }
    }, [state, ghostMoves]);

    // Reset ghost moves when puzzle changes
    const lastPuzzleRef = useRef<string>('');
    useEffect(() => {
        const puzzleId = JSON.stringify(state.numbers);
        if (lastPuzzleRef.current && lastPuzzleRef.current !== puzzleId) {
            setGhostMoves(new Map());
        }
        lastPuzzleRef.current = puzzleId;
    }, [state.numbers, state.rows, state.cols]);

    useEffect(() => {
        document.title = PAGE_TITLES.slant;
    }, []);

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

    const { getDragProps } = useDrag({
        onAction: (pos: string, isRightClick: boolean) => {
            if (state.solved) return;
            const [r, c] = pos.split(',').map(Number);
            if (r !== undefined && c !== undefined) {
                dispatch({
                    type: 'toggle',
                    row: r,
                    col: c,
                    reverse: isRightClick,
                });
            }
        },
        checkEnabled: () => !state.solved,
        touchTimeout: TIMING_CONSTANTS.TOUCH_HOLD_DELAY,
    });

    // Props for Cells
    const getCellProps = (r: number, c: number) => {
        const value = state.grid[r]?.[c];
        const pos = `${String(r)},${String(c)}`;
        const isError = state.cycleCells.has(pos);
        const dragProps = getDragProps(pos);

        return {
            ...dragProps,
            sx: {
                ...dragProps.sx,
                cursor: 'pointer',
                border: `1px solid ${COLORS.border.subtle}`,
                position: 'relative',
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
                                boxShadow: SLANT_STYLES.SHADOWS.LINE,
                                transition: ANIMATIONS.transition,
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
                                boxShadow: SLANT_STYLES.SHADOWS.LINE,
                                transition: ANIMATIONS.transition,
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
                color: hasError
                    ? SLANT_STYLES.COLORS.WHITE
                    : COLORS.text.primary,
                boxShadow:
                    isSatisfied && !hasError
                        ? 'none'
                        : SLANT_STYLES.SHADOWS.HINT,
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
        dispatch({
            type: 'resize',
            rows,
            cols,
        });
    }, [rows, cols]);

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
                    marginBottom: mobile ? '180px' : '150px',
                    overflow: 'hidden',
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
                            onCopy={() => {
                                const newMoves = new Map<string, CellState>();
                                state.grid.forEach((row, r) => {
                                    row.forEach((cell, c) => {
                                        if (cell !== EMPTY) {
                                            newMoves.set(
                                                `${String(r)},${String(c)}`,
                                                cell
                                            );
                                        }
                                    });
                                });
                                setGhostMoves(newMoves);
                            }}
                            onClear={() => {
                                setGhostMoves(new Map());
                            }}
                            onClose={() => {
                                setIsGhostMode(false);
                            }}
                        />
                    ) : (
                        <>
                            {/* Grid Container - Isolation for perfect alignment */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    userSelect: 'none',
                                    padding: mobile
                                        ? MOBILE_PADDING
                                        : DESKTOP_PADDING,
                                    border: '2px solid transparent',
                                    borderRadius:
                                        LAYOUT_CONSTANTS.CALCULATOR_BORDER_RADIUS,
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
                                        top: mobile
                                            ? MOBILE_PADDING
                                            : DESKTOP_PADDING,
                                        left: mobile
                                            ? MOBILE_PADDING
                                            : DESKTOP_PADDING,
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

            <GameControls
                rows={rows}
                cols={cols}
                dynamicSize={dynamicSize}
                minSize={minSize}
                maxSize={maxSize}
                handlePlus={handlePlus}
                handleMinus={handleMinus}
                onRefresh={handleReset}
                disabled={isGhostMode}
            >
                <TooltipButton
                    title={'Open Calculator'}
                    Icon={Psychology}
                    onClick={() => {
                        setIsGhostMode(!isGhostMode);
                    }}
                    sx={{
                        color: isGhostMode ? 'primary.main' : 'default',
                    }}
                />
            </GameControls>
        </Grid>
    );
}
