import { flipAdj } from './boardHandlers';
import type { Palette } from '../../components/Board';

export interface AnimationFrame {
    opacity: number;
    content: string;
    color: string;
    transform: string;
}

export type KeyframeMap = Record<string, AnimationFrame>;

/**
 * Generates keyframes for board cell icon animations
 * Shows numbered icons when a cell is predicted to be clicked
 */
export function getBoardIconFrames(
    states: number[][],
    row: number,
    col: number,
    dims: number,
    palette: Palette,
    speed = 1,
): KeyframeMap {
    const length = states.length;
    const frames: KeyframeMap = {};
    const stepSize = 100 / length;

    for (let k = 0; k < length; k++) {
        const start = k * stepSize;
        const end = (k + 1) * stepSize;

        let color = palette.secondary;
        let match = false;
        let predictedContent = '';

        const currentState = states[k];
        const nextState = k + 1 < length ? states[k + 1] : null;

        if (currentState && nextState) {
            const predicted = flipAdj(row, col, currentState, dims, dims);
            match = true;
            for (let r = 0; r < dims; r++) {
                if (predicted[r] !== nextState[r]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                const rowVal = currentState[row];
                if (rowVal !== undefined) {
                    const isOne = (rowVal >> col) & 1;
                    color = isOne ? palette.secondary : palette.primary;
                    predictedContent = `"${String(k + 1)}"`;
                }
            }
        }

        if (match) {
            // Entrance (Pop In)
            frames[`${String(start)}%`] = {
                opacity: 0,
                content: predictedContent,
                color,
                transform: 'scale(0.5)',
            };
            frames[`${String(start + stepSize * (0.1 / speed))}%`] = {
                opacity: 1,
                content: predictedContent,
                color,
                transform: 'scale(1.2)',
            };
            frames[`${String(start + stepSize * (0.2 / speed))}%`] = {
                opacity: 1,
                content: predictedContent,
                color,
                transform: 'scale(1)',
            };

            // Hold
            frames[`${String(end - stepSize * (0.1 / speed))}%`] = {
                opacity: 1,
                content: predictedContent,
                color,
                transform: 'scale(1)',
            };

            // Exit (Fade Out)
            frames[`${String(end)}%`] = {
                opacity: 0,
                content: predictedContent,
                color,
                transform: 'scale(0.5)',
            };
        } else {
            // Keep hidden
            frames[`${String(start)}%`] = {
                opacity: 0,
                content: '""',
                color,
                transform: 'scale(0.5)',
            };
            frames[`${String(end)}%`] = {
                opacity: 0,
                content: '""',
                color,
                transform: 'scale(0.5)',
            };
        }
    }

    return frames;
}

/**
 * Generates keyframes for input row icon animations
 * Shows numbered icons when an input cell changes (2x speed)
 */
export function getInputIconFrames(
    states: number[][],
    col: number,
    palette: Palette,
): KeyframeMap {
    const length = states.length;
    const frames: KeyframeMap = {};
    const stepSize = 100 / length;
    const speed = 2; // 2x speed for input

    for (let k = 0; k < length; k++) {
        const start = k * stepSize;
        const end = (k + 1) * stepSize;

        let color = palette.secondary;
        let match = false;
        let predictedContent = '';

        const currentState = states[k];
        const nextState = k + 1 < length ? states[k + 1] : null;

        if (
            currentState &&
            nextState && // Input states are just rows (number[]), so we check the specific cell
            currentState[col] !== nextState[col]
        ) {
            match = true;
            const isOne = currentState[col] === 1;
            color = isOne ? palette.secondary : palette.primary;
            predictedContent = `"${String(k + 1)}"`;
        }

        if (match) {
            // Entrance (Pop In) - Faster for input
            frames[`${String(start)}%`] = {
                opacity: 0,
                content: predictedContent,
                color,
                transform: 'scale(0.5)',
            };
            frames[`${String(start + stepSize * (0.1 / speed))}%`] = {
                opacity: 1,
                content: predictedContent,
                color,
                transform: 'scale(1.2)',
            };
            frames[`${String(start + stepSize * (0.2 / speed))}%`] = {
                opacity: 1,
                content: predictedContent,
                color,
                transform: 'scale(1)',
            };

            // Hold (End sooner for input to feel snappier)
            frames[`${String(end - stepSize * (0.1 / speed))}%`] = {
                opacity: 1,
                content: predictedContent,
                color,
                transform: 'scale(1)',
            };

            // Exit (Fade Out)
            frames[`${String(end)}%`] = {
                opacity: 0,
                content: predictedContent,
                color,
                transform: 'scale(0.5)',
            };
        } else {
            frames[`${String(start)}%`] = {
                opacity: 0,
                content: '""',
                color,
                transform: 'scale(0.5)',
            };
            frames[`${String(end)}%`] = {
                opacity: 0,
                content: '""',
                color,
                transform: 'scale(0.5)',
            };
        }
    }

    return frames;
}
