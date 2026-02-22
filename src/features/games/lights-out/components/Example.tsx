import { Typography, Box, Button, styled } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { getOutput, useHandler as useCalculatorHandler } from './Calculator';
import { Board } from '../../components/Board';
import { LIGHTS_OUT_STYLES } from '../config';
import { useHandler as useBoardHandler } from '../hooks/boardUtils';
import type { Palette, PropsFactory } from '../types';
import { EXAMPLE_ANIMATION_DATA } from '../utils/animationData';

import {
    EmojiEventsRounded,
    Calculate,
    ViewModuleRounded,
    NavigateBeforeRounded,
    NavigateNextRounded,
    PlayArrowRounded,
    PauseRounded,
} from '@/components/icons';
import { CustomGrid } from '@/components/ui/CustomGrid';
import { COLORS } from '@/config/theme';

// ---------------------------------------------------------------------------
// Styled Components
// ---------------------------------------------------------------------------

const ExampleContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(4),
    width: '100%',
    maxWidth: '800px',
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        gap: theme.spacing(8),
    },
}));

const ExampleActions = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(1.5),
    justifyContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '320px',
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr',
        width: 'auto',
        maxWidth: 'none',
    },
}));

const InfoButton = styled(Button)(({ theme }) => ({
    borderColor: COLORS.border.subtle,
    color: COLORS.text.secondary,
    width: '140px',
    [theme.breakpoints.up('sm')]: {
        width: '180px',
    },
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    '& .MuiButton-startIcon': {
        marginRight: theme.spacing(0.5),
        [theme.breakpoints.up('sm')]: {
            marginRight: theme.spacing(1),
        },
    },
}));

function createIconHandler(
    indicator: { r?: number; c?: number; label?: string } | null,
    gridState: number | number[],
    frameIdx: number,
    palette: Palette,
    isBoard: boolean,
) {
    return (row: number, col: number) => {
        // Strict matching: board indicators must have 'r', calculator ones must not.
        const typeMatch =
            indicator &&
            (isBoard ? indicator.r !== undefined : indicator.r === undefined);
        const posMatch =
            indicator &&
            (indicator.r === undefined || indicator.r === row) &&
            (indicator.c === undefined || indicator.c === col);

        if (!typeMatch || !posMatch) return { icon: null };

        // Determine contrast color based on current cell state
        const isLit = Array.isArray(gridState)
            ? gridState[col] === 1
            : Boolean((gridState >> col) & 1);

        return {
            icon: (
                <Box
                    key={`${String(row)}-${String(col)}-${String(frameIdx)}`}
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 2,
                        '&::after': {
                            content: `"${indicator.label ?? ''}"`,
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            filter: LIGHTS_OUT_STYLES.SHADOWS.DROP,
                            paddingTop: '0.15rem',
                            color: isLit ? palette.secondary : palette.primary,
                            animation:
                                LIGHTS_OUT_STYLES.ANIMATIONS.POP_IN_STYLE,
                        },
                    }}
                />
            ),
        };
    };
}

/**
 * Merges a base cell-prop factory with an animated-icon factory, layering
 * the icon on top of the existing children and adding `position: relative`.
 *
 * Both the board and input cells need the same merge logic, so this
 * eliminates the duplicated inline merge blocks.
 */
function mergeWithIcons(
    baseFactory: (row: number, col: number) => Record<string, unknown>,
    iconFactory: (row: number, col: number) => { icon: React.ReactNode },
) {
    return (row: number, col: number) => {
        const baseProps = baseFactory(row, col);
        const { icon } = iconFactory(row, col);

        return {
            ...baseProps,
            children: (
                <>
                    {baseProps['children'] as React.ReactNode}
                    {icon}
                </>
            ),
            sx: {
                ...(baseProps['sx'] as Record<string, unknown>),
                position: 'relative',
            },
        };
    };
}

// ---------------------------------------------------------------------------
// Example component
// ---------------------------------------------------------------------------

interface ExampleProps {
    palette: Palette;
    size: number;
    getFrontProps: PropsFactory;
    getBackProps: PropsFactory;
}

export function Example({
    size,
    palette,
    getFrontProps,
    getBackProps,
}: ExampleProps): React.ReactElement {
    const { boardStates, inputStates, outputStates, phaseIndices } =
        EXAMPLE_ANIMATION_DATA;
    const dims = 3;

    const [frameIdx, setFrameIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeView, setActiveView] = useState<'board' | 'calculator'>(
        'board',
    );

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setFrameIdx(prev => (prev + 1) % inputStates.length);
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying, inputStates.length]);

    // Handle auto-switching logic
    useEffect(() => {
        if (!isPlaying) return;

        if (
            frameIdx >= phaseIndices.calculatorStart &&
            frameIdx < phaseIndices.secondChaseStart
        ) {
            setActiveView('calculator');
        } else {
            setActiveView('board');
        }
    }, [frameIdx, isPlaying, phaseIndices]);

    const handleTogglePlay = () => {
        setIsPlaying(prev => !prev);
    };
    const handleStepForward = () => {
        setIsPlaying(false);
        setFrameIdx(prev => (prev + 1) % inputStates.length);
    };
    const handleStepBack = () => {
        setIsPlaying(false);
        setFrameIdx(prev => (prev === 0 ? inputStates.length - 1 : prev - 1));
    };
    const handleToggleView = () => {
        setIsPlaying(false);
        setActiveView(prev => (prev === 'board' ? 'calculator' : 'board'));
    };

    const width = size;
    const remainder = frameIdx % inputStates.length;
    const isSolved = remainder === inputStates.length - 1;

    const gridState = {
        grid: boardStates[remainder] ?? boardStates[0] ?? [],
        rows: dims,
        cols: dims,
    };

    const boardGetters = useBoardHandler(gridState, palette);
    const baseFrontProps = getFrontProps(boardGetters);
    const backProps = getBackProps(boardGetters);

    const inputState = inputStates[remainder] ?? [];
    const outputState = outputStates[remainder] ?? [];

    const indicator = EXAMPLE_ANIMATION_DATA.indicators[remainder] ?? null;

    const boardIndicator = activeView === 'board' ? indicator : null;
    const inputIndicator = activeView === 'calculator' ? indicator : null;

    const boardIconHandler = createIconHandler(
        boardIndicator,
        indicator?.r === undefined ? 0 : (gridState.grid[indicator.r] ?? 0),
        remainder,
        palette,
        true,
    );
    const inputIconHandler = createIconHandler(
        inputIndicator,
        inputState,
        remainder,
        palette,
        false,
    );

    const frontProps = mergeWithIcons(baseFrontProps, boardIconHandler);

    const inputGetters = useCalculatorHandler(inputState, dims, palette);
    const outputGetters = useCalculatorHandler(outputState, dims, palette);

    const baseInputProps = getOutput(inputGetters);
    const outputProps = getOutput(outputGetters);

    const inputProps = mergeWithIcons(baseInputProps, inputIconHandler);

    // mobile status is derived from useMobile inside the container if needed

    return (
        <ExampleContainer>
            <style>{LIGHTS_OUT_STYLES.ANIMATIONS.POP_IN}</style>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                }}
            >
                {activeView === 'board' ? (
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <Board
                            size={width}
                            layers={[
                                {
                                    rows: dims - 1,
                                    cols: dims - 1,
                                    cellProps: backProps,
                                    decorative: true,
                                },
                                {
                                    rows: dims,
                                    cols: dims,
                                    cellProps: frontProps,
                                },
                            ]}
                        />
                        {isSolved && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pointerEvents: 'none',
                                    zIndex: 10,
                                    animation:
                                        LIGHTS_OUT_STYLES.ANIMATIONS
                                            .POP_IN_STYLE,
                                }}
                            >
                                {(() => {
                                    const finalState =
                                        boardStates[inputStates.length - 1];
                                    const allOn = finalState?.every(
                                        (rowVal: number) =>
                                            rowVal === (1 << dims) - 1,
                                    );
                                    return (
                                        <EmojiEventsRounded
                                            sx={{
                                                fontSize: {
                                                    xs: '2.5rem',
                                                    sm: '4rem',
                                                },
                                                color: allOn
                                                    ? palette.secondary
                                                    : palette.primary,
                                            }}
                                        />
                                    );
                                })()}
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                        }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1, color: COLORS.text.secondary }}
                            >
                                Input
                            </Typography>
                            <CustomGrid
                                rows={1}
                                cols={dims}
                                size={width}
                                cellProps={inputProps}
                                space={0}
                            />
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <CustomGrid
                                rows={1}
                                cols={dims}
                                size={width}
                                cellProps={outputProps}
                                space={0}
                            />
                            <Typography
                                variant="subtitle2"
                                sx={{ mt: 1, color: COLORS.text.secondary }}
                            >
                                Result
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            <ExampleActions>
                <InfoButton
                    variant="outlined"
                    startIcon={
                        isPlaying ? <PauseRounded /> : <PlayArrowRounded />
                    }
                    onClick={handleTogglePlay}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </InfoButton>
                <InfoButton
                    variant="outlined"
                    startIcon={
                        activeView === 'board' ? (
                            <Calculate />
                        ) : (
                            <ViewModuleRounded />
                        )
                    }
                    onClick={handleToggleView}
                >
                    {activeView === 'board' ? 'Calculator' : 'Board'}
                </InfoButton>
                <InfoButton
                    variant="outlined"
                    startIcon={<NavigateBeforeRounded />}
                    onClick={handleStepBack}
                >
                    Step Back
                </InfoButton>
                <InfoButton
                    variant="outlined"
                    startIcon={<NavigateNextRounded />}
                    onClick={handleStepForward}
                >
                    Step Next
                </InfoButton>
            </ExampleActions>
        </ExampleContainer>
    );
}
