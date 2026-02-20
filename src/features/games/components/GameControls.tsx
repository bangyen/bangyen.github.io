import React, { createContext, useContext, useMemo } from 'react';

import type { BaseControlsProps } from '../hooks/types';

import { RemoveRounded, AddRounded, MenuBookRounded } from '@/components/icons';
import { Navigation } from '@/components/layout/Navigation';
import { RefreshButton } from '@/components/ui/Controls';
import { TooltipButton } from '@/components/ui/TooltipButton';

export interface GameControlsProps extends Partial<BaseControlsProps> {
    disabled?: boolean;
    /** When true the entire control bar is hidden (e.g. during analysis mode). */
    hidden?: boolean;
    children?: React.ReactNode;
}

const GameControlsContext = createContext<{
    handlePlus: () => void;
    handleMinus: () => void;
    onRefresh: () => void;
    isAtMin: boolean;
    isAtMax: boolean;
    disabled: boolean;
} | null>(null);

function useGameControlsContext() {
    const context = useContext(GameControlsContext);
    if (!context) {
        throw new Error(
            'GameControls compound components must be rendered within a GameControls component',
        );
    }
    return context;
}

/**
 * Game-specific control bar that composes Navigation directly.
 * Now acts as a Compound Component context provider.
 *
 * Memoised to prevent unnecessary re-renders when game state updates.
 */
function GameControlsBase(props: GameControlsProps) {
    const {
        rows = 0,
        cols = 0,
        dynamicSize = { rows: 0, cols: 0 },
        minSize = 0,
        maxSize = 0,
        handlePlus = () => {
            /* noop */
        },
        handleMinus = () => {
            /* noop */
        },
        onRefresh = () => {
            /* noop */
        },
        disabled = false,
        hidden = false,
        children,
    } = props;

    const isAtMin = Math.min(rows, cols) <= minSize;
    const isAtMax =
        Math.min(rows, cols) >= maxSize ||
        Math.min(rows, cols) >= Math.min(dynamicSize.rows, dynamicSize.cols);

    const contextValue = useMemo(
        () => ({
            handlePlus,
            handleMinus,
            onRefresh,
            isAtMin,
            isAtMax,
            disabled,
        }),
        [handlePlus, handleMinus, onRefresh, isAtMin, isAtMax, disabled],
    );

    if (hidden) return null;

    return (
        <GameControlsContext.Provider value={contextValue}>
            <Navigation>{children}</Navigation>
        </GameControlsContext.Provider>
    );
}

function GameControlsRefresh() {
    const { onRefresh } = useGameControlsContext();
    return <RefreshButton onClick={onRefresh} />;
}

function GameControlsResizeMinus() {
    const { handleMinus, isAtMin, disabled } = useGameControlsContext();
    return (
        <TooltipButton
            title="Decrease Size"
            Icon={RemoveRounded}
            onClick={handleMinus}
            disabled={disabled || isAtMin}
        />
    );
}

function GameControlsResizePlus() {
    const { handlePlus, isAtMax, disabled } = useGameControlsContext();
    return (
        <TooltipButton
            title="Increase Size"
            Icon={AddRounded}
            onClick={handlePlus}
            disabled={disabled || isAtMax}
        />
    );
}

export interface GameControlsInfoProps {
    onClick: () => void;
}

function GameControlsInfo({ onClick }: GameControlsInfoProps) {
    return (
        <TooltipButton
            title="How to Play"
            Icon={MenuBookRounded}
            onClick={onClick}
        />
    );
}

export const GameControls = Object.assign(React.memo(GameControlsBase), {
    Refresh: React.memo(GameControlsRefresh),
    ResizeMinus: React.memo(GameControlsResizeMinus),
    ResizePlus: React.memo(GameControlsResizePlus),
    Info: React.memo(GameControlsInfo),
});
