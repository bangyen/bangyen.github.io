import React, { useReducer, useEffect, useMemo, useState } from 'react';
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

export default function Gokigen(): React.ReactElement {
    const { height, width } = useWindow();
    const mobile = useMobile('sm');

    // Default size handling
    const [desiredSize, setDesiredSize] = useState<number | null>(() => {
        const saved = localStorage.getItem('gokigen-size');
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
        const maxW = Math.min(width, 800) * 0.9;
        const maxH = (height - 200) * 0.9;

        const possibleW = maxW / (cols + 1); // +1 because intersections stick out
        const possibleH = maxH / (rows + 1);

        const pxSize = Math.min(possibleW, possibleH, 60); // Max 60px
        return pxSize / 16; // rem
    }, [width, height, rows, cols]);

    const [state, dispatch] = useReducer(handleBoard, { rows, cols }, init =>
        getInitialState(init.rows, init.cols)
    );

    useEffect(() => {
        localStorage.setItem('gokigen-size', String(desiredSize));
    }, [desiredSize]);

    useEffect(() => {
        if (state.rows !== rows || state.cols !== cols) {
            dispatch({ type: 'resize', rows, cols });
        }
    }, [rows, cols, state.rows, state.cols]);

    useEffect(() => {
        document.title = PAGE_TITLES.gokigen;
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

    // Props for Cells
    const getCellProps = (r: number, c: number) => {
        const value = state.grid[r]?.[c];
        return {
            onClick: () => {
                dispatch({ type: 'toggle', row: r, col: c });
            },
            sx: {
                cursor: 'pointer',
                border: `1px solid ${COLORS.interactive.disabled}`,
                position: 'relative',
                transition: 'all 0.2s',
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
                                width: '120%',
                                height: '2px',
                                backgroundColor: COLORS.text.primary,
                                top: '50%',
                                left: '50%',
                                transform:
                                    'translate(-50%, -50%) rotate(-45deg)',
                            }}
                        />
                    )}
                    {value === BACKWARD && (
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '120%',
                                height: '2px',
                                backgroundColor: COLORS.text.primary,
                                top: '50%',
                                left: '50%',
                                transform:
                                    'translate(-50%, -50%) rotate(45deg)',
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
                backgroundColor: COLORS.surface.elevated,
                border:
                    value !== undefined && value !== null
                        ? `1px solid ${COLORS.border.subtle}`
                        : 'none',
                fontSize: `${String(numberSize * 0.6)}rem`,
                fontWeight: 'bold',
                color: COLORS.text.primary,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 5,
                opacity: value !== undefined && value !== null ? 1 : 0,
            },
        };
    };

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                background: COLORS.surface.background,
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
                <Box sx={{ position: 'relative' }}>
                    {/* Main Grid */}
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <CustomGrid
                            size={size}
                            rows={rows}
                            cols={cols}
                            cellProps={getCellProps}
                            space={0}
                        />
                    </Box>

                    {/* Numbers Grid Overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: `-${String(numberSize / 2)}rem`,
                            left: `-${String(numberSize / 2)}rem`,
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

                    {/* Win Overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: state.solved ? 1 : 0,
                            transform: state.solved ? 'scale(1)' : 'scale(0.5)',
                            visibility: state.solved ? 'visible' : 'hidden',
                            transition:
                                'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            zIndex: 20,
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            backdropFilter: 'blur(2px)',
                            borderRadius: '1rem',
                        }}
                    >
                        <EmojiEventsRounded
                            sx={{
                                fontSize: `${(size * 2).toString()}rem`,
                                color: COLORS.primary.main,
                            }}
                        />
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
