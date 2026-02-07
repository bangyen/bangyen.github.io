import { useEffect, useRef } from 'react';

export function useWinTransition(
    isSolved: boolean,
    onComplete: () => void,
    delay = 2000
) {
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        if (isSolved) {
            const timeout = setTimeout(() => {
                onCompleteRef.current();
            }, delay);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isSolved, delay]);
}
