import { Typography, Box } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

import { LIGHTS_OUT_STYLES } from '../config/index';
import type { Palette } from '../types';
import { CanvasBoard } from './CanvasBoard';
import { EXAMPLE_ANIMATION_DATA } from '../utils/animationData';
import { to2DGrid } from '../utils/boardHandlers';

import {
    EmojiEventsRounded,
    Calculate,
    ViewModuleRounded,
} from '@/components/icons';
import { COLORS } from '@/config/theme';
import {
    GameInfoExample,
    ExampleActionButton,
    useExampleAnimation,
} from '@/features/games/components/GameInfo/Example';

// ---------------------------------------------------------------------------
// FrameRenderer component
// ---------------------------------------------------------------------------

interface FrameRendererProps {
    remainder: number;
    activeView: 'board' | 'calculator';
    direction: number;
    dims: number;
    size: number;
    palette: Palette;
    onClick: () => void;
}

const FrameRenderer = ({
    remainder,
    activeView,
    direction,
    dims,
    size,
    palette,
    onClick,
}: FrameRendererProps) => {
    const { boardStates, inputStates, outputStates } = EXAMPLE_ANIMATION_DATA;
    const isSolved = remainder === inputStates.length - 1;

    const gridState = {
        grid: boardStates[remainder] ?? boardStates[0] ?? [],
        rows: dims,
        cols: dims,
    };

    const inputState = inputStates[remainder] ?? [];
    const outputState = outputStates[remainder] ?? [];

    const indicator = EXAMPLE_ANIMATION_DATA.indicators[remainder] ?? null;

    const boardGrid2D = to2DGrid(
        gridState.grid,
        gridState.rows,
        gridState.cols,
    );

    return (
        <Box
            onClick={onClick}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                cursor: 'pointer',
            }}
        >
            <style>{LIGHTS_OUT_STYLES.ANIMATIONS.POP_IN}</style>
            <Box
                key={activeView}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    animation:
                        direction > 0
                            ? 'slide-in-right 0.3s ease-out'
                            : direction < 0
                              ? 'slide-in-left 0.3s ease-out'
                              : 'none',
                    '@keyframes slide-in-right': {
                        '0%': { transform: 'translateX(100%)', opacity: 0 },
                        '100%': { transform: 'translateX(0)', opacity: 1 },
                    },
                    '@keyframes slide-in-left': {
                        '0%': { transform: 'translateX(-100%)', opacity: 0 },
                        '100%': { transform: 'translateX(0)', opacity: 1 },
                    },
                }}
            >
                {activeView === 'board' ? (
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'inline-flex',
                        }}
                    >
                        <CanvasBoard
                            grid={boardGrid2D}
                            palette={palette}
                            size={size}
                        />
                        {indicator?.r !== undefined && (
                            <Box
                                key={`board-indicator-${String(remainder)}`}
                                sx={{
                                    width: `${String(size)}rem`,
                                    height: `${String(size)}rem`,
                                    position: 'absolute',
                                    left: `${String(indicator.c * size)}rem`,
                                    top: `${String(indicator.r * size)}rem`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pointerEvents: 'none',
                                    zIndex: 2,
                                    '&::after': {
                                        content: `"${indicator.label}"`,
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                        filter: LIGHTS_OUT_STYLES.SHADOWS.DROP,
                                        paddingTop: '0.15rem',
                                        color:
                                            ((gridState.grid[indicator.r] ??
                                                0) >>
                                                indicator.c) &
                                            1
                                                ? palette.secondary
                                                : palette.primary,
                                        animation:
                                            LIGHTS_OUT_STYLES.ANIMATIONS
                                                .POP_IN_STYLE,
                                    },
                                }}
                            />
                        )}
                        {isSolved && (
                            <Box
                                key={`trophy-${String(remainder)}`}
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
                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                }}
                            >
                                <CanvasBoard
                                    grid={[inputState]}
                                    size={size}
                                    palette={palette}
                                />
                                {indicator && indicator.r === undefined && (
                                    <Box
                                        key={`calculator-indicator-${String(remainder)}`}
                                        sx={{
                                            width: `${String(size)}rem`,
                                            height: `${String(size)}rem`,
                                            position: 'absolute',
                                            left: `${String(indicator.c * size)}rem`,
                                            top: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            pointerEvents: 'none',
                                            zIndex: 2,
                                            '&::after': {
                                                content: `"${indicator.label}"`,
                                                fontSize: '1.2rem',
                                                fontWeight: '600',
                                                filter: LIGHTS_OUT_STYLES
                                                    .SHADOWS.DROP,
                                                paddingTop: '0.15rem',
                                                color:
                                                    inputState[indicator.c] ===
                                                    1
                                                        ? palette.secondary
                                                        : palette.primary,
                                                animation:
                                                    LIGHTS_OUT_STYLES.ANIMATIONS
                                                        .POP_IN_STYLE,
                                            },
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <CanvasBoard
                                grid={[outputState]}
                                size={size}
                                palette={palette}
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
        </Box>
    );
};

// ---------------------------------------------------------------------------
// Example component
// ---------------------------------------------------------------------------

interface ExampleProps {
    palette: Palette;
    size: number;
}

export function Example({ size, palette }: ExampleProps): React.ReactElement {
    const { inputStates, phaseIndices } = EXAMPLE_ANIMATION_DATA;
    const dims = 3;

    const animation = useExampleAnimation({
        frameCount: inputStates.length,
    });
    const { frameIdx, setIsPlaying } = animation;

    const [[activeView, direction], setView] = useState<
        ['board' | 'calculator', number]
    >(['board', 0]);

    const lastSyncedFrame = useRef<number>(-1);

    // Handle auto-switching logic
    useEffect(() => {
        const nextView =
            frameIdx >= phaseIndices.calculatorStart &&
            frameIdx < phaseIndices.secondChaseStart
                ? 'calculator'
                : 'board';

        if (frameIdx !== lastSyncedFrame.current && nextView !== activeView) {
            setView([nextView, nextView === 'calculator' ? 1 : -1]);
        }
        lastSyncedFrame.current = frameIdx;
    }, [frameIdx, phaseIndices, activeView]);

    const handleToggleView = () => {
        setIsPlaying(false);
        setView(prev => [
            prev[0] === 'board' ? 'calculator' : 'board',
            prev[0] === 'board' ? 1 : -1,
        ]);
    };

    return (
        <GameInfoExample
            animation={animation}
            renderFrame={remainder => (
                <FrameRenderer
                    remainder={remainder}
                    dims={dims}
                    size={size}
                    palette={palette}
                    activeView={activeView}
                    direction={direction}
                    onClick={handleToggleView}
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
