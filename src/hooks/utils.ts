import { useRef, useEffect, useCallback } from 'react';
import { PROCESSING } from '../config/constants';

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
            case 'next':
                if (
                    PROCESSING.doubleProcessingPrevention &&
                    processingRef.current
                ) {
                    return { ...(states[index.current] as T) };
                }

                if (PROCESSING.doubleProcessingPrevention) {
                    processingRef.current = true;
                }

                const curr = index.current;

                if (curr + 1 === states.length) {
                    const state = states[curr];
                    const next = getStateRef.current(state);

                    if (next === state) {
                    } else {
                        states.push(next);
                        index.current++;
                    }
                } else {
                    index.current++;
                }

                const result = { ...(states[index.current] as T) };

                if (PROCESSING.doubleProcessingPrevention) {
                    setTimeout(() => {
                        processingRef.current = false;
                    }, PROCESSING.resetDelay);
                }

                return result;
            case 'prev':
                if (
                    PROCESSING.doubleProcessingPrevention &&
                    processingRef.current
                ) {
                    return { ...(states[index.current] as T) };
                }

                if (PROCESSING.doubleProcessingPrevention) {
                    processingRef.current = true;
                }

                if (index.current) index.current--;

                const prevResult = { ...(states[index.current] as T) };

                if (PROCESSING.doubleProcessingPrevention) {
                    setTimeout(() => {
                        processingRef.current = false;
                    }, PROCESSING.resetDelay);
                }

                return prevResult;
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

// Keyboard Keys Hook
export function useKeys() {
    const oldHandler = useRef<((event: KeyboardEvent) => void) | null>(null);

    const create = useCallback((handler: (event: KeyboardEvent) => void) => {
        oldHandler.current = handler;
        document.addEventListener('keydown', handler);
    }, []);

    const clear = useCallback((handler?: (event: KeyboardEvent) => void) => {
        const targetHandler = handler || oldHandler.current;
        if (targetHandler) {
            document.removeEventListener('keydown', targetHandler);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (oldHandler.current) {
                document.removeEventListener('keydown', oldHandler.current);
            }
        };
    }, []);

    return { create, clear };
}

// Timer Hook
let globalTimer: NodeJS.Timeout | null = null;
let globalRepeat: (() => void) | null = null;
let globalSpeed = 200;

interface TimerConfig {
    repeat?: (() => void) | null;
    speed?: number;
}

export function useTimer(delay: number) {
    const repeat = useRef<(() => void) | null>(null);
    const speed = useRef<number>(delay);

    const create = useCallback(
        ({ repeat: newRepeat, speed: newSpeed }: TimerConfig) => {
            if (globalTimer !== null) {
                clearInterval(globalTimer);
            }

            globalRepeat = newRepeat || globalRepeat;
            globalSpeed = newSpeed || globalSpeed;
            repeat.current = globalRepeat;
            speed.current = globalSpeed;

            if (globalRepeat) {
                globalTimer = setInterval(globalRepeat, globalSpeed);
            }
        },
        []
    );

    const clear = useCallback(() => {
        if (globalTimer !== null) {
            clearInterval(globalTimer);
            globalTimer = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (globalTimer !== null) {
                clearInterval(globalTimer);
                globalTimer = null;
            }
        };
    }, []);

    return { create, clear };
}
