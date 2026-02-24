/* eslint-disable react-refresh/only-export-components */
import { Box, Button, styled } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';

import {
    NavigateBeforeRounded,
    NavigateNextRounded,
    PlayArrowRounded,
    PauseRounded,
} from '@/components/icons';
import { COLORS } from '@/config/theme';

// ---------------------------------------------------------------------------
// Styled Components
// ---------------------------------------------------------------------------

/**
 * Shared container for the example animation. Supports side-by-side
 * layout on desktop and stacked layout on mobile.
 */
export const ExampleContainer = styled(Box)(({ theme }) => ({
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

/**
 * Shared action button group for the example animation.
 * Positions controls (Play/Pause, Step Back/Next, Toggles) in a grid.
 */
export const ExampleActions = styled(Box)(({ theme }) => ({
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

/**
 * Shared action button used within the ExampleActions group.
 * Matches the platform's glassmorphism aesthetic.
 */
export const ExampleActionButton = styled(Button)(({ theme }) => ({
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

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

interface UseExampleAnimationProps {
    /** Total number of frames in the animation. */
    frameCount: number;
    /** Interval between frames in milliseconds. Defaults to 2000. */
    intervalMs?: number;
    /** Whether the animation should be playing by default. Defaults to true. */
    initialIsPlaying?: boolean;
}

/**
 * Shared hook for managing game example animations.
 * Provides playback state, frame stepping, and interval logic.
 */
export function useExampleAnimation({
    frameCount,
    intervalMs = 2000,
    initialIsPlaying = true,
}: UseExampleAnimationProps) {
    const [frameIdx, setFrameIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(initialIsPlaying);

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setFrameIdx(prev => (prev + 1) % frameCount);
        }, intervalMs);

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying, frameCount, intervalMs]);

    const handleTogglePlay = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);

    const handleStepForward = useCallback(() => {
        setIsPlaying(false);
        setFrameIdx(prev => (prev + 1) % frameCount);
    }, [frameCount]);

    const handleStepBack = useCallback(() => {
        setIsPlaying(false);
        setFrameIdx(prev => (prev === 0 ? frameCount - 1 : prev - 1));
    }, [frameCount]);

    const setFrame = useCallback((idx: number) => {
        setIsPlaying(false);
        setFrameIdx(idx);
    }, []);

    return {
        frameIdx,
        isPlaying,
        setIsPlaying,
        handleTogglePlay,
        handleStepForward,
        handleStepBack,
        setFrame,
    };
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

interface GameInfoExampleProps {
    /** The animation state and controls from useExampleAnimation. */
    animation: ReturnType<typeof useExampleAnimation>;
    /** Render function for the actual game frame visual. */
    renderFrame: (frameIdx: number) => React.ReactNode;
    /** Optional extra action buttons to inject between Play and Step controls. */
    extraActions?: React.ReactNode;
}

/**
 * Standardized UI for "Step 1: Example" in the How to Play modal.
 * Provides the frame container on the left (desktop) and control buttons
 * on the right (desktop). Handles all boilerplate for Play/Pause and
 * Step Back/Next buttons.
 */
export function GameInfoExample({
    animation,
    renderFrame,
    extraActions,
}: GameInfoExampleProps): React.ReactElement {
    const {
        frameIdx,
        isPlaying,
        handleTogglePlay,
        handleStepBack,
        handleStepForward,
    } = animation;

    return (
        <ExampleContainer>
            {/* Visual Frame */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                }}
            >
                {renderFrame(frameIdx)}
            </Box>

            {/* Standard Controls */}
            <ExampleActions>
                <ExampleActionButton
                    variant="outlined"
                    startIcon={
                        isPlaying ? <PauseRounded /> : <PlayArrowRounded />
                    }
                    onClick={handleTogglePlay}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </ExampleActionButton>

                {extraActions}

                <ExampleActionButton
                    variant="outlined"
                    startIcon={<NavigateBeforeRounded />}
                    onClick={handleStepBack}
                >
                    Step Back
                </ExampleActionButton>

                <ExampleActionButton
                    variant="outlined"
                    startIcon={<NavigateNextRounded />}
                    onClick={handleStepForward}
                >
                    Step Next
                </ExampleActionButton>
            </ExampleActions>
        </ExampleContainer>
    );
}
