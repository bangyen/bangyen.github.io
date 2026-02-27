import { useState, useCallback } from 'react';

/**
 * Standard hook for managing the open/closed state of game information modals.
 */
export function useGameInfoState() {
    const [infoOpen, setInfoOpen] = useState(false);

    const toggleInfo = useCallback(() => {
        setInfoOpen(prev => !prev);
    }, []);

    return {
        infoOpen,
        setInfoOpen,
        toggleInfo,
    };
}
