import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing global keyboard event listeners.
 *
 * Features:
 * - Register and unregister keydown event handlers
 * - Automatic cleanup on component unmount
 * - Prevents memory leaks from lingering event listeners
 *
 * @returns Object with `create` and `clear` functions
 *
 * @example
 * ```tsx
 * function GameControls() {
 *   const { create, clear } = useKeys();
 *
 *   useEffect(() => {
 *     const handleKeys = (e: KeyboardEvent) => {
 *       if (e.key === 'ArrowUp') moveUp();
 *       if (e.key === 'ArrowDown') moveDown();
 *     };
 *
 *     create(handleKeys);
 *     return () => clear(handleKeys);
 *   }, [create, clear]);
 *
 *   return <div>Use arrow keys to control</div>;
 * }
 * ```
 */
export function useKeys() {
    const oldHandler = useRef<((event: KeyboardEvent) => void) | null>(null);

    /**
     * Registers a keydown event listener on the document.
     * @param handler - Function to call when a key is pressed
     */
    const create = useCallback((handler: (event: KeyboardEvent) => void) => {
        oldHandler.current = handler;
        document.addEventListener('keydown', handler);
    }, []);

    /**
     * Removes a keydown event listener from the document.
     * @param handler - Optional specific handler to remove. If not provided, removes the last registered handler.
     */
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
