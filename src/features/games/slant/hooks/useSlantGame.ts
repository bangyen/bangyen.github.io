import React, { useEffect, useCallback, useRef } from 'react';

import { useDimensionRegeneration } from './useDimensionRegeneration';
import { useGhostMode } from './useGhostMode';
import { GAME_CONSTANTS } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import { getSlantGameConfig } from '../config';
import { STORAGE_KEYS } from '../config/constants';
import type { SlantAction, SlantState } from '../types';
import { useGenerationWorker } from './useGenerationWorker';
import { useSlantProps } from './useSlantProps';
import { getInitialState, handleBoard } from '../utils/boardHandlers';
import {
    serializeSlantState,
    isSavedSlantState,
    deserializeSlantState,
    persistSlantState,
} from '../utils/persistence';

import { createCellIndex } from '@/features/games/types';
import { useDisclosure, useMobile } from '@/hooks';

/**
 * Orchestrates all Slant-specific game logic: worker-based puzzle
 * generation, ghost mode, drag interaction, cell prop factories,
 * and dimension-change detection.
 *
 * Extracted from Slant.tsx so the page component is pure JSX
 * composition, mirroring the LightsOut page pattern.
 */
export function useSlantGame() {
    const mobile = useMobile('sm');
    const [isGhostMode, setIsGhostMode] = React.useState(false);
    const { isOpen: infoOpen, toggle: toggleInfo } = useDisclosure();

    // Refs kept in sync with useBaseGame output, shared with the worker hook.
    const dispatchRef = useRef<React.Dispatch<
        SlantAction | { type: 'hydrate'; state: SlantState }
    > | null>(null);
    const dimsRef = useRef({ rows: 0, cols: 0 });

    const handleStaleResult = useCallback(
        (staleState: SlantState, r: number, c: number) => {
            if (isGhostMode) return;
            persistSlantState(staleState, r, c);
        },
        [isGhostMode],
    );

    const {
        generating,
        requestGeneration,
        handleNextAsync,
        prefetch,
        cancelGeneration,
    } = useGenerationWorker({
        getInitialState,
        dispatchRef,
        dimsRef,
        onStaleResult: handleStaleResult,
    });

    const { rows, cols, state, dispatch, size, controlsProps } = useBaseGame<
        SlantState,
        SlantAction
    >({
        ...getSlantGameConfig(mobile),
        logic: {
            reducer: handleBoard,
            getInitialState: (rows: number, cols: number) =>
                getInitialState(rows, cols),
            onNext: handleNextAsync,
            isSolved: (s: SlantState) => s.solved,
            manualResize: true,
            persistence: {
                enabled: !isGhostMode,
                serialize: serializeSlantState,
                deserialize: (saved: unknown) => {
                    if (!isSavedSlantState(saved)) {
                        throw new Error(
                            `Corrupt Slant state in localStorage: expected a valid SavedSlantState object but received ${JSON.stringify(saved).slice(0, 100)}`,
                        );
                    }
                    return deserializeSlantState(saved);
                },
            },
        },
    });

    // Keep refs in sync with latest values from useBaseGame.
    dispatchRef.current = dispatch;
    dimsRef.current = { rows, cols };

    // Ghost mode state and handlers.
    const {
        ghostMoves,
        boardSx,
        handleGhostMove,
        handleGhostCopy,
        handleGhostClear,
        handleGhostClose,
        handleBoxClick,
        handleOpenCalculator,
    } = useGhostMode({
        isGhostMode,
        setIsGhostMode,
        state,
        rows,
        cols,
        storageKey: STORAGE_KEYS.GHOST_MOVES,
        toggleInfo,
    });

    useDimensionRegeneration({
        rows,
        cols,
        isGhostMode,
        requestGeneration,
        cancelGeneration,
    });

    // Prefetch the next puzzle as soon as the current one is solved so
    // generation overlaps with the win animation instead of waiting.
    useEffect(() => {
        if (state.solved && !isGhostMode) {
            prefetch(rows, cols);
        }
    }, [state.solved, isGhostMode, rows, cols, prefetch]);

    const { getDragProps } = useDrag({
        onToggle: (r: number, c: number, isRightClick: boolean) => {
            dispatch({
                type: 'toggle',
                row: createCellIndex(r),
                col: createCellIndex(c),
                reverse: isRightClick,
            });
        },
        checkEnabled: () => !state.solved,
        touchTimeout: GAME_CONSTANTS.timing.touchHoldDelay,
    });

    return useSlantProps({
        game: {
            state,
            rows,
            cols,
            size,
            mobile,
            isGhostMode,
            generating,
            handleNextAsync,
        },
        ghost: {
            ghostMoves,
            handleGhostMove,
            handleGhostCopy,
            handleGhostClear,
            handleGhostClose,
            handleBoxClick,
            handleOpenCalculator,
            boardSx,
        },
        info: { infoOpen, toggleInfo },
        controls: controlsProps,
        getDragProps,
    });
}
