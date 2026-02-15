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

/** Build a fresh hydrate state from raw worker output. */
function buildHydrateState(
    r: number,
    c: number,
    numbers: (number | null)[][],
    solution: CellState[][],
): SlantState {
    return {
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
    } as unknown as SlantState;
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
 *
 * Supports prefetching: call `prefetch()` to start generating a puzzle
 * off-screen (e.g. during a win animation).  The result is buffered and
 * applied instantly when `handleNextAsync()` is called.
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

    // --- Prefetch buffering ---
    // When a puzzle is solved we immediately start generating the next
    // one so the work overlaps with the win animation.  The result is
    // held in a buffer and flushed when `handleNextAsync` is called.

    /** When true, the next worker result is buffered instead of dispatched. */
    const prefetchActiveRef = useRef(false);
    /** Buffered prefetch result, ready to flush. */
    const prefetchBufferRef = useRef<SlantState | null>(null);
    /**
     * When true, flush the result as soon as it arrives because the
     * animation already ended while generation was still in-flight.
     */
    const flushOnArrivalRef = useRef(false);

    /** Reset all prefetch bookkeeping. */
    const clearPrefetch = useCallback(() => {
        prefetchActiveRef.current = false;
        prefetchBufferRef.current = null;
        flushOnArrivalRef.current = false;
    }, []);

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
            // A manual generation request cancels any in-progress prefetch.
            clearPrefetch();

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
        [generateSync, clearPrefetch],
    );

    /**
     * Start generating the next puzzle off-screen so the result is ready
     * when `handleNextAsync` is called (e.g. during a win animation).
     * Does not show a loading skeleton — the trophy overlay is visible
     * instead.
     */
    const prefetch = useCallback(
        (r: number, c: number) => {
            // Don't start a second prefetch if one is already active.
            if (prefetchActiveRef.current) return;

            prefetchActiveRef.current = true;
            prefetchBufferRef.current = null;
            flushOnArrivalRef.current = false;

            if (workerStatus.current === 'healthy' && genWorkerRef.current) {
                workerPendingRef.current++;
                genWorkerRef.current.postMessage({
                    type: 'GENERATE',
                    payload: { rows: r, cols: c },
                });
            } else {
                // Sync fallback — run via rAF to avoid janking the win
                // animation on the main thread.
                requestAnimationFrame(() => {
                    if (prefetchActiveRef.current) {
                        prefetchBufferRef.current = getInitialState(r, c);
                    }
                });
            }
        },
        [getInitialState],
    );

    /**
     * Request generation using the latest dimensions from the ref.
     * If a prefetched result is available it is applied instantly
     * without any generation delay.
     */
    const handleNextAsync = useCallback(() => {
        // If a prefetched result is already buffered, flush it instantly.
        if (prefetchBufferRef.current) {
            dispatchRef.current?.({
                type: 'hydrate',
                state: prefetchBufferRef.current,
            });
            clearPrefetch();
            setGenerating(false);
            return;
        }

        // If a prefetch is still in-flight, show the skeleton and flush
        // as soon as the worker delivers the result.
        if (prefetchActiveRef.current) {
            flushOnArrivalRef.current = true;
            setGenerating(true);
            return;
        }

        // No prefetch available — fall back to normal generation.
        requestGeneration(dimsRef.current.rows, dimsRef.current.cols);
    }, [requestGeneration, dimsRef, dispatchRef, clearPrefetch]);

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

                const { rows: r, cols: c, numbers, solution } = e.data.payload;
                const newState = buildHydrateState(r, c, numbers, solution);

                // If this result was prefetched, buffer it instead of
                // dispatching to the game state immediately.
                if (prefetchActiveRef.current) {
                    prefetchBufferRef.current = newState;

                    // If the animation already ended while we were
                    // generating, flush the result right away.
                    if (flushOnArrivalRef.current) {
                        dispatchRef.current?.({
                            type: 'hydrate',
                            state: newState,
                        });
                        prefetchActiveRef.current = false;
                        prefetchBufferRef.current = null;
                        flushOnArrivalRef.current = false;
                        setGenerating(false);
                    }
                    return;
                }

                // Normal result — dispatch immediately.
                dispatchRef.current?.({
                    type: 'hydrate',
                    state: newState,
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

    return { generating, requestGeneration, handleNextAsync, prefetch };
}
