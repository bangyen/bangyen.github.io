import React from 'react';

import { RemoveRounded, AddRounded } from '@/components/icons';
import { Navigation } from '@/components/layout/Navigation';
import { RefreshButton } from '@/components/ui/Controls';
import { TooltipButton } from '@/components/ui/TooltipButton';

interface GameControlsProps {
    rows: number;
    cols: number;
    dynamicSize: { rows: number; cols: number };
    minSize: number;
    maxSize: number;
    handlePlus: () => void;
    handleMinus: () => void;
    onRefresh: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

/**
 * Game-specific control bar that composes Navigation directly.
 * Provides refresh, resize (plus/minus), and optional extra buttons
 * without routing through the generic Controls wrapper.
 */
export function GameControls({
    rows,
    cols,
    dynamicSize,
    minSize,
    maxSize,
    handlePlus,
    handleMinus,
    onRefresh,
    disabled = false,
    children,
}: GameControlsProps) {
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
            {children}
        </Navigation>
    );
}
