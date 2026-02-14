import { useEffect, useState, useCallback, useRef } from 'react';

import type { SlantAction, SlantState, CellState } from '../types';
import { EMPTY } from '../types';
import { createGenerationWorker } from '../utils/workerUtils';
import type { GenerationMessage } from '../workers/generationWorker';

/** Timeout for the initial worker health probe (ms). */
const WORKER_PROBE_TIMEOUT_MS = 2000;

/**
 * Debounce delay before dispatching a generation request (ms).
 * Lets rapid resize / refresh clicks settle so the worker (or main
 * thread) only generates a single puzzle for the final dimensions.
 */
const GENERATION_DEBOUNCE_MS = 250;

type SlantDispatch = React.Dispatch<
    SlantAction | { type: 'hydrate'; state: SlantState }
>;

interface UseGenerationWorkerConfig {
    /** Creates the initial state synchronously (main-thread fallback). */
    getInitialState: (rows: number, cols: number) => SlantState;
    /** Ref to the latest game dispatch, kept in sync by the caller. */
    dispatchRef: React.RefObject<SlantDispatch | null>;
    /** Ref to the latest grid dimensions, kept in sync by the caller. */
    dimsRef: React.RefObject<{ rows: number; cols: number }>;
}

/**
 * Manages the Web Worker lifecycle for off-thread puzzle generation.
 *
 * On mount the hook boots a generation worker, probes it with a tiny
 * puzzle to confirm it is alive, and then uses it for all subsequent
 * generation requests.  If the worker fails or times out the hook
 * transparently falls back to synchronous main-thread generation.
 *
 * Rapid resize / refresh clicks are debounced so only the last request
 * in a burst triggers actual generation.
 */
export function useGenerationWorker({
    getInitialState,
    dispatchRef,
    dimsRef,
}: UseGenerationWorkerConfig) {
    const [generating, setGenerating] = useState(false);

    const genWorkerRef = useRef<Worker | null>(null);
    /**
     * Tri-state worker health indicator:
     * - `'probing'`: probe sent on mount, waiting for first response
     * - `'healthy'`: probe succeeded, worker can be used
     * - `'broken'`:  probe failed or worker errored, use sync fallback
     */
    const workerStatus = useRef<'probing' | 'healthy' | 'broken'>('probing');

    // Monotonically increasing counter so pending rAF callbacks from
    // superseded sync-fallback requests are ignored.
    const genSeqRef = useRef(0);
    const rafRef = useRef(0);
    // Debounce timer — cleared on every new request so only the last
    // one in a rapid burst actually triggers generation.
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Counts outstanding worker GENERATE requests.  The worker processes
    // them in FIFO order, so only the final response (count reaches 0)
    // is the one the user wants — all earlier ones are discarded.
    const workerPendingRef = useRef(0);

    /** Generate synchronously on the main thread (fallback). */
    const generateSync = useCallback(
        (r: number, c: number) => {
            dispatchRef.current?.({
                type: 'hydrate',
                state: getInitialState(r, c),
            });
            setGenerating(false);
        },
        [dispatchRef, getInitialState],
    );

    /**
     * Request a new puzzle.  The actual generation dispatch is debounced
     * so rapid resize / refresh clicks collapse into a single request.
     * The skeleton is shown immediately for responsiveness.
     */
    const requestGeneration = useCallback(
        (r: number, c: number) => {
            // Show the loading skeleton right away.
            setGenerating(true);

            // Cancel any pending debounce / rAF from a previous call.
            if (debounceRef.current !== null) {
                clearTimeout(debounceRef.current);
            }
            cancelAnimationFrame(rafRef.current);

            debounceRef.current = setTimeout(() => {
                debounceRef.current = null;

                // Bump the sequence to invalidate any previous sync callback.
                const seq = ++genSeqRef.current;

                if (
                    workerStatus.current === 'healthy' &&
                    genWorkerRef.current
                ) {
                    workerPendingRef.current++;
                    genWorkerRef.current.postMessage({
                        type: 'GENERATE',
                        payload: { rows: r, cols: c },
                    });
                } else {
                    // Worker not yet proven or broken — generate on
                    // main-thread.  requestAnimationFrame lets React
                    // paint the skeleton before the CPU-intensive sync
                    // work blocks the main thread.
                    rafRef.current = requestAnimationFrame(() => {
                        if (genSeqRef.current === seq) {
                            generateSync(r, c);
                        }
                    });
                }
            }, GENERATION_DEBOUNCE_MS);
        },
        [generateSync],
    );

    /** Request generation using the latest dimensions from the ref. */
    const handleNextAsync = useCallback(() => {
        requestGeneration(dimsRef.current.rows, dimsRef.current.cols);
    }, [requestGeneration, dimsRef]);

    // Boot worker on mount, probe it with a tiny puzzle, then mark healthy.
    useEffect(() => {
        let cancelled = false;
        const worker = createGenerationWorker();
        genWorkerRef.current = worker;

        // If the probe doesn't respond in time, mark the worker broken.
        const probeTimer = setTimeout(() => {
            if (!cancelled && workerStatus.current === 'probing') {
                // eslint-disable-next-line no-console
                console.warn('[Slant] generation worker probe timed out');
                workerStatus.current = 'broken';
                workerPendingRef.current = 0;
                genWorkerRef.current = null;
                worker.terminate();
            }
        }, WORKER_PROBE_TIMEOUT_MS);

        worker.onmessage = (e: MessageEvent<GenerationMessage>) => {
            if (cancelled) return;

            if (e.data.type === 'ERROR') {
                // eslint-disable-next-line no-console
                console.warn(
                    `[Slant] generation worker error: ${String(e.data.payload.message)}`,
                );
                clearTimeout(probeTimer);
                workerStatus.current = 'broken';
                workerPendingRef.current = 0;
                genWorkerRef.current = null;
                worker.terminate();
                return;
            }

            if (e.data.type === 'RESULT') {
                if (workerStatus.current === 'probing') {
                    // Probe response — mark healthy, discard the dummy result.
                    clearTimeout(probeTimer);
                    workerStatus.current = 'healthy';
                    return;
                }

                // The worker processes messages in FIFO order.  If
                // multiple requests were queued (rapid clicks), only the
                // last response matters — discard all earlier ones.
                workerPendingRef.current--;
                if (workerPendingRef.current > 0) return;

                // Real generation result — dispatch to game state.
                const { rows: r, cols: c, numbers, solution } = e.data.payload;
                dispatchRef.current?.({
                    type: 'hydrate',
                    state: {
                        grid: Array.from(
                            { length: r },
                            () => new Array(c).fill(EMPTY) as CellState[],
                        ),
                        numbers,
                        solution,
                        rows: r,
                        cols: c,
                        solved: false,
                        errorNodes: new Set<string>(),
                        cycleCells: new Set<string>(),
                        satisfiedNodes: new Set<string>(),
                    } as unknown as SlantState,
                });
                setGenerating(false);
            }
        };

        worker.onerror = () => {
            // eslint-disable-next-line no-console
            console.warn('[Slant] generation worker script error');
            clearTimeout(probeTimer);
            workerStatus.current = 'broken';
            workerPendingRef.current = 0;
            genWorkerRef.current = null;
            worker.terminate();
        };

        // Send a tiny probe puzzle so the worker can prove it's alive.
        worker.postMessage({
            type: 'GENERATE',
            payload: { rows: 3, cols: 3 },
        });

        return () => {
            cancelled = true;
            clearTimeout(probeTimer);
            if (debounceRef.current !== null) {
                clearTimeout(debounceRef.current);
            }
            worker.terminate();
        };
    }, [dispatchRef]);

    return { generating, requestGeneration, handleNextAsync };
}
