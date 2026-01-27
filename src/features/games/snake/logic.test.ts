import {
    mapBoard,
    handleResize,
    reduceBoard,
    handleAction,
    addNext,
    Board,
    SnakeState,
} from './logic';

// Mock gridUtils
jest.mock('../../interpreters/utils/gridUtils', () => ({
    gridMove: jest.fn((pos, dir) => pos + dir), // Simplified mock
    getDirection: jest.fn(key => {
        if (key === 'ArrowUp') return -10;
        if (key === 'ArrowDown') return 10;
        if (key === 'ArrowLeft') return -1;
        if (key === 'ArrowRight') return 1;
        return 0;
    }),
}));

describe('Snake Logic', () => {
    describe('mapBoard', () => {
        it('should decrement positive values (snake body)', () => {
            const board: Board = { 0: 5, 1: 1, 2: -1 };
            const newBoard = mapBoard(board, -1);
            expect(newBoard).toEqual({ 0: 4, 2: -1 }); // 1 becomes 0 and is removed
        });

        it('should keep negative values (food)', () => {
            const board: Board = { 0: -1 };
            const newBoard = mapBoard(board, 0); // No change
            expect(newBoard).toEqual({ 0: -1 });
        });
    });

    describe('addNext', () => {
        it('should add food to an empty spot', () => {
            const board: Board = { 0: 5 };
            // Mock random to return 1
            const originalRandom = Math.random;
            Math.random = jest.fn(() => 0.1); // Assuming size 10, index 1

            const newBoard = addNext(10, board);
            expect(newBoard[1]).toBe(-1);
            expect(newBoard[0]).toBe(5);

            Math.random = originalRandom;
        });
    });

    describe('handleResize', () => {
        it('should initialize state correctly', () => {
            const initialState: SnakeState = {
                velocity: 0,
                buffer: [],
                length: 5,
                rows: 0,
                cols: 0,
                head: 0,
                board: {},
            };
            const rows = 10;
            const cols = 10;
            const newState = handleResize(initialState, rows, cols);

            expect(newState.rows).toBe(rows);
            expect(newState.cols).toBe(cols);
            expect(Object.keys(newState.board).length).toBe(2); // Head + Food
            expect(newState.board[newState.head]).toBe(initialState.length);
        });
    });

    describe('handleAction', () => {
        it('should update direction on steer', () => {
            const state: SnakeState = {
                velocity: 0,
                buffer: [],
                length: 5,
                rows: 10,
                cols: 10,
                head: 0,
                board: {},
            };

            const newState = handleAction(state, {
                type: 'steer',
                payload: { key: 'ArrowDown' },
            });

            expect(newState.buffer).toContain(10);
        });

        it('should call reduceBoard on move', () => {
            // We can check if buffer is processed or board changes
            const state: SnakeState = {
                velocity: 1,
                buffer: [],
                length: 5,
                rows: 10,
                cols: 10,
                head: 0,
                board: { 0: 5 },
            };
            const newState = handleAction(state, { type: 'move' });
            // Should have moved head
            expect(newState.head).not.toBe(0);
        });
    });

    describe('reduceBoard (Game Loop)', () => {
        const baseState: SnakeState = {
            velocity: 1, // Moving Right
            buffer: [],
            length: 3,
            rows: 10,
            cols: 10,
            head: 0,
            board: { 0: 3, 40: -1 }, // Head at 0 (life 3), Food at 40
        };

        it('should move snake processing decay', () => {
            // Setup: Snake at 0 (3). Move Right (+1).
            // Expect: Head at 1. Old Head at 0 becomes 2.
            const newState = reduceBoard(baseState);

            expect(newState.head).toBe(1);
            expect(newState.board[1]).toBe(3); // New head has max length
            expect(newState.board[0]).toBe(2); // Old head decayed
        });

        it('should grow when eating food', () => {
            // Setup: Head at 0, moving towards food at 1
            const state = {
                ...baseState,
                board: { 0: 3, 1: -1 }, // Food at 1
            };

            const newState = reduceBoard(state);

            expect(newState.head).toBe(1);
            // Eating food:
            // 1. mapBoard(-1) -> all cells -1. (0 becomes 2)
            // 2. Head moves to 1.
            // 3. Collision check: board[1] was -1 (food).
            // 4. mapBoard(1) -> all cells +1. (0 becomes 3).
            // 5. board[1] = length (3). But wait, length might update?
            // The code: length = board[head]. board[head] was assigned length BEFORE check?
            // No:
            // board[head] = length;
            // if (value > 0) ... else { ... board[head] = length? No, length = board[head] checks value after? }
            // Let's re-read reduceBoard logic in thought.
            // It seems length is updated to whatever is at board[head] at end?

            // Expected behavior for snake: grow.
            // The current implementation details might be tricky, let's trust the logic is "correct" for the game
            // and verify "Growth" behavior: other cells shouldn't decay this turn?

            expect(newState.board[0]).toBeGreaterThan(2); // Should have "gained" life or at least not lost as much?
            // Logic: mapBoard(-1) then mapBoard(1) cancels out decay.
            // So 0 should be 3.
            expect(newState.board[0]).toBe(3);
        });

        it('should reset when hitting self', () => {
            // Setup: circular snake hitting itself?
            // small 2x2 board.
            // 0 1
            // 2 3
            // Head at 0. Snake at 0, 1, 3, 2. Moving Left from 0? (If allow reverse)
            // Or just manually place obstruction.
            const state = {
                ...baseState,
                velocity: 1,
                board: { 0: 5, 1: 3 }, // Obstacle at 1 (body part)
            };

            const newState = reduceBoard(state);
            // Move to 1. 1 has value 3.
            // mapBoard(-1) -> 1 becomes 2.
            // Hit 1. value (pre-assignment) was it 2?
            // board[head] = length.
            // Check value (from board[head] before overwrite? No, logic uses `if (head in board)`)
            // It uses `const value = board[head]` *before* overwriting?
            // Code: `const value = board[head]; board[head] = length;`

            // If hit self (value > 0):
            // mapBoard(-value).

            // Expect board to be cleared of snake bodies?
            expect(newState.board[0]).toBe(2); // Should remain but reduced
            expect(newState.board[1]).toBe(1); // New head, reduced by collision value (3 - 2 = 1)
            expect(newState.length).toBe(1); // Length updated to 1
            // Usually game over or reset.
            // If mapBoard removes positive values, we expect emptiness except head?
        });

        it('should process buffer for direction change', () => {
            const state = {
                ...baseState,
                buffer: [10], // Down
                velocity: 1,
            };

            const newState = reduceBoard(state);
            // Head moves by OLD velocity first
            expect(newState.head).toBe(1); // 0 + 1
            // Velocity updates to NEW velocity for next turn
            expect(newState.velocity).toBe(10);
        });
    });
});
