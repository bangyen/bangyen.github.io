import { useEffect, useRef } from 'react';

import { hasSavedUnsolvedPuzzle } from '../utils/persistence';

interface DimensionRegenerationConfig {
    /** Current grid row count. */
    rows: number;
    /** Current grid column count. */
    cols: number;
    /** Whether ghost mode is active (suppresses the saved-puzzle check). */
    isGhostMode: boolean;
    /** Request a new puzzle from the generation worker. */
    requestGeneration: (rows: number, cols: number) => void;
    /** Cancel any pending generation. */
    cancelGeneration: () => void;
}

/**
 * Requests a new puzzle from the generation worker whenever the grid
 * dimensions change, unless there is already an unsolved puzzle saved
 * for the new size (in which case `useGamePersistence` will restore it).
 *
 * Extracted from `useSlantGame` so dimension-change handling has a
 * single, focused responsibility.
 */
export function useDimensionRegeneration({
    rows,
    cols,
    isGhostMode,
    requestGeneration,
    cancelGeneration,
}: DimensionRegenerationConfig): void {
    const prevDimsRef = useRef<string>(`${String(rows)},${String(cols)}`);

    useEffect(() => {
        const key = `${String(rows)},${String(cols)}`;
        if (key === prevDimsRef.current) return;
        prevDimsRef.current = key;

        if (!isGhostMode && hasSavedUnsolvedPuzzle(rows, cols)) {
            cancelGeneration();
            return;
        }

        requestGeneration(rows, cols);
    }, [rows, cols, requestGeneration, cancelGeneration, isGhostMode]);
}
