import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Standard response format from Web Workers.
 */
export interface WorkerResponse<T> {
    /** Whether the operation succeeded */
    success: boolean;
    /** Result data if successful */
    result?: T;
    /** Error message if failed */
    error?: string;
}

/**
 * Configuration options for useWorker hook.
 */
export interface UseWorkerOptions<TOutput> {
    /** Callback invoked when worker completes successfully */
    onSuccess?: (result: TOutput) => void;
    /** Callback invoked when worker encounters an error */
    onError?: (error: string) => void;
    /**
     * Optional custom message handler. If provided, the default
     * logic for parsing { success, result, error } is skipped.
     */
    onMessage?: (
        e: MessageEvent,
        helpers: {
            setResult: (res: TOutput) => void;
            setError: (err: string | null) => void;
            setLoading: (l: boolean) => void;
        },
    ) => void;
}

/**
 * Return value from useWorker hook.
 */
export interface UseWorkerReturn<TInput, TOutput> {
    /** Latest result from worker, or null if none */
    result: TOutput | null;
    /** Whether worker is currently processing */
    loading: boolean;
    /** Error message if worker failed, or null */
    error: string | null;
    /** Start worker with given input */
    run: (input: TInput) => void;
    /** Terminate the current worker */
    terminate: () => void;
    /** Manually set result (useful for custom message handlers) */
    setResult: (res: TOutput | null) => void;
    /** Manually set error */
    setError: (err: string | null) => void;
    /** Manually set loading state */
    setLoading: (l: boolean) => void;
}

/**
 * Custom hook to manage Web Worker lifecycle and communication.
 *
 * Features:
 * - Automatic worker creation and cleanup
 * - Type-safe input/output
 * - Loading and error state management
 * - Automatic termination on unmount
 * - Support for custom message handlers
 *
 * @template TInput - Type of input data sent to worker
 * @template TOutput - Type of output data received from worker
 *
 * @param createWorker - Function that returns a new Worker instance
 * @param options - Success/error callbacks and custom message handler
 * @returns Worker state and control functions
 *
 * @example
 * ```tsx
 * function HeavyComputation() {
 *   const createWorker = useCallback(
 *     () => new Worker(new URL('./compute.worker.ts', import.meta.url), { type: 'module' }),
 *     []
 *   );
 *
 *   const { result, loading, error, run } = useWorker<
 *     { n: number },
 *     { value: number }
 *   >(createWorker, {
 *     onSuccess: (data) => console.log('Done:', data.value),
 *     onError: (err) => console.error('Failed:', err),
 *   });
 *
 *   return (
 *     <button onClick={() => run({ n: 1000 })} disabled={loading}>
 *       {loading ? 'Computing...' : 'Start'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useWorker<TInput, TOutput>(
    createWorker: () => Worker,
    options: UseWorkerOptions<TOutput> = {},
): UseWorkerReturn<TInput, TOutput> {
    const [result, setResult] = useState<TOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const workerRef = useRef<Worker | null>(null);

    // Keep option callbacks in refs so `run` has a stable identity
    // regardless of whether callers pass inline object literals.
    const onSuccessRef = useRef(options.onSuccess);
    const onErrorRef = useRef(options.onError);
    const onMessageRef = useRef(options.onMessage);
    onSuccessRef.current = options.onSuccess;
    onErrorRef.current = options.onError;
    onMessageRef.current = options.onMessage;

    const terminate = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    }, []);

    const run = useCallback(
        (input: TInput) => {
            terminate();
            setLoading(true);
            setError(null);

            try {
                const worker = createWorker();
                workerRef.current = worker;

                worker.onmessage = (e: MessageEvent) => {
                    const helpers = { setResult, setError, setLoading };

                    if (onMessageRef.current) {
                        onMessageRef.current(e, helpers);
                        return;
                    }

                    const data = e.data as WorkerResponse<TOutput>;
                    if (data.success && data.result !== undefined) {
                        setResult(data.result);
                        onSuccessRef.current?.(data.result);
                        setLoading(false);
                    } else {
                        const errMsg =
                            data.error ?? 'An unknown error occurred.';
                        setError(errMsg);
                        onErrorRef.current?.(errMsg);
                        setLoading(false);
                    }
                };

                worker.onerror = (e: ErrorEvent) => {
                    // eslint-disable-next-line no-console
                    console.error('Worker error:', e);
                    const errMsg =
                        'An error occurred in the background worker.';
                    setError(errMsg);
                    onErrorRef.current?.(errMsg);
                    setLoading(false);
                };

                worker.postMessage(input);
            } catch (error_) {
                // eslint-disable-next-line no-console
                console.error('Failed to start worker:', error_);
                const errMsg = 'Failed to start calculation worker.';
                setError(errMsg);
                onErrorRef.current?.(errMsg);
                setLoading(false);
            }
        },
        [createWorker, terminate],
    );

    useEffect(() => {
        return () => {
            terminate();
        };
    }, [terminate]);

    return {
        result,
        loading,
        error,
        run,
        terminate,
        setResult,
        setError,
        setLoading,
    };
}
