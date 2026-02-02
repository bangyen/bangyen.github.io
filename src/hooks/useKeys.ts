import { useRef, useEffect, useCallback } from 'react';

// Keyboard Keys Hook
export function useKeys() {
    const oldHandler = useRef<((event: KeyboardEvent) => void) | null>(null);

    const create = useCallback((handler: (event: KeyboardEvent) => void) => {
        oldHandler.current = handler;
        document.addEventListener('keydown', handler);
    }, []);

    const clear = useCallback((handler?: (event: KeyboardEvent) => void) => {
        const targetHandler = handler ?? oldHandler.current;
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
