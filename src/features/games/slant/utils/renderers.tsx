import { Box } from '@mui/material';

import {
    getSlashLineSx,
    backCellVisualSx,
    slashContainerSx,
    frontOverlaySx,
    INTERACTIVE_BACK_CELL_SX,
    getNumberBubbleSx,
} from './renderers.styles';
import type { DragProps } from '../../hooks/useDrag';
import type { SlantState } from '../types';
import { FORWARD, BACKWARD, EMPTY } from '../types';

import { getPosKey } from '@/utils/gameUtils';

/**
 * Visual-only cell factory for the back (slash) layer.
 *
 * Returns appearance props (aria-label, children, border) without drag
 * interaction, so the same factory can drive both the interactive board
 * (via `getBackProps`) and non-interactive contexts.
 */
export function getBackVisualProps(state: SlantState, size: number) {
    return (r: number, c: number) => {
        const value = state.grid[r]?.[c];
        const pos = getPosKey(r, c);
        const isError = state.cycleCells.has(pos);

        const clues = [
            { v: state.numbers[r]?.[c], p: getPosKey(r, c) },
            { v: state.numbers[r]?.[c + 1], p: getPosKey(r, c + 1) },
            { v: state.numbers[r + 1]?.[c], p: getPosKey(r + 1, c) },
            { v: state.numbers[r + 1]?.[c + 1], p: getPosKey(r + 1, c + 1) },
        ].map(({ v, p }) => {
            if (v == null) return '-';
            const status = state.errorNodes.has(p)
                ? 'Error'
                : state.satisfiedNodes.has(p)
                  ? 'Ok'
                  : 'Pending';
            return `${String(v)} (${status})`;
        });

        return {
            'aria-label': `Cell ${String(r + 1)}, ${String(c + 1)}. Clues: ${clues.join(', ')}. ${
                value === EMPTY
                    ? 'Empty'
                    : value === FORWARD
                      ? 'Forward Slash'
                      : 'Backward Slash'
            }${isError ? ', Loop Error' : ''}`,
            sx: backCellVisualSx,
            children: (
                <Box sx={slashContainerSx}>
                    {value === FORWARD && (
                        <Box sx={getSlashLineSx('-45deg', size, isError)} />
                    )}
                    {value === BACKWARD && (
                        <Box sx={getSlashLineSx('45deg', size, isError)} />
                    )}
                </Box>
            ),
        };
    };
}

/**
 * Drag-enhanced cell factory for the interactive back (slash) layer.
 *
 * Merges drag interaction props on top of the visual props from
 * `getBackVisualProps`, adding cursor and hover behavior.
 */
export const getBackProps = (
    getDragProps: (pos: string) => DragProps,
    state: SlantState,
    size: number,
) => {
    const visualFactory = getBackVisualProps(state, size);

    return (r: number, c: number) => {
        const visual = visualFactory(r, c);
        const pos = getPosKey(r, c);
        const dragProps = getDragProps(pos);

        return {
            ...dragProps,
            ...visual,
            sx: {
                ...dragProps.sx,
                ...(visual.sx as Record<string, unknown>),
                ...INTERACTIVE_BACK_CELL_SX,
            },
        };
    };
};

/**
 * Visual-only cell factory for the front (number hint) layer.
 *
 * Returns appearance props for the number overlay. Uses
 * `pointerEvents: 'none'` so clicks pass through to the back layer.
 */
export const getFrontProps =
    (state: SlantState, numberSize: number) => (r: number, c: number) => {
        const value = state.numbers[r]?.[c];
        const pos = getPosKey(r, c);
        const hasError = state.errorNodes.has(pos);
        const isSatisfied = state.satisfiedNodes.has(pos);

        return {
            sx: frontOverlaySx,
            children: (
                <Box
                    sx={getNumberBubbleSx({
                        numberSize,
                        hasError,
                        isSatisfied,
                        isVisible: value != null,
                    })}
                >
                    {value ?? ''}
                </Box>
            ),
        };
    };
