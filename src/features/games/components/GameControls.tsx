import React from 'react';
import { Controls } from '../../../components/ui/Controls';
import { TooltipButton } from '../../../components/ui/TooltipButton';
import { RemoveRounded, AddRounded } from '../../../components/icons';

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
    const isAtMin = rows <= minSize && cols <= minSize;
    const isAtMax =
        (rows >= maxSize && cols >= maxSize) ||
        (rows === dynamicSize.rows && cols === dynamicSize.cols);

    return (
        <Controls onRefresh={onRefresh}>
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
        </Controls>
    );
}
