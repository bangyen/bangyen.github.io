import React from 'react';

import type { BaseControlsProps } from '../hooks/types';
import { useOptionalGameState } from '../hooks/useGameContext';

import { RemoveRounded, AddRounded, MenuBookRounded } from '@/components/icons';
import { Navigation } from '@/components/layout/Navigation';
import { RefreshButton } from '@/components/ui/Controls';
import { TooltipButton } from '@/components/ui/TooltipButton';

export interface GameControlsProps extends Partial<BaseControlsProps> {
    disabled?: boolean;
    /** When provided, renders a built-in "How to Play" tutorial button. */
    onOpenInfo?: () => void;
    /** When true the entire control bar is hidden (e.g. during analysis mode). */
    hidden?: boolean;
    children?: React.ReactNode;
}

/**
 * Game-specific control bar that composes Navigation directly.
 * Provides refresh, resize (plus/minus), an optional "How to Play"
 * button, and an optional slot for extra buttons -- without routing
 * through the generic Controls wrapper.
 *
 * Memoised to prevent unnecessary re-renders when game state updates.
 */
export const GameControls = React.memo(function GameControls(
    props: GameControlsProps,
) {
    const gameState = useOptionalGameState();
    const fallback = gameState?.controlsProps;

    const {
        rows = fallback?.rows ?? 0,
        cols = fallback?.cols ?? 0,
        dynamicSize = fallback?.dynamicSize ?? { rows: 0, cols: 0 },
        minSize = fallback?.minSize ?? 0,
        maxSize = fallback?.maxSize ?? 0,
        handlePlus = fallback?.handlePlus ??
            (() => {
                /* noop */
            }),
        handleMinus = fallback?.handleMinus ??
            (() => {
                /* noop */
            }),
        onRefresh = fallback?.onRefresh ??
            (() => {
                /* noop */
            }),
        disabled = false,
        onOpenInfo,
        hidden = false,
        children,
    } = props;

    if (hidden) return null;

    const isAtMin = Math.min(rows, cols) <= minSize;
    const isAtMax =
        Math.min(rows, cols) >= maxSize ||
        Math.min(rows, cols) >= Math.min(dynamicSize.rows, dynamicSize.cols);

    return (
        <Navigation>
            <RefreshButton onClick={onRefresh} />
            <TooltipButton
                title="Decrease Size"
                Icon={RemoveRounded}
                onClick={handleMinus}
                disabled={disabled || isAtMin}
            />
            <TooltipButton
                title="Increase Size"
                Icon={AddRounded}
                onClick={handlePlus}
                disabled={disabled || isAtMax}
            />
            {onOpenInfo && (
                <TooltipButton
                    title="How to Play"
                    Icon={MenuBookRounded}
                    onClick={onOpenInfo}
                />
            )}
            {children}
        </Navigation>
    );
});
