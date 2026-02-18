/**
 * Pure prop-factory functions for SlantAnalysisBoard grid cells and number hints.
 * Extracted so `SlantAnalysisBoard` focuses on layout and hook orchestration
 * while this module owns the per-cell rendering logic.
 */

import { AnalysisCell } from './AnalysisCell';
import { AnalysisHint } from './AnalysisHint';
import type { DragProps } from '../../hooks/useDrag';
import { SLANT_STYLES } from '../config/constants';
import { EMPTY, FORWARD, BACKWARD } from '../types';
import type { CellInfo } from '../utils/analysisSolver';

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
    size: number;
}

/**
 * Builds the prop object for a single analysis-board cell.
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
    size,
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
            outline: 'none',
            border: `2px solid ${COLORS.border.subtle}`,
            position: 'relative',
            backgroundColor: SLANT_STYLES.ANALYSIS.BG_SUBTLE,

            '&:hover': {
                backgroundColor: SLANT_STYLES.ANALYSIS.BG_HOVER,
            },
            '&:focus-visible': {
                outline: `3px solid ${COLORS.primary.main}`,
                outlineOffset: '-3px',
                backgroundColor: SLANT_STYLES.ANALYSIS.BG_HOVER,
                boxShadow: `inset 0 0 15px ${COLORS.interactive.focus}`,
            },
        },
        children: <AnalysisCell value={value} color={color} size={size} />,
    };
}

// ---------------------------------------------------------------------------
// Number (hint) props
// ---------------------------------------------------------------------------

interface BuildNumberPropsArgs {
    r: number;
    c: number;
    numbers: (number | null)[][];
    gridState: Map<string, CellInfo>;
    rows: number;
    cols: number;
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
    gridState,
    rows,
    cols,
    nodeConflictSet,
    numberSize,
}: BuildNumberPropsArgs) {
    const value = numbers[r]?.[c];
    const hasConflict = nodeConflictSet.has(getPosKey(r, c));

    // Calculate if node is satisfied (connected slashes == number value AND all neighbors filled)
    let connected = 0;
    let filledNeighbors = 0;
    const neighbors = [
        { r: r - 1, c: c - 1, required: BACKWARD }, // TL
        { r: r - 1, c, required: FORWARD }, // TR
        { r, c: c - 1, required: FORWARD }, // BL
        { r, c, required: BACKWARD }, // BR
    ];

    for (const nb of neighbors) {
        if (nb.r >= 0 && nb.r < rows && nb.c >= 0 && nb.c < cols) {
            const cell = gridState.get(getPosKey(nb.r, nb.c));
            if (cell && cell.state !== EMPTY) {
                filledNeighbors++;
                if (cell.state === nb.required) {
                    connected++;
                }
            }
        }
    }

    const isSatisfied =
        value != null && connected === value && filledNeighbors > 0;

    return {
        'data-pos': getPosKey(r, c),
        'data-type': 'hint',
        children: (
            <AnalysisHint
                value={value ?? null}
                hasConflict={hasConflict}
                isSatisfied={isSatisfied}
                numberSize={numberSize}
            />
        ),
        sx: {
            borderRadius: '50%',
            backgroundColor: hasConflict
                ? COLORS.data.red
                : SLANT_STYLES.ANALYSIS.HINT_BG,
            border:
                value == null
                    ? 'none'
                    : `2px solid ${
                          hasConflict
                              ? COLORS.data.red
                              : isSatisfied
                                ? 'transparent'
                                : SLANT_STYLES.ANALYSIS.HINT_BORDER
                      }`,
            zIndex: 5,
            opacity: value == null ? 0 : 1,
            position: 'relative',
            pointerEvents: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
    };
}
