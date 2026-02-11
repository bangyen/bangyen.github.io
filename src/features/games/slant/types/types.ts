import { GridSize, CellIndex } from '../../../../utils/types';

/**
 * Cell state in Slant puzzle.
 * - 0: Empty (no slash)
 * - 1: Forward slash (/)
 * - 2: Backward slash (\)
 */
export type CellState = 0 | 1 | 2;

/** Empty cell constant */
export const EMPTY: CellState = 0;

/** Forward slash (/) constant */
export const FORWARD: CellState = 1;

/** Backward slash (\) constant */
export const BACKWARD: CellState = 2;

/**
 * Complete state for Slant puzzle game.
 */
export interface SlantState {
    /** Current grid state (player's progress) */
    grid: CellState[][];
    /** Clue numbers at grid intersections (null = no clue) */
    numbers: (number | null)[][];
    /** Solution grid (for validation) */
    solution: CellState[][];
    /** Number of rows in the grid */
    rows: GridSize;
    /** Number of columns in the grid */
    cols: GridSize;
    /** Whether puzzle is completely solved */
    solved: boolean;
    /** Set of node positions with incorrect clue counts */
    errorNodes: Set<string>;
    /** Set of cell positions that form cycles (invalid loops) */
    cycleCells: Set<string>;
    /** Set of node positions with correct clue counts */
    satisfiedNodes: Set<string>;
}

/**
 * Action for Slant game reducer.
 */
export interface SlantAction {
    /** Action type (currently only 'toggle' supported) */
    type: 'toggle';
    /** Row index of cell to toggle */
    row: CellIndex;
    /** Column index of cell to toggle */
    col: CellIndex;
    /** Whether to cycle in reverse (right-click) */
    reverse?: boolean;
}
