import {
    getGrid,
    flipAdj,
    handleBoard,
    getNextMove,
    BoardAction,
} from '../boardHandlers';

describe('boardHandlers', () => {
    describe('getGrid', () => {
        it('should create a grid of correct size initialized to 0', () => {
            const rows = 3;
            const cols = 4;
            const grid = getGrid(rows, cols);

            expect(grid.length).toBe(rows);
            expect(grid[0].length).toBe(cols);
            grid.forEach(row => {
                row.forEach(cell => {
                    expect(cell).toBe(0);
                });
            });
        });
    });

    describe('flipAdj', () => {
        it('should flip the target cell and adjacent neighbors', () => {
            const grid = getGrid(3, 3);
            // Flip center
            const newGrid = flipAdj(1, 1, grid);

            // Center should be 1
            expect(newGrid[1][1]).toBe(1);
            // Neighbors should be 1
            expect(newGrid[0][1]).toBe(1); // Top
            expect(newGrid[2][1]).toBe(1); // Bottom
            expect(newGrid[1][0]).toBe(1); // Left
            expect(newGrid[1][2]).toBe(1); // Right
            // Corners should stay 0
            expect(newGrid[0][0]).toBe(0);
            expect(newGrid[0][2]).toBe(0);
            expect(newGrid[2][0]).toBe(0);
            expect(newGrid[2][2]).toBe(0);
        });

        it('should handle corners correctly', () => {
            const grid = getGrid(3, 3);
            // Flip top-left
            const newGrid = flipAdj(0, 0, grid);

            expect(newGrid[0][0]).toBe(1);
            expect(newGrid[0][1]).toBe(1); // Right neighbor
            expect(newGrid[1][0]).toBe(1); // Bottom neighbor
            expect(newGrid[1][1]).toBe(0); // Diagonal
        });
    });

    describe('handleBoard', () => {
        const initialState = {
            grid: getGrid(3, 3),
            score: 0,
            rows: 3,
            cols: 3,
            auto: false,
        };

        it('should handle adjacent action', () => {
            const action: BoardAction = {
                type: 'adjacent',
                row: 1,
                col: 1,
            };
            const newState = handleBoard(initialState, action);

            expect(newState.grid[1][1]).toBe(1);
            expect(newState.score).toBe(0);
        });

        it('should handle reset action', () => {
            // First modify state
            const modifiedState = {
                ...initialState,
                grid: flipAdj(1, 1, initialState.grid),
                score: 5,
                auto: true,
            };

            const action: BoardAction = { type: 'reset' };
            const newState = handleBoard(modifiedState, action);

            expect(newState.score).toBe(0);
            expect(newState.auto).toBe(false);
            expect(newState.grid[1][1]).toBe(0);
        });

        it('should handle random action', () => {
            const action: BoardAction = { type: 'random' };
            const newState = handleBoard(initialState, action);

            // Cannot predict exact grid, but check properties
            expect(newState.grid.length).toBe(3);
            expect(newState.auto).toBe(false);
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
            expect(newState.grid[0].length).toBe(4);
        });

        it('should handle auto action', () => {
            const action: BoardAction = { type: 'auto' };
            const newState = handleBoard(initialState, action);

            expect(newState.auto).toBe(true);
        });
    });

    describe('getNextMove', () => {
        it('should return null for empty grid', () => {
            const grid = getGrid(3, 3);
            const moves = getNextMove(grid);
            expect(moves).toBeNull();
        });

        it('should chase lights down', () => {
            // Light at top-left
            const grid = getGrid(3, 3);
            grid[0][0] = 1;

            const moves = getNextMove(grid);
            // Should suggest clicking directly below it
            expect(moves).toEqual([{ row: 1, col: 0 }]);
        });
    });
});
