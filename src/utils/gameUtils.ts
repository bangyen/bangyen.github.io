import { useMemo } from 'react';

/**
 * Generates a consistent position key for game grid cells.
 *
 * @param row - Row index (0-based)
 * @param col - Column index (0-based)
 * @returns String key in format "row,col"
 *
 * @example
 * ```ts
 * const key = getPosKey(2, 3); // "2,3"
 * ```
 */
export function getPosKey(row: number, col: number): string {
    return `${row.toString()},${col.toString()}`;
}

/**
 * Base state properties common to all grid-based games.
 */
export interface BaseGameState {
    /** Number of rows in the game grid */
    rows: number;
    /** Number of columns in the game grid */
    cols: number;
}

/**
 * Standard actions handled by the base game reducer.
 *
 * - `resize`: Change grid dimensions
 * - `new`/`next`: Generate new puzzle with current dimensions
 * - `reset`: Reset to initial state
 * - `restore`/`hydrate`: Load saved state
 */
export type BaseGameAction<S> =
    | {
          type: 'resize';
          rows?: number;
          cols?: number;
          newRows?: number;
          newCols?: number;
      }
    | { type: 'new' | 'next' | 'reset' }
    | { type: 'restore' | 'hydrate'; state: S };

/**
 * Creates a standardized game reducer with common handlers.
 *
 * Provides built-in handling for:
 * - Grid resizing
 * - New puzzle generation
 * - State restoration/hydration
 * - Custom game-specific actions via customHandler
 *
 * @template S - Game state type (must extend BaseGameState)
 * @template A - Custom action type
 *
 * @param config - Configuration object
 * @param config.getInitialState - Function to generate initial state for given dimensions
 * @param config.customHandler - Optional handler for game-specific actions
 * @returns Reducer function compatible with useReducer
 *
 * @example
 * ```tsx
 * interface MyGameState extends BaseGameState {
 *   board: number[][];
 *   moves: number;
 * }
 *
 * type MyGameAction =
 *   | { type: 'move'; row: number; col: number }
 *   | BaseGameAction<MyGameState>;
 *
 * const reducer = createGameReducer<MyGameState, MyGameAction>({
 *   getInitialState: (rows, cols) => ({
 *     rows,
 *     cols,
 *     board: generateBoard(rows, cols),
 *     moves: 0,
 *   }),
 *   customHandler: (state, action) => {
 *     if (action.type === 'move') {
 *       return { ...state, moves: state.moves + 1 };
 *     }
 *     return state;
 *   },
 * });
 * ```
 */
export function createGameReducer<
    S extends BaseGameState,
    A extends { type: string },
>(config: {
    getInitialState: (rows: number, cols: number) => S;
    customHandler?: (state: S, action: A | BaseGameAction<S>) => S;
}) {
    return (state: S, action: A | BaseGameAction<S>): S => {
        if (config.customHandler) {
            // First try custom handler
            const next = config.customHandler(state, action);
            if (next !== state) return next;
        }

        switch (action.type) {
            case 'resize': {
                // Type guard for BaseGameAction 'resize'
                if (
                    'newRows' in action ||
                    'rows' in action ||
                    'cols' in action
                ) {
                    const r = action.newRows ?? action.rows ?? state.rows;
                    const c = action.newCols ?? action.cols ?? state.cols;
                    if (r === state.rows && c === state.cols) return state;
                    return config.getInitialState(r, c);
                }
                return state;
            }
            case 'new':
            case 'next': {
                return config.getInitialState(state.rows, state.cols);
            }
            case 'restore':
            case 'hydrate': {
                if ('state' in action) {
                    return action.state;
                }
                return state;
            }
            case 'reset': {
                return config.getInitialState(state.rows, state.cols);
            }
            default: {
                return state;
            }
        }
    };
}

/**
 * Common prop types for cell renderers in grid-based games.
 */
export interface CellRenderProps {
    /** Row index of the cell */
    row: number;
    /** Column index of the cell */
    col: number;
    /** Additional props specific to the game */
    [key: string]: unknown;
}

/**
 * Factory function that creates props for a cell at given position.
 *
 * @template R - Type of props object returned
 */
export type CellFactory<R = Record<string, unknown>> = (
    row: number,
    col: number,
) => R;

/**
 * Memoizes a cell factory function to prevent unnecessary re-renders.
 *
 * Useful for optimizing grid rendering when cell props depend on:
 * - Drag-and-drop handlers
 * - Game state
 * - Other dynamic dependencies
 *
 * @template T - Tuple type of additional dependencies
 * @template P - Type of drag props
 * @template R - Type of cell props returned by factory
 *
 * @param factory - Function that creates the cell factory
 * @param getDragProps - Function to get drag props for a position
 * @param dependencies - Array of dependencies to trigger re-memoization
 * @returns Memoized cell factory function
 *
 * @example
 * ```tsx
 * const cellFactory = useCellFactory(
 *   (getDragProps, board, onCellClick) => (row, col) => ({
 *     ...getDragProps(getPosKey(row, col)),
 *     value: board[row][col],
 *     onClick: () => onCellClick(row, col),
 *   }),
 *   getDragProps,
 *   [board, onCellClick]
 * );
 *
 * // Use in render
 * const cellProps = cellFactory(2, 3);
 * ```
 */
export function useCellFactory<T extends unknown[], P, R>(
    factory: (getDragProps: (pos: string) => P, ...args: T) => CellFactory<R>,
    getDragProps: (pos: string) => P,
    dependencies: T,
): CellFactory<R> {
    return useMemo(
        () => factory(getDragProps, ...dependencies),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- dependencies are intentionally spread into the dep array
        [factory, getDragProps, ...dependencies],
    );
}
