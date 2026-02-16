import React, {
    useEffect,
    useMemo,
    useCallback,
    useReducer,
    useRef,
} from 'react';

import { useMobile } from '../../../../hooks';
import { GAME_CONSTANTS } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import { getSlantGameConfig } from '../config';
import {
    NUMBER_SIZE_RATIO,
    STORAGE_KEYS,
    LAYOUT_CONSTANTS,
} from '../constants';
import { useDimensionRegeneration } from './useDimensionRegeneration';
import { useGenerationWorker } from './useGenerationWorker';
import { useGhostMode } from './useGhostMode';
import type { SlantAction, SlantState } from '../types';
import { getInitialState, handleBoard } from '../utils/boardHandlers';
import {
    serializeSlantState,
    isSavedSlantState,
    deserializeSlantState,
    persistSlantState,
} from '../utils/persistence';
import { getBackProps, getFrontProps } from '../utils/renderers';

import { useCellFactory } from '@/utils/gameUtils';
import { createCellIndex } from '@/utils/types';

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
    const [infoOpen, toggleInfo] = useReducer((v: boolean) => !v, false);

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
                        throw new Error('Corrupt Slant state');
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

    const numberSize = size * NUMBER_SIZE_RATIO;

    const backProps = useCellFactory(getBackProps, getDragProps, [state, size]);

    const frontProps = useMemo(
        () => getFrontProps(state, numberSize),
        [state, numberSize],
    );

    const contentSx = useMemo(
        () => ({
            px: mobile ? '1rem' : '2rem',
            pt: mobile ? '1rem' : '2rem',
        }),
        [mobile],
    );

    const dimensionsMismatch = rows !== state.rows || cols !== state.cols;

    return {
        boardProps: {
            isGhostMode,
            generating,
            dimensionsMismatch,
            rows,
            cols,
            state,
            size,
            ghostMoves,
            onGhostMove: handleGhostMove,
            onGhostCopy: handleGhostCopy,
            onGhostClear: handleGhostClear,
            onGhostClose: handleGhostClose,
            cellProps: backProps,
            overlayProps: frontProps,
        },
        controlsProps: {
            ...controlsProps,
            onRefresh: handleNextAsync,
            disabled: generating,
            onOpenInfo: toggleInfo,
            hidden: isGhostMode,
        },
        layoutProps: {
            boardSx,
            contentSx,
            iconSizeRatio: LAYOUT_CONSTANTS.ICON_SIZE_RATIO,
        },
        infoProps: {
            open: infoOpen,
            toggleOpen: toggleInfo,
            handleOpenCalculator,
            handleBoxClick,
        },
        trophyProps: {
            show: !isGhostMode && state.solved,
            onReset: handleNextAsync,
            size,
            iconSizeRatio: LAYOUT_CONSTANTS.ICON_SIZE_RATIO,
        },
    };
}
