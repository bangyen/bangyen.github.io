import { useState, useEffect, useCallback } from 'react';

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
