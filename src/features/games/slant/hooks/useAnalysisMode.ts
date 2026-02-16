import type React from 'react';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

import { useGamePersistence } from '../../hooks/useGamePersistence';
import type { SlantState, CellState } from '../types';
import { EMPTY } from '../types';

import { getPosKey } from '@/utils/gameUtils';

interface UseAnalysisModeOptions {
    /** Whether analysis mode is currently active (owned by the caller). */
    isAnalysisMode: boolean;
    /** Setter for the analysis-mode flag (owned by the caller). */
    setIsAnalysisMode: React.Dispatch<React.SetStateAction<boolean>>;
    /** Full Slant game state (grid, numbers, etc.). */
    state: SlantState;
    /** Current grid row count. */
    rows: number;
    /** Current grid column count. */
    cols: number;
    /** localStorage key for persisting analysis moves. */
    storageKey: string;
    /** Toggle the "How to Play" info modal. */
    toggleInfo: () => void;
}

/**
 * Encapsulates analysis-mode move state and handlers for the Slant puzzle.
 *
 * Analysis mode lets the player sketch tentative moves on a separate overlay
 * without affecting the real board.  This hook owns the moves map,
 * persistence, puzzle-change resets, and every callback the UI needs,
 * keeping the main page component focused on game logic.
 *
 * The `isAnalysisMode` / `setIsAnalysisMode` pair is accepted from the caller
 * because several hooks that run *before* this one (e.g. `useBaseGame`
 * persistence, stale-result handler) also need the flag.
 */
export function useAnalysisMode({
    isAnalysisMode,
    setIsAnalysisMode,
    state,
    rows,
    cols,
    storageKey,
    toggleInfo,
}: UseAnalysisModeOptions) {
    const [analysisMoves, setAnalysisMoves] = useState<Map<string, CellState>>(
        new Map(),
    );

    // Persistence for analysis moves
    useGamePersistence<Map<string, CellState>>({
        storageKey,
        rows,
        cols,
        state: analysisMoves,
        onRestore: (saved: Map<string, CellState>) => {
            setAnalysisMoves(saved);
        },
        serialize: (m: Map<string, CellState>) => [...m.entries()],
        deserialize: (saved: unknown) =>
            new Map(saved as [string, CellState][]),
    });

    // Reset analysis moves when puzzle changes
    const lastPuzzleRef = useRef<string>('');
    useEffect(() => {
        const puzzleId = JSON.stringify(state.numbers);
        if (lastPuzzleRef.current && lastPuzzleRef.current !== puzzleId) {
            setAnalysisMoves(new Map());
        }
        lastPuzzleRef.current = puzzleId;
    }, [state.numbers, state.rows, state.cols]);

    const handleAnalysisMove = useCallback((pos: string, val?: CellState) => {
        setAnalysisMoves(prev => {
            const next = new Map(prev);
            if (val === undefined) next.delete(pos);
            else next.set(pos, val);
            return next;
        });
    }, []);

    const handleAnalysisCopy = useCallback(() => {
        const newMoves = new Map<string, CellState>();
        state.grid.forEach((row: CellState[], r: number) => {
            row.forEach((cell: CellState, c: number) => {
                if (cell !== EMPTY) {
                    newMoves.set(getPosKey(r, c), cell);
                }
            });
        });
        setAnalysisMoves(newMoves);
    }, [state.grid]);

    const handleAnalysisClear = useCallback(() => {
        setAnalysisMoves(new Map());
    }, []);

    const handleAnalysisClose = useCallback(() => {
        setIsAnalysisMode(false);
    }, [setIsAnalysisMode]);

    const handleBoxClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    // Use a responsive override to fully clear GamePageLayout's responsive
    // base padding ({ xs: '30px', sm: '36px' }) when in analysis mode.
    // A plain `padding: 0` does not override the `sm` media query.
    const boardSx = useMemo(
        () => (isAnalysisMode ? { padding: { xs: 0, sm: 0 } } : undefined),
        [isAnalysisMode],
    );

    const handleOpenAnalysis = useCallback(() => {
        toggleInfo();
        setIsAnalysisMode(true);
    }, [toggleInfo, setIsAnalysisMode]);

    return {
        analysisMoves,
        boardSx,
        handleAnalysisMove,
        handleAnalysisCopy,
        handleAnalysisClear,
        handleAnalysisClose,
        handleBoxClick,
        handleOpenAnalysis,
    } as const;
}
