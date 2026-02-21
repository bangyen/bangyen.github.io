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
 * - `new`: Generate new puzzle with current dimensions
 * - `hydrate`: Load saved state
 */
export type BaseGameAction<S> =
    | {
          type: 'resize';
          rows?: number;
          cols?: number;
          newRows?: number;
          newCols?: number;
      }
    | { type: 'new' }
    | { type: 'hydrate'; state: S };

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
 * @param config.customHandler - Optional handler for game-specific actions.
 *   Return the new state to handle the action, or `null` to fall through
 *   to the base reducer.  This explicit protocol avoids the fragile
 *   referential-identity check used previously.
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
 *     return null; // fall through to base reducer
 *   },
 * });
 * ```
 */
export function createGameReducer<
    S extends BaseGameState,
    A extends { type: string },
>(config: {
    getInitialState: (rows: number, cols: number) => S;
    customHandler?: (state: S, action: A | BaseGameAction<S>) => S | null;
}) {
    return (state: S, action: A | BaseGameAction<S>): S => {
        if (config.customHandler) {
            const next = config.customHandler(state, action);
            if (next !== null) return next;
        }

        switch (action.type) {
            case 'resize': {
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
            case 'new': {
                return config.getInitialState(state.rows, state.cols);
            }
            case 'hydrate': {
                if ('state' in action) {
                    return action.state;
                }
                return state;
            }
            default: {
                return state;
            }
        }
    };
}
