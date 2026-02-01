import { useRef, useCallback, useEffect } from 'react';

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

            globalRepeat = newRepeat ?? globalRepeat;
            globalSpeed = newSpeed ?? globalSpeed;
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
