import { useRef, useCallback, useEffect } from 'react';

/**
 * Global timer instance shared across all useTimer hook instances.
 * Only one timer can be active at a time.
 */
let globalTimer: NodeJS.Timeout | null = null;

/**
 * Global repeat function to be called on each timer tick.
 */
let globalRepeat: (() => void) | null = null;

/**
 * Global speed (interval) in milliseconds.
 */
let globalSpeed = 200;

/**
 * Configuration for creating a timer.
 */
interface TimerConfig {
    /** Function to call repeatedly on each interval */
    repeat?: (() => void) | null;
    /** Interval speed in milliseconds */
    speed?: number;
}

/**
 * Custom hook for managing a global interval timer.
 *
 * Features:
 * - Single global timer instance (only one active at a time)
 * - Configurable interval speed
 * - Automatic cleanup on unmount
 * - Can be started, stopped, and reconfigured
 *
 * @param delay - Default interval delay in milliseconds
 * @returns Object with `create` and `clear` functions
 *
 * @example
 * ```tsx
 * function AutoPlayer() {
 *   const { create, clear } = useTimer(200);
 *
 *   const startAutoPlay = () => {
 *     create({
 *       repeat: () => makeNextMove(),
 *       speed: 500
 *     });
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={startAutoPlay}>Start</button>
 *       <button onClick={clear}>Stop</button>
 *     </>
 *   );
 * }
 * ```
 */
export function useTimer(delay: number) {
    const repeat = useRef<(() => void) | null>(null);
    const speed = useRef<number>(delay);

    const create = useCallback(
        ({ repeat: newRepeat, speed: newSpeed }: TimerConfig) => {
            if (globalTimer !== null) {
                clearInterval(globalTimer);
            }

            globalRepeat = newRepeat ?? globalRepeat;
            globalSpeed = newSpeed ?? globalSpeed;
            repeat.current = globalRepeat;
            speed.current = globalSpeed;

            if (globalRepeat) {
                globalTimer = setInterval(globalRepeat, globalSpeed);
            }
        },
        [],
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
