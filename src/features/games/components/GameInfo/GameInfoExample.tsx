import { Box } from '@mui/material';
import React from 'react';

import {
    ExampleContainer,
    ExampleActions,
    ExampleActionButton,
} from './ExampleBase';
import type { useExampleAnimation } from './useExampleAnimation';

import {
    NavigateBeforeRounded,
    NavigateNextRounded,
    PlayArrowRounded,
    PauseRounded,
} from '@/components/icons';

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
