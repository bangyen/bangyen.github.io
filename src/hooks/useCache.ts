import { useRef, useEffect, useCallback } from 'react';
import { PROCESSING } from '../config/constants';

interface CacheAction {
    type: 'next' | 'prev' | 'clear';
    payload: unknown;
}

export function useCache(getState: (state: unknown) => unknown) {
    const cache = useRef<unknown[]>([]);
    const index = useRef<number>(0);
    const processingRef = useRef<boolean>(false);
    const getStateRef = useRef(getState);

    // Update the ref whenever getState changes
    useEffect(() => {
        getStateRef.current = getState;
    }, [getState]);

    return useCallback(({ type, payload }: CacheAction): unknown => {
        const states = cache.current;

        switch (type) {
            case 'next':
                // Prevent double processing in React StrictMode
                if (
                    PROCESSING.doubleProcessingPrevention &&
                    processingRef.current
                ) {
                    return { ...(states[index.current] as object) };
                }

                if (PROCESSING.doubleProcessingPrevention) {
                    processingRef.current = true;
                }

                const curr = index.current;

                if (curr + 1 === states.length) {
                    const state = states[curr];
                    const next = getStateRef.current(state);

                    if (next === state) {
                        // No change, stay at current position
                    } else {
                        // Add new state and move to it
                        states.push(next);
                        index.current++;
                    }
                } else {
                    index.current++;
                }

                const result = { ...(states[index.current] as object) };

                // Reset processing flag after a short delay
                if (PROCESSING.doubleProcessingPrevention) {
                    setTimeout(() => {
                        processingRef.current = false;
                    }, PROCESSING.resetDelay);
                }

                return result;
            case 'prev':
                // Prevent double processing in React StrictMode
                if (
                    PROCESSING.doubleProcessingPrevention &&
                    processingRef.current
                ) {
                    return { ...(states[index.current] as object) };
                }

                if (PROCESSING.doubleProcessingPrevention) {
                    processingRef.current = true;
                }

                if (index.current) index.current--;

                const prevResult = { ...(states[index.current] as object) };

                // Reset processing flag after a short delay
                if (PROCESSING.doubleProcessingPrevention) {
                    setTimeout(() => {
                        processingRef.current = false;
                    }, PROCESSING.resetDelay);
                }

                return prevResult;
            case 'clear':
                cache.current = [{ ...(payload as object) }];
                index.current = 0;

                break;
            default:
                break;
        }

        return payload;
    }, []);
}
