import { useState, useCallback } from 'react';

/**
 * Shared hook to manage the state of a game info modal.
 *
 * Provides a simple standard way to handle open/close state
 * across all game implementations.
 */
export function useGameInfo() {
    const [open, setOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setOpen(prev => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleOpen = useCallback(() => {
        setOpen(true);
    }, []);

    return {
        open,
        setOpen,
        toggleOpen,
        handleClose,
        handleOpen,
    };
}
