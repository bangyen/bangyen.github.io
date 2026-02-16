import { Box } from '@mui/material';
import React, { useMemo, useCallback } from 'react';

import { GhostCell } from './GhostCell';
import { GhostControls } from './GhostControls';
import { GhostHint } from './GhostHint';
import { BOARD_STYLES, GAME_CONSTANTS } from '../../config/constants';
import { useDrag } from '../../hooks/useDrag';
import { NUMBER_SIZE_RATIO, SLANT_STYLES } from '../config/constants';
import { useGhostSolver } from '../hooks/useGhostSolver';
import type { CellState } from '../types';
import { FORWARD, BACKWARD, EMPTY } from '../types';

import { CustomGrid } from '@/components/ui/CustomGrid';
import { COLORS, LAYOUT } from '@/config/theme';
import { useMobile } from '@/hooks';
import { getPosKey } from '@/utils/gameUtils';

export interface GhostBoardProps {
    rows: number;
    cols: number;
    numbers: (number | null)[][];
    size: number;
    initialMoves: Map<string, CellState>;
    onMove: (pos: string, val: CellState | undefined) => void;
    onCopy?: () => void;
    onClear?: () => void;
    onClose?: () => void;
}

export const GhostCanvas: React.FC<GhostBoardProps> = ({
    rows,
    cols,
    numbers,
    size,
    initialMoves,
    onMove,
    onCopy,
    onClear,
    onClose,
}) => {
    const mobile = useMobile('sm');
    // User inputs: just strict assignments
    const userMoves = initialMoves;

    const { getDragProps } = useDrag<CellState | undefined>({
        onToggle: (
            r: number,
            c: number,
            isRightClick: boolean,
            draggingValue: CellState | undefined,
            isInitialClick?: boolean,
        ) => {
            const pos = getPosKey(r, c);

            if (!isInitialClick) {
                onMove(pos, draggingValue);
                return;
            }

            const current = userMoves.get(pos);
            let newState: CellState | undefined;

            if (isRightClick) {
                newState =
                    current === FORWARD
                        ? BACKWARD
                        : current === BACKWARD
                          ? undefined
                          : FORWARD;
            } else {
                newState =
                    current === BACKWARD
                        ? FORWARD
                        : current === FORWARD
                          ? undefined
                          : BACKWARD;
            }
            onMove(pos, newState);
            return newState;
        },
        touchTimeout: GAME_CONSTANTS.timing.touchHoldDelay,
        checkEnabled: () => true,
    });

    const { gridState, conflicts, cycleCells } = useGhostSolver({
        rows,
        cols,
        numbers,
        userMoves,
    });

    // View Helpers

    const numberSize = size * NUMBER_SIZE_RATIO;
    const numberSpace = size - numberSize;

    const conflictSet = useMemo(
        () =>
            new Set(
                conflicts
                    .filter(c => c.type === 'cell')
                    .map(c => getPosKey(c.r, c.c)),
            ),
        [conflicts],
    );
    const nodeConflictSet = useMemo(
        () =>
            new Set(
                conflicts
                    .filter(c => c.type === 'node')
                    .map(c => getPosKey(c.r, c.c)),
            ),
        [conflicts],
    );

    const getCellProps = useCallback(
        (r: number, c: number) => {
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
                // Differentiate user vs propagated loops
                color = source === 'user' ? COLORS.data.red : '#ff9800'; // Solid Orange for visibility
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
        },
        [gridState, conflictSet, cycleCells, getDragProps],
    );

    const getNumberProps = useCallback(
        (r: number, c: number) => {
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
        },
        [numbers, nodeConflictSet, numberSize],
    );

    return (
        <Box sx={{ position: 'relative', userSelect: 'none' }}>
            <Box
                sx={{
                    position: 'relative',
                    padding: mobile
                        ? BOARD_STYLES.PADDING.MOBILE
                        : BOARD_STYLES.PADDING.DESKTOP,
                    border: `2px dashed ${SLANT_STYLES.GHOST.DASHED_BORDER}`,
                    borderRadius: BOARD_STYLES.BORDER_RADIUS,
                }}
            >
                {/* Main Grid */}
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: LAYOUT.zIndex.base + 1,
                    }}
                >
                    <CustomGrid
                        size={size}
                        rows={rows}
                        cols={cols}
                        cellProps={getCellProps}
                        space={0}
                        sx={{ width: 'fit-content' }}
                    />
                </Box>

                {/* Numbers Grid Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: mobile
                            ? BOARD_STYLES.PADDING.MOBILE
                            : BOARD_STYLES.PADDING.DESKTOP,
                        left: mobile
                            ? BOARD_STYLES.PADDING.MOBILE
                            : BOARD_STYLES.PADDING.DESKTOP,
                        transform: `translate(-${String(numberSize / 2)}rem, -${String(numberSize / 2)}rem)`,
                        zIndex: LAYOUT.zIndex.base + 2,
                        pointerEvents: 'none',
                    }}
                >
                    <CustomGrid
                        size={numberSize}
                        rows={rows + 1}
                        cols={cols + 1}
                        cellProps={getNumberProps}
                        space={numberSpace}
                        sx={{ width: 'fit-content' }}
                    />
                </Box>
            </Box>

            <GhostControls
                onCopy={onCopy}
                onClear={onClear}
                onClose={onClose}
            />
        </Box>
    );
};
