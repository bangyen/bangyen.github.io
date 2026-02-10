vi.mock('lights-out-wasm', () => ({
    __esModule: true,
    default: vi.fn().mockResolvedValue(undefined),
    invert_matrix: () => {
        throw new Error('Wasm not mocked');
    },
}));

import {
    getGrid,
    flipAdj,
    handleBoard,
    getNextMove,
    BoardAction,
} from '../utils/boardHandlers';

import { createGridSize, createCellIndex } from '@/utils/types';

// Helper to access bitmask grid
function getBit(grid: number[], r: number, c: number): number {
    return (grid[r]! >> c) & 1;
}

describe('boardHandlers', () => {
    describe('getGrid', () => {
        it('should create a grid of correct size initialized to 0', () => {
            const rows = 3;
            const cols = 4;
            const grid = getGrid(rows, cols);

            expect(grid.length).toBe(rows);
            // Each row should be 0
            grid.forEach(row => {
                expect(row).toBe(0);
            });
        });
    });

    describe('flipAdj', () => {
        it('should flip the target cell and adjacent neighbors', () => {
            const rows = 3;
            const cols = 3;
            const grid = getGrid(rows, cols);
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
            const grid = getGrid(rows, cols);
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
            grid: getGrid(3, 3),
            score: 0,
            rows: createGridSize(3),
            cols: createGridSize(3),
            initialized: false,
        };

        it('should handle adjacent action', () => {
            const action: BoardAction = {
                type: 'adjacent',
                row: createCellIndex(1),
                col: createCellIndex(1),
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
            const grid = getGrid(3, 3);
            const moves = getNextMove(grid, 3, 3);
            // Might return null or empty array depending on implementation
            expect(moves).toBeNull();
        });

        it('should chase lights down', () => {
            // Light at top-left
            const grid = getGrid(3, 3);
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
            const grid2 = getGrid(2, 2);
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
    });

    describe('handleBoard - Win Condition', () => {
        it('should increment score and randomize on next action', () => {
            const state = {
                grid: getGrid(3, 3),
                score: 0,
                rows: createGridSize(3),
                cols: createGridSize(3),
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
                grid: getGrid(3, 3),
                score: 0,
                rows: createGridSize(3),
                cols: createGridSize(3),
                auto: false,
                initialized: true,
            };

            const moves = [
                { row: createCellIndex(0), col: createCellIndex(0) },
                { row: createCellIndex(0), col: createCellIndex(1) },
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
});
