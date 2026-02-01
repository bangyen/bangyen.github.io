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
    gridMove: jest.fn(
        (pos: number, dir: number, _rows = 10, cols = 10): number => {
            // Handle abstract direction IDs
            if (dir === -2) return pos - cols; // Up
            if (dir === 2) return pos + (cols as number); // Down
            if (dir === -1) return pos - 1; // Left
            if (dir === 1) return pos + 1; // Right
            // Fallback for direct offsets (though we should avoid using them)
            return pos + dir;
        }
    ),
    getDirection: jest.fn((key: string) => {
        if (key === 'ArrowUp') return -2;
        if (key === 'ArrowDown') return 2;
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

            expect(newState.buffer).toContain(2); // 2 is Down
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
            // 0 should check 3 because decay + growth cancel out?
            // mapBoard(-1) -> 0 becomes 2.
            // eat food at 1 (value -1).
            // mapBoard(1) -> 0 becomes 3.
            expect(newState.board[0]).toBe(3);
        });

        it('should reset when hitting self', () => {
            // Setup: Obstacle at 1.
            const _state = {
                ...baseState,
                velocity: 1,
                board: { 0: 5, 1: 3 }, // Obstacle at 1
            };

            // Avoidance should TRIGGER here because collision is imminent.
            // But we want to test "reset when hitting self".
            // To force a crash despite avoidance, we must block ALL escape routes.
            // Head at 11 (1,1). Velocity 1 (Right) -> 12.
            // 12 is blocked.
            // Escapes: Up (1), Down (21), Left (10).
            // Block them all.

            const centerState = {
                ...baseState,
                head: 11,
                velocity: 1,
                // Block 12 (Target), 1 (Up), 21 (Down).
                // Left (10) is -velocity, so ignored.
                board: {
                    11: 5,
                    12: 5, // Right (Target)
                    1: 5, // Up
                    21: 5, // Down
                },
            };

            const newState = reduceBoard(centerState);

            // Should crash into 12
            // mapBoard(-1) -> 11:4, 12:4, 1:4, 21:4
            // Next head 12.
            // 12 is occupied (4).
            // mapBoard(-4).

            expect(newState.board[12]).toBeUndefined(); // New head (12) is removed because 3 (length) - 5 (collision) <= 0
            // or logic: board[head] = length (5).
            // Logic: if value > 0 -> mapBoard(-value).
            // Wait, reduceBoard sets board[head] = length.
            // If collision, it subtracts the value of the hit cell from everything?
            // Not exactly standard snake logic but consistent with "reduce length by X" maybe?
            // Let's just key off "length" being reduced.

            expect(newState.length).toBeUndefined();
        });

        it('should avoid self-intersection', () => {
            // Setup: Head at 11. Velocity Right (1).
            // Block 12 (Right).
            // Open Up (1) and Down (21).
            const state = {
                ...baseState,
                head: 11,
                velocity: 1,
                board: {
                    11: 5,
                    12: 5, // Blocked Right
                    // 1 is empty
                    // 21 is empty
                },
            };

            const originalRandom = Math.random;
            // Mock random to return 0 (First valid move).
            // Potential moves: [-2 (Up), 2 (Down)]. (Left is reverse).
            // Order in potentialMoves array: [-2, 2, -1, 1]
            // Valid checks:
            // -2 (Up): safe. Push.
            // 2 (Down): safe. Push.
            // validMoves = [-2, 2].
            // random index 0 -> -2 (Up).

            Math.random = jest.fn(() => 0);

            const newState = reduceBoard(state);

            expect(newState.velocity).toBe(-2); // Should turn Up
            expect(newState.head).toBe(1); // 11 - 10 = 1

            Math.random = originalRandom;
        });

        it('should process buffer for direction change', () => {
            const state = {
                ...baseState,
                buffer: [2], // Down (ID 2)
                velocity: 1,
            };

            const newState = reduceBoard(state);
            // Head moves by OLD velocity first
            expect(newState.head).toBe(1); // 0 + 1
            // Velocity updates to NEW velocity for next turn
            expect(newState.velocity).toBe(2);
        });
    });

    describe('Diagonal Steering', () => {
        const diagState: SnakeState = {
            velocity: -2, // Moving Up
            buffer: [],
            length: 5,
            rows: 10,
            cols: 10,
            head: 55,
            board: {},
        };

        it('should queue step turn when moving vertical and input is diagonal (Up -> Up-Right)', () => {
            // Moving Up (-2). Input NorthEast (Up-Right).
            // Should queue Right (1) THEN Up (-2) to make a diagonal step.
            const newState = handleAction(diagState, {
                type: 'steer',
                payload: { key: 'NorthEast' },
            });
            expect(newState.buffer).toEqual([1, -2]);
        });

        it('should queue multipoint turn when moving opposite direction (Down -> Up-Right)', () => {
            // Moving Down (2). Input NorthEast (Up-Right).
            // Should queue Right (1) then Up (-2).
            const downState = { ...diagState, velocity: 2 };
            const newState = handleAction(downState, {
                type: 'steer',
                payload: { key: 'NorthEast' },
            });
            expect(newState.buffer).toEqual([1, -2]);
        });

        it('should queue step turn when moving horizontal and input is diagonal (Right -> Up-Right)', () => {
            // Moving Right (1). Input NorthEast (Up-Right).
            // Should queue Up (-2) THEN Right (1).
            const rightState = { ...diagState, velocity: 1 };
            const newState = handleAction(rightState, {
                type: 'steer',
                payload: { key: 'NorthEast' },
            });
            expect(newState.buffer).toEqual([-2, 1]);
        });

        it('should queue multipoint turn when moving opposite horizontal (Left -> Up-Right)', () => {
            // Moving Left (-1). Input NorthEast (Up-Right).
            // Should queue Up (-2) then Right (1).
            const leftState = { ...diagState, velocity: -1 };
            const newState = handleAction(leftState, {
                type: 'steer',
                payload: { key: 'NorthEast' },
            });
            expect(newState.buffer).toEqual([-2, 1]);
        });
    });
});
