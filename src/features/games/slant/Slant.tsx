import React, {
    useReducer,
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
} from 'react';
import { Box } from '../../../components/mui';
import { Psychology } from '../../../components/icons';
import { GhostCanvas } from './GhostCanvas';
import { GameControls } from '../components/GameControls';
import { CellState } from './boardHandlers';
import { TooltipButton } from '../../../components/ui/TooltipButton';
import { CustomGrid } from '../../../components/ui/CustomGrid';
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
import { useGridSize } from '../hooks/useGridSize';
import { useGamePersistence } from '../hooks/useGamePersistence';
import { useGameInteraction } from '../hooks/useGameInteraction';
import { GamePageLayout } from '../components/GamePageLayout';
import { TrophyOverlay } from '../components/TrophyOverlay';

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

    // Persistence for main game state
    useGamePersistence<SlantState>({
        storageKey: STORAGE_KEYS.STATE,
        rows,
        cols,
        state,
        enabled: !isGhostMode,
        onRestore: saved => {
            dispatch({ type: 'hydrate', state: saved });
        },
        serialize: s => ({
            ...s,
            errorNodes: Array.from(s.errorNodes),
            cycleCells: Array.from(s.cycleCells),
            satisfiedNodes: Array.from(s.satisfiedNodes),
        }),
        deserialize: (saved: unknown) => {
            const s = saved as SavedSlantState;
            return {
                ...s,
                errorNodes: new Set(s.errorNodes),
                cycleCells: new Set(s.cycleCells),
                satisfiedNodes: new Set(s.satisfiedNodes),
            } as SlantState;
        },
    });

    const [ghostMoves, setGhostMoves] = useState<Map<string, CellState>>(
        new Map()
    );

    // Persistence for ghost moves
    useGamePersistence<Map<string, CellState>>({
        storageKey: STORAGE_KEYS.GHOST_MOVES,
        rows,
        cols,
        state: ghostMoves,
        onRestore: saved => {
            setGhostMoves(saved);
        },
        serialize: m => Array.from(m.entries()),
        deserialize: (saved: unknown) =>
            new Map(saved as [string, CellState][]),
    });

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

    const { getDragProps } = useGameInteraction({
        onToggle: (r, c, isRightClick) => {
            dispatch({
                type: 'toggle',
                row: r,
                col: c,
                reverse: isRightClick,
            });
        },
        checkEnabled: () => !state.solved,
        touchTimeout: TIMING_CONSTANTS.TOUCH_HOLD_DELAY,
    });

    // Props for Cells
    const getCellProps = useCallback(
        (r: number, c: number) => {
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
        },
        [state.grid, state.cycleCells, getDragProps]
    );

    const numberSize = size * NUMBER_SIZE_RATIO;
    const numberSpace = size - numberSize;

    // Props for Numbers (Grid Overlay)
    const getNumberProps = useCallback(
        (r: number, c: number) => {
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
        },
        [state.numbers, state.errorNodes, state.satisfiedNodes, numberSize]
    );

    useEffect(() => {
        dispatch({
            type: 'resize',
            rows,
            cols,
        });
    }, [rows, cols]);

    const controls = (
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
    );

    return (
        <GamePageLayout
            title={PAGE_TITLES.slant}
            infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
            paddingBottom={{ xs: '180px', md: '150px' }}
            controls={controls}
            contentSx={{
                background: `radial-gradient(circle at 50% 50%, ${COLORS.surface.elevated} 0%, ${COLORS.surface.background} 100%)`,
                padding: `${String(size)}rem`,
            }}
        >
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
                    </>
                )}
            </Box>

            <TrophyOverlay
                show={state.solved}
                onClick={handleReset}
                size={size}
                iconSizeRatio={1.0}
                primaryColor={COLORS.primary.main}
                secondaryColor={COLORS.primary.main}
            />
        </GamePageLayout>
    );
}
