import { Typography, Box } from '@mui/material';
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
} from '@/components/icons';
import { CustomGrid } from '@/components/ui/CustomGrid';
import { COLORS } from '@/config/theme';
import { ExampleActionButton } from '@/features/games/components/GameInfo/ExampleBase';
import { GameInfoExample } from '@/features/games/components/GameInfo/GameInfoExample';
import { useExampleAnimation } from '@/features/games/components/GameInfo/useExampleAnimation';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
 * Merges a base cell-prop factory with an animated-icon factory.
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
// FrameRenderer component
// ---------------------------------------------------------------------------

interface FrameRendererProps {
    frameIdx: number;
    activeView: 'board' | 'calculator';
    size: number;
    palette: Palette;
    getFrontProps: PropsFactory;
    getBackProps: PropsFactory;
}

const FrameRenderer = ({
    frameIdx: remainder,
    activeView,
    size,
    palette,
    getFrontProps,
    getBackProps,
}: FrameRendererProps) => {
    const { boardStates, inputStates, outputStates } = EXAMPLE_ANIMATION_DATA;
    const dims = 3;
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

    return activeView === 'board' ? (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <style>{LIGHTS_OUT_STYLES.ANIMATIONS.POP_IN}</style>
            <Board
                size={size}
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
                        animation: LIGHTS_OUT_STYLES.ANIMATIONS.POP_IN_STYLE,
                    }}
                >
                    {(() => {
                        const finalState = boardStates[inputStates.length - 1];
                        const allOn = finalState?.every(
                            (rowVal: number) => rowVal === (1 << dims) - 1,
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
                    size={size}
                    cellProps={inputProps}
                    space={0}
                />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                <CustomGrid
                    rows={1}
                    cols={dims}
                    size={size}
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
    );
};

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
    const { inputStates, phaseIndices } = EXAMPLE_ANIMATION_DATA;

    const animation = useExampleAnimation({
        frameCount: inputStates.length,
    });
    const { frameIdx, isPlaying, setIsPlaying } = animation;

    const [activeView, setActiveView] = useState<'board' | 'calculator'>(
        'board',
    );

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

    const handleToggleView = () => {
        setIsPlaying(false);
        setActiveView(prev => (prev === 'board' ? 'calculator' : 'board'));
    };

    return (
        <GameInfoExample
            animation={animation}
            renderFrame={remainder => (
                <FrameRenderer
                    frameIdx={remainder}
                    activeView={activeView}
                    size={size}
                    palette={palette}
                    getFrontProps={getFrontProps}
                    getBackProps={getBackProps}
                />
            )}
            extraActions={
                <ExampleActionButton
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
                </ExampleActionButton>
            }
        />
    );
}
