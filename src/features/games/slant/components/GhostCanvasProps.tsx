/**
 * Pure prop-factory functions for GhostCanvas grid cells and number hints.
 * Extracted so `GhostCanvas` focuses on layout and hook orchestration
 * while this module owns the per-cell rendering logic.
 */

import { GhostCell } from './GhostCell';
import { GhostHint } from './GhostHint';
import type { DragProps } from '../../hooks/useDrag';
import { SLANT_STYLES } from '../config/constants';
import { EMPTY } from '../types';
import type { CellInfo } from '../utils/ghostSolver';

import { COLORS } from '@/config/theme';
import { getPosKey } from '@/utils/gameUtils';

// ---------------------------------------------------------------------------
// Cell props
// ---------------------------------------------------------------------------

interface BuildCellPropsArgs {
    r: number;
    c: number;
    gridState: Map<string, CellInfo>;
    conflictSet: Set<string>;
    cycleCells: Set<string>;
    getDragProps: (pos: string) => DragProps;
}

/**
 * Builds the prop object for a single ghost-board cell.
 * Determines the cell's visual colour based on conflict / cycle / source
 * status and merges in drag-interaction props.
 */
export function buildCellProps({
    r,
    c,
    gridState,
    conflictSet,
    cycleCells,
    getDragProps,
}: BuildCellPropsArgs) {
    const pos = getPosKey(r, c);
    const info = gridState.get(pos);
    const value = info?.state ?? EMPTY;
    const source = info?.source;
    const isConflict = conflictSet.has(pos);
    const isCycle = cycleCells.has(pos);
    const dragProps = getDragProps(pos);

    let color = COLORS.text.primary;

    if (isConflict) {
        color = COLORS.data.red;
    } else if (isCycle) {
        color = source === 'user' ? COLORS.data.red : COLORS.data.orange;
    } else if (source === 'user') {
        color = COLORS.primary.main;
    } else if (source === 'propagated') {
        color = COLORS.data.green;
    }

    return {
        ...dragProps,
        'data-pos': pos,
        'data-type': 'cell',
        sx: {
            ...dragProps.sx,
            cursor: 'pointer',
            border: `1px solid ${SLANT_STYLES.GHOST.BORDER}`,
            position: 'relative',
            backgroundColor: SLANT_STYLES.GHOST.BG_SUBTLE,
            '&:hover': {
                backgroundColor: SLANT_STYLES.GHOST.BG_HOVER,
            },
        },
        children: <GhostCell value={value} color={color} />,
    };
}

// ---------------------------------------------------------------------------
// Number (hint) props
// ---------------------------------------------------------------------------

interface BuildNumberPropsArgs {
    r: number;
    c: number;
    numbers: (number | null)[][];
    nodeConflictSet: Set<string>;
    numberSize: number;
}

/**
 * Builds the prop object for a single number-hint overlay cell.
 * Shows the clue value with conflict highlighting when appropriate.
 */
export function buildNumberProps({
    r,
    c,
    numbers,
    nodeConflictSet,
    numberSize,
}: BuildNumberPropsArgs) {
    const value = numbers[r]?.[c];
    const hasConflict = nodeConflictSet.has(getPosKey(r, c));

    return {
        'data-pos': getPosKey(r, c),
        'data-type': 'hint',
        children: (
            <GhostHint
                value={value ?? null}
                hasConflict={hasConflict}
                numberSize={numberSize}
            />
        ),
        sx: {
            borderRadius: '50%',
            backgroundColor: hasConflict
                ? COLORS.data.red
                : SLANT_STYLES.GHOST.HINT_BG,
            border:
                value == null
                    ? 'none'
                    : `2px solid ${
                          hasConflict
                              ? COLORS.data.red
                              : SLANT_STYLES.GHOST.HINT_BORDER
                      }`,
            zIndex: 5,
            opacity: value == null ? 0 : 1,
            position: 'relative',
            pointerEvents: 'none',
        },
    };
}
