import { useState, useEffect, useRef, useCallback } from 'react';
import { useMediaQuery } from './components/mui';
import { PROCESSING } from './config/constants';

interface Size {
    width: number;
    height: number;
}

interface RefObject<T> {
    current: T | null;
}

function getWindow(): Size {
    const { innerWidth: width, innerHeight: height } = window;

    return { width, height };
}

function getContainer(container: RefObject<HTMLElement> | null): Size {
    if (!container || !container.current) return getWindow();

    const { offsetHeight: height, offsetWidth: width } = container.current;

    return { width, height };
}

function useSize(getSize: () => Size) {
    const [size, setSize] = useState<Size>(getSize());

    const { addEventListener: addEvent, removeEventListener: removeEvent } =
        window;

    useEffect(() => {
        function handleResize() {
            setSize(getSize());
        }

        addEvent('resize', handleResize);

        return () => removeEvent('resize', handleResize);
    }, [getSize, addEvent, removeEvent]);

    return { size, setSize };
}

export function useContainer(container: RefObject<HTMLElement> | null): Size {
    const initialSize = getContainer(container);
    const [size, setSize] = useState<Size>(initialSize);
    const prevSizeRef = useRef<Size>(initialSize);

    useEffect(() => {
        const newSize = getContainer(container);
        // Only update if values actually changed
        if (
            newSize.width !== prevSizeRef.current.width ||
            newSize.height !== prevSizeRef.current.height
        ) {
            prevSizeRef.current = newSize;
            setSize(newSize);
        }
    }, [container]);

    useEffect(() => {
        function handleResize() {
            const newSize = getContainer(container);
            setSize(prevSize => {
                // Only update if values actually changed
                if (
                    newSize.width !== prevSize.width ||
                    newSize.height !== prevSize.height
                ) {
                    return newSize;
                }
                return prevSize;
            });
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [container]);

    return size;
}

export function useWindow(): Size {
    const { size } = useSize(getWindow);

    return size;
}

export function useMobile(size: string): boolean {
    return useMediaQuery((theme: unknown) => {
        const muiTheme = theme as {
            breakpoints: { down: (size: string) => string };
        };
        return muiTheme.breakpoints.down(size);
    });
}

// Global timer reference to handle React StrictMode multiple instances
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
            // Clear any existing timer first
            if (globalTimer !== null) {
                clearInterval(globalTimer);
            }

            globalRepeat = newRepeat || globalRepeat;
            globalSpeed = newSpeed || globalSpeed;
            repeat.current = globalRepeat;
            speed.current = globalSpeed;

            // Only create timer if we have a valid repeat function
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
