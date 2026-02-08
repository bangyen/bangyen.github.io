import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useMobile } from '../../../hooks';
import { Box } from '@mui/material';
import { COLORS, LAYOUT } from '../../../config/theme';
import { TooltipButton } from '../../../components/ui/TooltipButton';
import {
    CloseRounded,
    ContentCopyRounded,
    DeleteRounded,
} from '../../../components/icons';
import { FORWARD, BACKWARD, EMPTY, CellState } from './boardHandlers';
import { type SolverMessage } from './workers/solverWorker';
import { createWorker } from './workerUtils';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import {
    MOBILE_PADDING,
    DESKTOP_PADDING,
    NUMBER_SIZE_RATIO,
    SLANT_STYLES,
    LAYOUT_CONSTANTS,
} from './constants';
import { GAME_CONSTANTS } from '../config/gameConfig';
import { ANIMATIONS, SPACING } from '../../../config/theme';
import { useGameInteraction } from '../hooks/useGameInteraction';

interface GhostBoardProps {
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

type CellSource = 'user' | 'propagated';
interface CellInfo {
    state: CellState;
    source: CellSource;
}

interface Conflict {
    type: 'cell' | 'node';
    r: number;
    c: number;
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

    const { getDragProps } = useGameInteraction<CellState | undefined>({
        onToggle: (
            r: number,
            c: number,
            isRightClick: boolean,
            draggingValue: CellState | undefined,
            isInitialClick?: boolean
        ) => {
            const pos = `${String(r)},${String(c)}`;

            if (!isInitialClick) {
                onMove(pos, draggingValue);
                return;
            }

            const current = userMoves.get(pos);
            let newState: CellState | undefined;

            if (isRightClick) {
                newState =
                    current === BACKWARD
                        ? FORWARD
                        : current === FORWARD
                          ? undefined
                          : BACKWARD;
            } else {
                newState =
                    current === FORWARD
                        ? BACKWARD
                        : current === BACKWARD
                          ? undefined
                          : FORWARD;
            }
            onMove(pos, newState);
            return newState;
        },
        touchTimeout: GAME_CONSTANTS.timing.touchHoldDelay,
        checkEnabled: () => true,
    });

    // Computed state
    const [gridState, setGridState] = useState<Map<string, CellInfo>>(
        new Map()
    );
    const [conflicts, setConflicts] = useState<Conflict[]>([]);
    const [cycleCells, setCycleCells] = useState<Set<string>>(new Set());

    // Web Worker
    const workerRef = React.useRef<Worker | null>(null);

    useEffect(() => {
        // Initialize worker
        const worker = createWorker();
        workerRef.current = worker;

        worker.onmessage = (e: MessageEvent) => {
            const data = e.data as SolverMessage;
            if (data.type === 'RESULT') {
                const { gridState, conflicts, cycleCells } = data.payload;
                setGridState(gridState);
                setConflicts(conflicts);
                setCycleCells(cycleCells);
            }
        };

        return () => {
            worker.terminate();
        };
    }, []);

    // Engine: Send data to worker when inputs change
    useEffect(() => {
        if (workerRef.current) {
            workerRef.current.postMessage({
                type: 'SOLVE',
                payload: {
                    rows,
                    cols,
                    numbers,
                    userMoves,
                },
            });
        }
    }, [userMoves, numbers, rows, cols]);

    // View Helpers

    const numberSize = size * NUMBER_SIZE_RATIO;
    const numberSpace = size - numberSize;

    const conflictSet = useMemo(
        () =>
            new Set(
                conflicts
                    .filter(c => c.type === 'cell')
                    .map(c => `${String(c.r)},${String(c.c)}`)
            ),
        [conflicts]
    );
    const nodeConflictSet = useMemo(
        () =>
            new Set(
                conflicts
                    .filter(c => c.type === 'node')
                    .map(c => `${String(c.r)},${String(c.c)}`)
            ),
        [conflicts]
    );

    const getCellProps = useCallback(
        (r: number, c: number) => {
            const pos = `${String(r)},${String(c)}`;
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
                    border: `1px solid ${SLANT_STYLES.GHOST.BORDER}`, // Lighter border for dark bg
                    position: 'relative',
                    backgroundColor: SLANT_STYLES.GHOST.BG_SUBTLE,
                    '&:hover': {
                        backgroundColor: SLANT_STYLES.GHOST.BG_HOVER,
                    },
                },
                children: (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                        }}
                    >
                        {value === FORWARD && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: LAYOUT_CONSTANTS.LINE_WIDTH,
                                    height: LAYOUT_CONSTANTS.LINE_THICKNESS,
                                    backgroundColor: color,
                                    borderRadius: SPACING.borderRadius.full,
                                    top: '50%',
                                    left: '50%',
                                    transform:
                                        'translate(-50%, -50%) rotate(-45deg)',
                                    boxShadow: SLANT_STYLES.SHADOWS.LINE,
                                    transition: ANIMATIONS.transition,
                                    pointerEvents: 'none',
                                }}
                            />
                        )}
                        {value === BACKWARD && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: LAYOUT_CONSTANTS.LINE_WIDTH,
                                    height: LAYOUT_CONSTANTS.LINE_THICKNESS,
                                    backgroundColor: color,
                                    borderRadius: SPACING.borderRadius.full,
                                    top: '50%',
                                    left: '50%',
                                    transform:
                                        'translate(-50%, -50%) rotate(45deg)',
                                    boxShadow: SLANT_STYLES.SHADOWS.LINE,
                                    transition: ANIMATIONS.transition,
                                    pointerEvents: 'none',
                                }}
                            />
                        )}
                    </Box>
                ),
            };
        },
        [gridState, conflictSet, cycleCells, getDragProps]
    );

    const getNumberProps = useCallback(
        (r: number, c: number) => {
            const value = numbers[r]?.[c];
            const hasConflict = nodeConflictSet.has(
                `${String(r)},${String(c)}`
            );

            return {
                'data-pos': `${String(r)},${String(c)}`,
                'data-type': 'hint',
                children: <Box>{value ?? ''}</Box>,
                sx: {
                    borderRadius: '50%',
                    backgroundColor: hasConflict
                        ? COLORS.data.red
                        : SLANT_STYLES.GHOST.HINT_BG, // Match dark bg
                    border:
                        value != null
                            ? `2px solid ${
                                  hasConflict
                                      ? COLORS.data.red
                                      : SLANT_STYLES.GHOST.HINT_BORDER // Lighter border
                              }`
                            : 'none',
                    fontSize: `${String(numberSize * 0.5)}rem`,
                    fontWeight: '800',
                    color: hasConflict
                        ? SLANT_STYLES.COLORS.WHITE
                        : SLANT_STYLES.COLORS.WHITE, // Always white text
                    zIndex: 5,
                    opacity: value != null ? 1 : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    transform: hasConflict ? 'scale(1.1)' : 'scale(1)',
                    position: 'relative',
                    pointerEvents: 'none',
                },
            };
        },
        [numbers, nodeConflictSet, numberSize]
    );

    return (
        <Box sx={{ position: 'relative', userSelect: 'none' }}>
            <Box
                sx={{
                    position: 'relative',
                    padding: mobile
                        ? `calc(${MOBILE_PADDING} + 16px)`
                        : `calc(${DESKTOP_PADDING} + 24px)`,
                    border: `2px dashed ${SLANT_STYLES.GHOST.DASHED_BORDER}`,
                    borderRadius: LAYOUT_CONSTANTS.CALCULATOR_BORDER_RADIUS,
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
                            ? `calc(${MOBILE_PADDING} + 16px)`
                            : `calc(${DESKTOP_PADDING} + 24px)`,
                        left: mobile
                            ? `calc(${MOBILE_PADDING} + 16px)`
                            : `calc(${DESKTOP_PADDING} + 24px)`,
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

            {/* Ghost Controls */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    position: 'absolute',
                    bottom: mobile ? -72 : -88,
                    left: 0,
                    right: 0,
                    pointerEvents: 'auto',
                    zIndex: LAYOUT.zIndex.base + 5,
                    paddingBottom: 2,
                }}
            >
                <TooltipButton
                    title="Copy Board"
                    Icon={ContentCopyRounded}
                    onClick={onCopy}
                    sx={{
                        backgroundColor: COLORS.interactive.selected,
                        color: COLORS.primary.main,
                        '&:hover': {
                            backgroundColor: COLORS.interactive.focus,
                        },
                    }}
                />
                <TooltipButton
                    title="Clear Calculator"
                    Icon={DeleteRounded}
                    onClick={onClear}
                    sx={{
                        backgroundColor: 'rgba(255, 68, 68, 0.1)',
                        color: COLORS.data.red,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 68, 68, 0.2)',
                        },
                    }}
                />
                <TooltipButton
                    title="Close Calculator"
                    Icon={CloseRounded}
                    onClick={onClose}
                    sx={{
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        color: COLORS.data.amber,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        },
                    }}
                />
            </Box>
        </Box>
    );
};
