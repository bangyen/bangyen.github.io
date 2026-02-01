import { useRef, useEffect, useCallback } from 'react';
import { GLOBAL_CONFIG } from '../config/constants';

// Cache Hook
export interface CacheAction {
    type: 'next' | 'prev' | 'clear';
    payload: unknown;
}

export function useCache<T>(getState: (state: T) => T) {
    const cache = useRef<T[]>([]);
    const index = useRef<number>(0);
    const processingRef = useRef<boolean>(false);
    const getStateRef = useRef(getState);

    useEffect(() => {
        getStateRef.current = getState;
    }, [getState]);

    return useCallback(({ type, payload }: CacheAction): T => {
        const states = cache.current;

        switch (type) {
            case 'next': {
                // Wrapped case block
                if (
                    GLOBAL_CONFIG.processing.doubleProcessingPrevention &&
                    processingRef.current
                ) {
                    const s = states[index.current];
                    if (!s) return payload as T;
                    return { ...s } as T;
                }

                if (GLOBAL_CONFIG.processing.doubleProcessingPrevention) {
                    processingRef.current = true;
                }

                const curr = index.current;

                if (curr + 1 === states.length) {
                    const state = states[curr];
                    if (!state) return { ...states[0] } as T; // Should not happen

                    const next = getStateRef.current(state);

                    if (next === state) {
                        // State did not change, no-op
                    } else {
                        states.push(next);
                        index.current++;
                    }
                } else {
                    index.current++;
                }

                const s = states[index.current];
                if (!s) return payload as T;
                const result = { ...s } as T;

                if (GLOBAL_CONFIG.processing.doubleProcessingPrevention) {
                    setTimeout(() => {
                        processingRef.current = false;
                    }, GLOBAL_CONFIG.processing.resetDelay);
                }

                return result;
            }
            case 'prev': {
                if (
                    GLOBAL_CONFIG.processing.doubleProcessingPrevention &&
                    processingRef.current
                ) {
                    const s = states[index.current];
                    if (!s) return payload as T;
                    return { ...s } as T;
                }

                if (GLOBAL_CONFIG.processing.doubleProcessingPrevention) {
                    processingRef.current = true;
                }

                if (index.current) index.current--;

                const prevS = states[index.current];
                if (!prevS) return payload as T;
                const prevResult = { ...prevS } as T;

                if (GLOBAL_CONFIG.processing.doubleProcessingPrevention) {
                    setTimeout(() => {
                        processingRef.current = false;
                    }, GLOBAL_CONFIG.processing.resetDelay);
                }

                return prevResult;
            }
            case 'clear':
                cache.current = [{ ...(payload as T) }];
                index.current = 0;
                break;
            default:
                break;
        }

        return payload as T;
    }, []);
}
