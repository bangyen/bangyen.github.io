import { useState, useCallback } from 'react';

/**
 * Return type for `useDisclosure`, providing open state and
 * stable callbacks for controlling a boolean flag (modals,
 * drawers, tooltips, etc.).
 */
export interface UseDisclosureReturn {
    /** Whether the disclosure is currently open. */
    isOpen: boolean;
    /** Set the disclosure to open. */
    open: () => void;
    /** Set the disclosure to closed. */
    close: () => void;
    /** Toggle the disclosure between open and closed. */
    toggle: () => void;
}

/**
 * Manages boolean open/close state with stable callbacks,
 * eliminating repeated `useState` + `useCallback` boilerplate
 * for modals, drawers, info panels, and similar UI elements.
 *
 * @param initialState - Whether the disclosure starts open (default `false`)
 * @returns `{ isOpen, open, close, toggle }`
 *
 * @example
 * ```tsx
 * function InfoPanel() {
 *   const { isOpen, toggle } = useDisclosure();
 *   return (
 *     <>
 *       <button onClick={toggle}>Toggle</button>
 *       {isOpen && <p>Details here</p>}
 *     </>
 *   );
 * }
 * ```
 */
export function useDisclosure(initialState = false): UseDisclosureReturn {
    const [isOpen, setIsOpen] = useState(initialState);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);
    const close = useCallback(() => {
        setIsOpen(false);
    }, []);
    const toggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return { isOpen, open, close, toggle };
}
