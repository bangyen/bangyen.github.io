import { Box } from '@mui/material';
import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef,
} from 'react';

import { GhostCell } from './GhostCell';
import { GhostControls } from './GhostControls';
import { GhostHint } from './GhostHint';
import { BOARD_STYLES, GAME_CONSTANTS } from '../../config';
import { useGameInteraction } from '../../hooks/useGameInteraction';
import { NUMBER_SIZE_RATIO, SLANT_STYLES } from '../constants';
import type { CellState } from '../types';
import { FORWARD, BACKWARD, EMPTY } from '../types';
import { solveGhostConstraints } from '../utils/ghostSolver';
import { createWorker } from '../utils/workerUtils';
import type { SolverMessage } from '../workers/solverWorker';

import { CustomGrid } from '@/components/ui/CustomGrid';
import { COLORS, LAYOUT } from '@/config/theme';
import { useMobile } from '@/hooks';
import { getPosKey } from '@/utils/gameUtils';

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

    // Computed state
    const [gridState, setGridState] = useState<Map<string, CellInfo>>(
        new Map(),
    );
    const [conflicts, setConflicts] = useState<Conflict[]>([]);
    const [cycleCells, setCycleCells] = useState<Set<string>>(new Set());

    // Web Worker with main-thread fallback.
    // workerReady is state (not a ref) so that the solve effect re-runs
    // once the probe succeeds or the worker is marked broken.
    const workerRef = useRef<Worker | null>(null);
    const [workerReady, setWorkerReady] = useState<
        'probing' | 'healthy' | 'broken'
    >('probing');

    useEffect(() => {
        let cancelled = false;
        const worker = createWorker();
        workerRef.current = worker;

        const probeTimer = setTimeout(() => {
            if (!cancelled) {
                setWorkerReady('broken');
                workerRef.current = null;
                worker.terminate();
            }
        }, 2000);

        worker.onmessage = (e: MessageEvent) => {
            if (cancelled) return;
            const data = e.data as SolverMessage;
            if (data.type === 'RESULT') {
                setWorkerReady(prev => {
                    if (prev === 'probing') {
                        clearTimeout(probeTimer);
                        return 'healthy'; // Probe succeeded; discard result
                    }
                    // Real result — update grid state
                    const { gridState, conflicts, cycleCells } = data.payload;
                    setGridState(gridState);
                    setConflicts(conflicts);
                    setCycleCells(cycleCells);
                    return prev;
                });
            }
        };

        worker.onerror = () => {
            clearTimeout(probeTimer);
            setWorkerReady('broken');
            workerRef.current = null;
            worker.terminate();
        };

        // Send a tiny probe so the worker can prove it's alive.
        worker.postMessage({
            type: 'SOLVE',
            payload: {
                rows: 2,
                cols: 2,
                numbers: [
                    [null, null, null],
                    [null, null, null],
                    [null, null, null],
                ],
                userMoves: new Map(),
            },
        });

        return () => {
            cancelled = true;
            clearTimeout(probeTimer);
            worker.terminate();
        };
    }, []);

    // Engine: Send data to worker (or solve on main thread) when inputs change.
    // Depends on workerReady so the first real solve runs after the probe.
    useEffect(() => {
        if (workerReady === 'healthy' && workerRef.current) {
            workerRef.current.postMessage({
                type: 'SOLVE',
                payload: { rows, cols, numbers, userMoves },
            });
        } else if (workerReady === 'broken') {
            const result = solveGhostConstraints(
                rows,
                cols,
                numbers,
                userMoves,
            );
            setGridState(result.gridState);
            setConflicts(result.conflicts);
            setCycleCells(result.cycleCells);
        }
    }, [userMoves, numbers, rows, cols, workerReady]);

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
