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
    RefreshRounded,
    EmojiEventsRounded,
} from '../../../components/icons';
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

export default function Slant(): React.ReactElement {
    const { height, width } = useWindow();
    const mobile = useMobile('sm');

    // Default size handling
    const [desiredSize, setDesiredSize] = useState<number | null>(() => {
        const saved = localStorage.getItem('slant-size');
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
        localStorage.setItem('slant-size', String(desiredSize));
    }, [desiredSize]);

    useEffect(() => {
        if (state.rows !== rows || state.cols !== cols) {
            dispatch({ type: 'resize', rows, cols });
        }
    }, [rows, cols, state.rows, state.cols]);

    useEffect(() => {
        document.title = PAGE_TITLES.slant;
    }, []);

    const handlePlus = () => {
        setDesiredSize(prev => (prev ? prev + 1 : 4));
    };

    const handleMinus = () => {
        setDesiredSize(prev => (prev && prev > 3 ? prev - 1 : 3));
    };

    const handleReset = () => {
        dispatch({ type: 'new' });
    };

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

        return {
            onMouseDown: (e: React.MouseEvent) => {
                if (state.solved) return;
                if (e.button !== 0 && e.button !== 2) return;
                if (Date.now() - lastTouchTime.current < 500) return;

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
                                backgroundColor: COLORS.text.primary,
                                borderRadius: '99px',
                                top: '50%',
                                left: '50%',
                                transform:
                                    'translate(-50%, -50%) rotate(-45deg)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                        />
                    )}
                    {value === BACKWARD && (
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '130%',
                                height: '6px',
                                backgroundColor: COLORS.text.primary,
                                borderRadius: '99px',
                                top: '50%',
                                left: '50%',
                                transform:
                                    'translate(-50%, -50%) rotate(45deg)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                        />
                    )}
                </Box>
            ),
        };
    };

    const numberSize = size * 0.4;
    const numberSpace = size - numberSize;

    // Props for Numbers (Grid Overlay)
    const getNumberProps = (r: number, c: number) => {
        const value = state.numbers[r]?.[c];
        return {
            children: value ?? '',
            sx: {
                borderRadius: '50%',
                backgroundColor: COLORS.surface.background,
                border:
                    value !== undefined && value !== null
                        ? `2px solid ${COLORS.border.subtle}`
                        : 'none',
                fontSize: `${String(numberSize * 0.5)}rem`,
                fontWeight: '800',
                color: COLORS.text.primary,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                zIndex: 5,
                opacity: value !== undefined && value !== null ? 1 : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                paddingLeft: '0.1rem',
            },
        };
    };

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
            }}
        >
            <GlobalHeader
                showHome={true}
                infoUrl="https://en.wikipedia.org/wiki/Gokigen_Naname"
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
                    padding: `${String(size)}rem`,
                }}
            >
                {/* Main Game Card */}
                <Box>
                    {/* Grid Container - Isolation for perfect alignment */}
                    <Box sx={{ position: 'relative' }}>
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
                                    numberSize / 2 - 1.25
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
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            opacity: state.solved ? 1 : 0,
                            transform: state.solved
                                ? 'scale(1)'
                                : 'scale(0.95)',
                            visibility: state.solved ? 'visible' : 'hidden',
                            transition:
                                'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            zIndex: 20,
                            // backgroundColor: COLORS.surface.glass,
                            backdropFilter: 'blur(8px)',
                            borderRadius: 4,
                            cursor: 'pointer',
                        }}
                    >
                        <EmojiEventsRounded
                            sx={{
                                fontSize: '4rem',
                                color: COLORS.primary.main,
                                filter: `drop-shadow(0 0 20px ${COLORS.primary.main})`,
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
                        <Box
                            sx={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: COLORS.text.primary,
                            }}
                        >
                            Puzzle Solved!
                        </Box>
                        <Box
                            sx={{
                                fontSize: '0.875rem',
                                color: COLORS.text.secondary,
                                marginTop: 1,
                            }}
                        >
                            Tap to play again
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Controls handler={() => () => undefined}>
                <TooltipButton
                    title="Reset"
                    Icon={RefreshRounded}
                    onClick={handleReset}
                />
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
                    disabled={rows >= 10}
                />
            </Controls>
        </Grid>
    );
}
