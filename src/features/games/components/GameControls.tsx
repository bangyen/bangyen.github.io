import React from 'react';

import type { BaseControlsProps } from '../hooks/types';

import { RemoveRounded, AddRounded, MenuBookRounded } from '@/components/icons';
import { Navigation } from '@/components/layout/Navigation';
import { RefreshButton } from '@/components/ui/Controls';
import { TooltipButton } from '@/components/ui/TooltipButton';

export interface GameControlsProps extends BaseControlsProps {
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
 * Memoised because the parent re-renders on every game-state
 * dispatch yet the control props (`controlsProps` from `useBaseGame`)
 * are stable between size changes.
 */
export const GameControls = React.memo(function GameControls({
    rows,
    cols,
    dynamicSize,
    minSize,
    maxSize,
    handlePlus,
    handleMinus,
    onRefresh,
    disabled = false,
    onOpenInfo,
    hidden = false,
    children,
}: GameControlsProps) {
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
