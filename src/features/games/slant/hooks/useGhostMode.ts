import type React from 'react';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { useGamePersistence } from '../../hooks/useGamePersistence';
import type { SlantState, CellState } from '../types';
import { EMPTY } from '../types';

import { getPosKey } from '@/utils/gameUtils';

interface UseGhostModeOptions {
    /** Whether ghost mode is currently active (owned by the caller). */
    isGhostMode: boolean;
    /** Setter for the ghost-mode flag (owned by the caller). */
    setIsGhostMode: React.Dispatch<React.SetStateAction<boolean>>;
    /** Full Slant game state (grid, numbers, etc.). */
    state: SlantState;
    /** Current grid row count. */
    rows: number;
    /** Current grid column count. */
    cols: number;
    /** localStorage key for persisting ghost moves. */
    storageKey: string;
    /** Toggle the "How to Play" info modal. */
    toggleInfo: () => void;
}

/**
 * Encapsulates ghost-mode move state and handlers for the Slant puzzle.
 *
 * Ghost mode lets the player sketch tentative moves on a separate overlay
 * without affecting the real board.  This hook owns the moves map,
 * persistence, puzzle-change resets, and every callback the UI needs,
 * keeping the main page component focused on game logic.
 *
 * The `isGhostMode` / `setIsGhostMode` pair is accepted from the caller
 * because several hooks that run *before* this one (e.g. `useBaseGame`
 * persistence, stale-result handler) also need the flag.
 */
export function useGhostMode({
    isGhostMode,
    setIsGhostMode,
    state,
    rows,
    cols,
    storageKey,
    toggleInfo,
}: UseGhostModeOptions) {
    const [ghostMoves, setGhostMoves] = useState<Map<string, CellState>>(
        new Map(),
    );

    // Persistence for ghost moves
    useGamePersistence<Map<string, CellState>>({
        storageKey,
        rows,
        cols,
        state: ghostMoves,
        onRestore: (saved: Map<string, CellState>) => {
            setGhostMoves(saved);
        },
        serialize: (m: Map<string, CellState>) => [...m.entries()],
        deserialize: (saved: unknown) =>
            new Map(saved as [string, CellState][]),
    });

    // Reset ghost moves when puzzle changes
    const lastPuzzleRef = useRef<string>('');
    useEffect(() => {
        const puzzleId = JSON.stringify(state.numbers);
        if (lastPuzzleRef.current && lastPuzzleRef.current !== puzzleId) {
            setGhostMoves(new Map());
        }
        lastPuzzleRef.current = puzzleId;
    }, [state.numbers, state.rows, state.cols]);

    const handleGhostMove = useCallback((pos: string, val?: CellState) => {
        setGhostMoves(prev => {
            const next = new Map(prev);
            if (val === undefined) next.delete(pos);
            else next.set(pos, val);
            return next;
        });
    }, []);

    const handleGhostCopy = useCallback(() => {
        const newMoves = new Map<string, CellState>();
        state.grid.forEach((row: CellState[], r: number) => {
            row.forEach((cell: CellState, c: number) => {
                if (cell !== EMPTY) {
                    newMoves.set(getPosKey(r, c), cell);
                }
            });
        });
        setGhostMoves(newMoves);
    }, [state.grid]);

    const handleGhostClear = useCallback(() => {
        setGhostMoves(new Map());
    }, []);

    const handleGhostClose = useCallback(() => {
        setIsGhostMode(false);
    }, [setIsGhostMode]);

    const handleBoxClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    // Use a responsive override to fully clear GamePageLayout's responsive
    // base padding ({ xs: '30px', sm: '36px' }) when in ghost mode.
    // A plain `padding: 0` does not override the `sm` media query.
    const boardSx = useMemo(
        () => (isGhostMode ? { padding: { xs: 0, sm: 0 } } : undefined),
        [isGhostMode],
    );

    const handleOpenCalculator = useCallback(() => {
        toggleInfo();
        setIsGhostMode(true);
    }, [toggleInfo, setIsGhostMode]);

    return {
        ghostMoves,
        boardSx,
        handleGhostMove,
        handleGhostCopy,
        handleGhostClear,
        handleGhostClose,
        handleBoxClick,
        handleOpenCalculator,
    } as const;
}
