import { useMemo } from 'react';

/**
 * Generates a consistent position key for game grid cells.
 */
export function getPosKey(row: number, col: number): string {
    return `${row.toString()},${col.toString()}`;
}

/**
 * Base state properties common to all grid-based games.
 */
export interface BaseGameState {
    rows: number;
    cols: number;
}

/**
 * Standard actions handled by the base game reducer.
 */
export type BaseGameAction<S> =
    | {
          type: 'resize';
          rows?: number;
          cols?: number;
          newRows?: number;
          newCols?: number;
      }
    | { type: 'new' | 'next' }
    | { type: 'restore' | 'hydrate'; state: S }
    | { type: 'reset' };

/**
 * Standardizes game reducer logic with common handlers for resize, new puzzle, and hydration.
 */
export function createGameReducer<
    S extends BaseGameState,
    A extends { type: string },
>(config: {
    getInitialState: (rows: number, cols: number) => S;
    customHandler?: (state: S, action: A) => S;
}) {
    return (state: S, action: A | BaseGameAction<S>): S => {
        if (config.customHandler) {
            const next = config.customHandler(state, action as A);
            if (next !== state) return next;
        }

        switch (action.type) {
            case 'resize': {
                const a = action as Extract<
                    BaseGameAction<S>,
                    { type: 'resize' }
                >;
                const r = a.newRows ?? a.rows ?? state.rows;
                const c = a.newCols ?? a.cols ?? state.cols;
                return config.getInitialState(r, c);
            }
            case 'new':
            case 'next':
                return config.getInitialState(state.rows, state.cols);
            case 'restore':
            case 'hydrate': {
                const a = action as Extract<
                    BaseGameAction<S>,
                    { type: 'restore' | 'hydrate' }
                >;
                return a.state;
            }
            case 'reset':
                return config.getInitialState(state.rows, state.cols);
            default:
                return state;
        }
    };
}

/**
 * Common prop types for cell renderers.
 */
export interface CellRenderProps {
    row: number;
    col: number;
    [key: string]: unknown;
}

export type CellFactory<R = Record<string, unknown>> = (
    row: number,
    col: number
) => R;

/**
 * Helper to memoize a cell factory that depends on some state and drag props.
 */
export function useCellFactory<T extends unknown[], P, R>(
    factory: (getDragProps: (pos: string) => P, ...args: T) => CellFactory<R>,
    getDragProps: (pos: string) => P,
    dependencies: T
): CellFactory<R> {
    return useMemo(
        () => factory(getDragProps, ...dependencies),
        [factory, getDragProps, dependencies]
    );
}
