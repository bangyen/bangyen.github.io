import { useEffect, useState, useRef } from 'react';

import type { CellState } from '../types';
import type { CellInfo, Conflict } from '../utils/ghostSolver';
import { solveGhostConstraints } from '../utils/ghostSolver';
import { createWorker } from '../utils/workerUtils';
import type { SolverMessage } from '../workers/solverWorker';

/** Timeout for the initial worker health probe (ms). */
const WORKER_PROBE_TIMEOUT_MS = 2000;

interface UseGhostSolverConfig {
    rows: number;
    cols: number;
    numbers: (number | null)[][];
    userMoves: Map<string, CellState>;
}

interface UseGhostSolverResult {
    gridState: Map<string, CellInfo>;
    conflicts: Conflict[];
    cycleCells: Set<string>;
}

/**
 * Manages a Web Worker for ghost-mode constraint solving with an
 * automatic main-thread fallback.
 *
 * On mount the hook boots a solver worker, probes it with a tiny
 * puzzle to confirm it is alive, and then uses it for all subsequent
 * solve requests.  If the worker fails or times out the hook
 * transparently falls back to synchronous main-thread solving via
 * `solveGhostConstraints`.
 */
export function useGhostSolver({
    rows,
    cols,
    numbers,
    userMoves,
}: UseGhostSolverConfig): UseGhostSolverResult {
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
        }, WORKER_PROBE_TIMEOUT_MS);

        worker.onmessage = (e: MessageEvent) => {
            if (cancelled) return;
            const data = e.data as SolverMessage;
            if (data.type === 'RESULT') {
                setWorkerReady(prev => {
                    if (prev === 'probing') {
                        clearTimeout(probeTimer);
                        return 'healthy';
                    }
                    // Real result — update grid state
                    const {
                        gridState: gs,
                        conflicts: cf,
                        cycleCells: cc,
                    } = data.payload;
                    setGridState(gs);
                    setConflicts(cf);
                    setCycleCells(cc);
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
                userMoves: new Map<string, CellState>(),
            },
        });

        return () => {
            cancelled = true;
            clearTimeout(probeTimer);
            worker.terminate();
        };
    }, []);

    // Send data to worker (or solve on main thread) when inputs change.
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

    return { gridState, conflicts, cycleCells };
}
