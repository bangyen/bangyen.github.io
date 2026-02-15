/**
 * Composition hook that wires `useBaseGame` and `useGameInteraction`
 * together, eliminating the repeated plumbing in every game page.
 *
 * Each game provides a `createAction` factory that maps cell coordinates
 * to a dispatch action, and the hook handles the rest.
 */
import type React from 'react';
import { useCallback, useRef } from 'react';

import type { BaseGameConfig } from './useBaseGame';
import { useBaseGame } from './useBaseGame';
import { useGameInteraction } from './useGameInteraction';

import type { BaseGameState, BaseGameAction } from '@/utils/gameUtils';

/**
 * Interaction configuration for `useGamePage`.
 *
 * @template A - The game-specific action type
 */
interface InteractionConfig<A> {
    /**
     * Maps cell coordinates to a dispatch action.
     * Returning `undefined` suppresses the dispatch (e.g. when the game is over).
     */
    createAction: (
        row: number,
        col: number,
        isRightClick: boolean,
    ) => A | undefined;
    /** Touch timeout in milliseconds. */
    touchTimeout: number;
    /** Optional CSS transition for visual feedback. */
    transition?: string;
    /**
     * Override the default check for whether interactions are enabled.
     * Defaults to `() => !solved`.
     */
    checkEnabled?: () => boolean;
}

/**
 * Full configuration for `useGamePage`.
 *
 * Extends the `useBaseGame` config with an `interaction` block
 * for cell drag/click handling.
 */
interface UseGamePageConfig<
    S extends BaseGameState,
    A extends { type: string },
> extends BaseGameConfig<S, A> {
    /** Configuration for cell interaction / drag handling. */
    interaction: InteractionConfig<A>;
}

/**
 * Combines `useBaseGame` (state management) and `useGameInteraction`
 * (cell interactions) into a single hook, returning everything a game
 * page needs to render its board and controls.
 *
 * @template S - Game state type extending BaseGameState
 * @template A - Game-specific action type
 * @returns All values from `useBaseGame` plus `getDragProps` from interaction
 *
 * @example
 * ```tsx
 * const { rows, cols, state, dispatch, size, solved, getDragProps, controlsProps } =
 *   useGamePage<BoardState, BoardAction>({
 *     storageKey: 'lights-out',
 *     pageTitle: 'Lights Out',
 *     reducer: handleBoard,
 *     getInitialState,
 *     isSolved: (s) => s.initialized && isSolved(s.grid),
 *     interaction: {
 *       createAction: (r, c) => ({
 *         type: 'adjacent',
 *         row: createCellIndex(r),
 *         col: createCellIndex(c),
 *       }),
 *       touchTimeout: 500,
 *     },
 *   });
 * ```
 */
export function useGamePage<
    S extends BaseGameState,
    A extends { type: string },
>({ interaction, ...baseConfig }: UseGamePageConfig<S, A>) {
    const baseGame = useBaseGame<S, A>(
        baseConfig as Parameters<typeof useBaseGame<S, A>>[0],
    );

    const { dispatch, solved } = baseGame;

    // Keep createAction in a ref to avoid re-creating the interaction callback
    // when only the action factory changes (e.g. because it captures state).
    const createActionRef = useRef(interaction.createAction);
    createActionRef.current = interaction.createAction;

    const dispatchRef = useRef<React.Dispatch<A | BaseGameAction<S>>>(dispatch);
    dispatchRef.current = dispatch;

    const onToggle = useCallback(
        (r: number, c: number, isRightClick: boolean) => {
            const action = createActionRef.current(r, c, isRightClick);
            if (action !== undefined) {
                dispatchRef.current(action);
            }
        },
        [],
    );

    const defaultCheckEnabled = useCallback(() => !solved, [solved]);

    const { getDragProps } = useGameInteraction({
        onToggle,
        checkEnabled: interaction.checkEnabled ?? defaultCheckEnabled,
        touchTimeout: interaction.touchTimeout,
        transition: interaction.transition,
    });

    return {
        ...baseGame,
        getDragProps,
    };
}
