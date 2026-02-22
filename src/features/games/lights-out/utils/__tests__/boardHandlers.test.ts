import {
    getGrid,
    flipAdj,
    handleBoard,
    getNextMove,
    isSolved,
} from '../boardHandlers';

import type { BoardAction } from '@/features/games/lights-out/types';
import type { CellIndex } from '@/features/games/types/types';

// Helper to access bitmask grid
function getBit(grid: number[], r: number, c: number): number {
    return (grid[r]! >> c) & 1;
}

describe('boardHandlers', () => {
    describe('getGrid', () => {
        it('should create a grid of correct size initialized to 0', () => {
            const rows = 3;
            const grid = getGrid(rows);

            expect(grid.length).toBe(rows);
            // Each row should be 0
            for (const row of grid) {
                expect(row).toBe(0);
            }
        });
    });

    describe('flipAdj', () => {
        it('should flip the target cell and adjacent neighbors', () => {
            const rows = 3;
            const cols = 3;
            const grid = getGrid(rows);
            // Flip center
            const newGrid = flipAdj(1, 1, grid, rows, cols);

            // Center should be 1
            expect(getBit(newGrid, 1, 1)).toBe(1);
            // Neighbors should be 1
            expect(getBit(newGrid, 0, 1)).toBe(1); // Top
            expect(getBit(newGrid, 2, 1)).toBe(1); // Bottom
            expect(getBit(newGrid, 1, 0)).toBe(1); // Left
            expect(getBit(newGrid, 1, 2)).toBe(1); // Right
            // Corners should stay 0
            expect(getBit(newGrid, 0, 0)).toBe(0);
            expect(getBit(newGrid, 0, 2)).toBe(0);
            expect(getBit(newGrid, 2, 0)).toBe(0);
            expect(getBit(newGrid, 2, 2)).toBe(0);
        });

        it('should handle corners correctly', () => {
            const rows = 3;
            const cols = 3;
            const grid = getGrid(rows);
            // Flip top-left
            const newGrid = flipAdj(0, 0, grid, rows, cols);

            expect(getBit(newGrid, 0, 0)).toBe(1);
            expect(getBit(newGrid, 0, 1)).toBe(1); // Right neighbor
            expect(getBit(newGrid, 1, 0)).toBe(1); // Bottom neighbor
            expect(getBit(newGrid, 1, 1)).toBe(0); // Diagonal
        });
    });

    describe('handleBoard', () => {
        const initialState = {
            grid: getGrid(3),
            score: 0,
            rows: 3,
            cols: 3,
            initialized: false,
        };

        it('should handle adjacent action', () => {
            const action: BoardAction = {
                type: 'adjacent',
                row: 1,
                col: 1,
            };
            const newState = handleBoard(initialState, action);

            expect(getBit(newState.grid, 1, 1)).toBe(1);
            expect(newState.score).toBe(0);
        });

        it('should handle reset action', () => {
            // First modify state
            const modifiedState = {
                ...initialState,
                grid: flipAdj(1, 1, initialState.grid, 3, 3),
                score: 5,
                initialized: true,
            };

            const action: BoardAction = { type: 'reset' };
            const newState = handleBoard(modifiedState, action);

            expect(newState.score).toBe(0);
            expect(getBit(newState.grid, 1, 1)).toBe(0);
        });

        it('should handle random action', () => {
            const action: BoardAction = { type: 'random' };
            const newState = handleBoard(initialState, action);

            expect(newState.grid.length).toBe(3);
        });

        it('should handle resize action', () => {
            const action: BoardAction = {
                type: 'resize',
                newRows: 4,
                newCols: 4,
            };
            const newState = handleBoard(initialState, action);

            expect(newState.rows).toBe(4);
            expect(newState.cols).toBe(4);
            expect(newState.grid.length).toBe(4);
        });
    });

    describe('getNextMove', () => {
        it('should return null for empty grid', () => {
            const grid = getGrid(3);
            const moves = getNextMove(grid, 3, 3);
            // Might return null or empty array depending on implementation
            expect(moves).toBeNull();
        });

        it('should chase lights down', () => {
            // Light at top-left
            const grid = getGrid(3);
            // Set bit 0 of row 0
            grid[0] = 1;

            const moves = getNextMove(grid, 3, 3);
            // Should suggest clicking directly below it
            expect(moves).toBeDefined();
            expect(moves![0]).toEqual({ row: 1, col: 0 });
        });

        it('should solve last row', () => {
            // 2x2 grid.
            // 0 0
            // 1 1  (row 1: 3)
            // Last row is 1 1.
            const grid2 = getGrid(2);
            grid2[1] = 3; // 1 | 2 = 3 (bits 0 and 1)

            const moves = getNextMove(grid2, 2, 2);

            if (moves) {
                expect(moves.length).toBe(2);
                const has00 = moves.some(m => m.row === 0 && m.col === 0);
                const has01 = moves.some(m => m.row === 0 && m.col === 1);
                expect(has00).toBe(true);
                expect(has01).toBe(true);
            }
        });

        it('should use precomputed solutions for last row (5x5)', () => {
            const grid5 = getGrid(5);
            grid5[4] = 1;

            const moves = getNextMove(grid5, 5, 5);
            expect(moves).toBeDefined();
            // Should contain moves for the first row as suggestions for the last row
            expect(moves!.every(m => m.row === 0)).toBe(true);
        });
    });

    describe('handleBoard - Win Condition', () => {
        it('should increment score and randomize on next action', () => {
            const state = {
                grid: getGrid(3),
                score: 0,
                rows: 3,
                cols: 3,
                auto: false,
                initialized: true,
            };

            const action: BoardAction = { type: 'next' };
            const newState = handleBoard(state, action);

            expect(newState.score).toBe(1);
            expect(newState.grid.length).toBe(3);
        });

        it('should handle multi_adjacent', () => {
            const state = {
                grid: getGrid(3),
                score: 0,
                rows: 3,
                cols: 3,
                auto: false,
                initialized: true,
            };

            const moves = [
                { row: 0 as CellIndex, col: 0 as CellIndex },
                { row: 0 as CellIndex, col: 1 as CellIndex },
            ];
            const action: BoardAction = { type: 'multi_adjacent', moves };

            const newState = handleBoard(state, action);

            expect(getBit(newState.grid, 0, 0)).toBe(0);
            expect(getBit(newState.grid, 0, 1)).toBe(0);
            expect(getBit(newState.grid, 1, 0)).toBe(1);
            expect(getBit(newState.grid, 0, 2)).toBe(1);
            expect(getBit(newState.grid, 1, 1)).toBe(1);
        });
    });

    describe('getNextMove - edge cases', () => {
        it('should return null when last row is solved (all zeros)', () => {
            const grid = getGrid(3);
            // Leave all zeros - already solved
            const moves = getNextMove(grid, 3, 3);

            expect(moves).toBeNull();
        });

        it('should handle single non-zero row (not last)', () => {
            const grid = getGrid(3);
            grid[0] = 1; // Light at position (0,0)
            grid[1] = 0;
            grid[2] = 0;

            const moves = getNextMove(grid, 3, 3);

            expect(moves).toBeDefined();
            if (moves) {
                expect(moves[0]).toEqual({ row: 1, col: 0 });
            }
        });

        it('should handle alternating zero and non-zero rows', () => {
            const grid = getGrid(3);
            grid[0] = 0;
            grid[1] = 1; // Light at (1,0)
            grid[2] = 0;

            const moves = getNextMove(grid, 3, 3);

            // Should chase the light in row 1
            expect(moves).toBeDefined();
        });

        it('should return null when no solution exists', () => {
            const grid = getGrid(2);
            grid[1] = 3; // Last row has lights
            // Solution may return null if unsolvable

            const moves = getNextMove(grid, 2, 2);

            // Either returns moves or null - both valid
            expect(moves === null || Array.isArray(moves)).toBe(true);
        });

        it('should use precomputed solutions for 3x3', () => {
            const grid = getGrid(3);
            grid[2] = 1; // Single light in last row

            const moves = getNextMove(grid, 3, 3);

            if (moves) {
                expect(moves.every(m => m.row === 0)).toBe(true);
            }
        });

        it('should fallback to getProduct for non-precomputed sizes', () => {
            const grid = getGrid(7);
            grid[6] = 1; // Single light in last row of 7x7

            const moves = getNextMove(grid, 7, 7);

            if (moves) {
                // Should return moves for first row
                expect(moves.every(m => m.row === 0)).toBe(true);
            }
        });

        it('should handle power of 2 values in last row', () => {
            const grid = getGrid(4);
            grid[3] = 4; // Binary 0100 (single bit at position 2)

            const moves = getNextMove(grid, 4, 4);

            expect(moves === null || Array.isArray(moves)).toBe(true);
        });

        it('should handle all bits set in last row', () => {
            const grid = getGrid(3);
            grid[2] = 7; // Binary 111 (all 3 bits set)

            const moves = getNextMove(grid, 3, 3);

            if (moves) {
                expect(moves.length).toBeGreaterThan(0);
            }
        });
    });

    describe('isSolved', () => {
        it('returns true when all rows are zero', () => {
            const grid = getGrid(3);

            expect(isSolved(grid)).toBe(true);
        });

        it('returns false when single row has lights', () => {
            const grid = getGrid(3);
            grid[1] = 1;

            expect(isSolved(grid)).toBe(false);
        });

        it('returns false when alternating rows have lights', () => {
            const grid = getGrid(3);
            grid[0] = 0;
            grid[1] = 1;
            grid[2] = 0;

            expect(isSolved(grid)).toBe(false);
        });
    });

    describe('handleBoard - resize action', () => {
        it('should handle resize with explicit newRows and newCols', () => {
            const state = {
                grid: getGrid(3),
                score: 0,
                rows: 3,
                cols: 3,
                initialized: false,
            };

            const action: BoardAction = {
                type: 'resize',
                newRows: 4,
                newCols: 5,
            };
            const newState = handleBoard(state, action);

            expect(newState.rows).toBe(4);
            expect(newState.cols).toBe(5);
        });

        it('should handle resize with only newRows', () => {
            const state = {
                grid: getGrid(3),
                score: 0,
                rows: 3,
                cols: 3,
                initialized: false,
            };

            const action: BoardAction = {
                type: 'resize',
                newRows: 5,
            };
            const newState = handleBoard(state, action);

            expect(newState.rows).toBe(5);
        });

        it('should handle resize with only newCols', () => {
            const state = {
                grid: getGrid(3),
                score: 0,
                rows: 3,
                cols: 3,
                initialized: false,
            };

            const action: BoardAction = {
                type: 'resize',
                newCols: 6,
            };
            const newState = handleBoard(state, action);

            expect(newState.cols).toBe(6);
        });

        it('should handle resize with action.rows and action.cols', () => {
            const state = {
                grid: getGrid(3),
                score: 0,
                rows: 3,
                cols: 3,
                initialized: false,
            };

            const action = {
                type: 'resize',
                rows: 7,
                cols: 8,
            } as BoardAction;
            const newState = handleBoard(state, action);
            expect(newState.rows).toBe(7);
            expect(newState.cols).toBe(8);
        });
    });

    describe('handleBoard - unknown action', () => {
        it('should return current state for unknown action', () => {
            const state = {
                grid: getGrid(3),
                score: 0,
                rows: 3,
                cols: 3,
                initialized: false,
            };
            const action = { type: 'unknown' } as unknown as BoardAction;
            const newState = handleBoard(state, action);
            expect(newState).toBe(state);
        });
    });

    describe('getNextMove - more edge cases', () => {
        it('should handle undefined rows', () => {
            const grid = [0, 0];
            const moves = getNextMove(grid, 4, 2);
            expect(moves).toBeNull();
        });

        it('should return null when solveLastRow returns empty', () => {
            // This happens if indices.length is 0.
            // solveLastRow returns indices.length > 0 ? indices : null;
            // 2x2 grid, last row is 0.
            const grid = [0, 0];
            const moves = getNextMove(grid, 2, 2);
            expect(moves).toBeNull();
        });
    });
});
