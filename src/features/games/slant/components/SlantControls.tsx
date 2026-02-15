import React from 'react';

import { GameControls } from '../../components/GameControls';

import { MenuBookRounded } from '@/components/icons';
import { TooltipButton } from '@/components/ui/TooltipButton';

interface SlantControlsProps {
    /** Whether ghost-mode is currently active (hides controls). */
    isGhostMode: boolean;
    /** Props forwarded to the shared GameControls component. */
    controlsProps: React.ComponentProps<typeof GameControls>;
    /** Whether generation is in progress (disables controls). */
    generating: boolean;
    /** Callback to refresh / request a new puzzle. */
    onRefresh: () => void;
    /** Open the "How to Play" tutorial modal. */
    onOpenInfo: () => void;
}

/**
 * Slant-specific control bar that wraps GameControls and adds
 * the "How to Play" tutorial button. The ghost-mode calculator
 * is accessible from within the tutorial modal.
 */
export function SlantControls({
    isGhostMode,
    controlsProps,
    generating,
    onRefresh,
    onOpenInfo,
}: SlantControlsProps): React.ReactElement | null {
    if (isGhostMode) return null;

    return (
        <GameControls
            {...controlsProps}
            onRefresh={onRefresh}
            disabled={generating}
        >
            <TooltipButton
                title="How to Play"
                Icon={MenuBookRounded}
                onClick={onOpenInfo}
            />
        </GameControls>
    );
}
