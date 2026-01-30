import {
    handleAction,
    handleResize,
    reduceBoard,
    getRandom,
    addNext,
    mapBoard,
    SnakeState,
    Action,
} from '../logic';

describe('Snake Game Logic', () => {
    describe('getRandom', () => {
        test('returns floor of random * max', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.5);
            expect(getRandom(10)).toBe(5);
            jest.spyOn(Math, 'random').mockReturnValue(0.999);
            expect(getRandom(10)).toBe(9);
            jest.restoreAllMocks();
        });
    });

    describe('addNext', () => {
        test('adds food to a clear spot', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.1); // pos 1 for max 10
            const board = { 0: 3 }; // head at 0
            const next = addNext(10, board);
            expect(next[1]).toBe(-1);
            jest.restoreAllMocks();
        });

        test('skips occupied spots', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0); // target pos 0
            const board = { 0: 3, 1: 2, 2: 1 }; // spots 0,1,2 occupied
            const next = addNext(10, board);
            expect(next[3]).toBe(-1); // skips to first available
            jest.restoreAllMocks();
        });

        test('wraps around if end of board reached while skipping', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.8); // target pos 8 for max 10
            const board = { 8: 1, 9: 1 }; // 8 and 9 occupied
            const next = addNext(10, board);
            expect(next[0]).toBe(-1); // wraps to 0
            jest.restoreAllMocks();
        });
    });

    describe('mapBoard', () => {
        test('decrements segments and keeps food', () => {
            const board = { 1: 3, 2: 2, 3: -1 };
            const next = mapBoard(board, -1);
            expect(next).toEqual({ 1: 2, 2: 1, 3: -1 });
        });

        test('removes expired segments', () => {
            const board = { 1: 1, 2: 0 };
            const next = mapBoard(board, -1);
            expect(next).toEqual({});
        });
    });

    describe('handleResize', () => {
        test('initializes state with head and food', () => {
            jest.spyOn(Math, 'random')
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(0.5);
            const state = { length: 3 } as unknown as SnakeState;
            const next = handleResize(state, 10, 10);
            expect(next.rows).toBe(10);
            expect(next.cols).toBe(10);
            expect(next.head).toBe(0);
            expect(next.board[0]).toBe(3);
            expect(next.board[50]).toBe(-1); // 0.5 * 100
            jest.restoreAllMocks();
        });
    });

    describe('reduceBoard (movement loop)', () => {
        let initialState: SnakeState;

        beforeEach(() => {
            initialState = {
                rows: 10,
                cols: 10,
                head: 0,
                velocity: 1, // Moving right
                length: 3,
                board: { 0: 3, 5: -1 },
                buffer: [],
            };
        });

        test('moves head according to velocity', () => {
            const next = reduceBoard(initialState);
            expect(next.head).toBe(1);
            expect(next.board[1]).toBe(3);
            expect(next.board[0]).toBe(2);
        });

        test('eats food and grows', () => {
            initialState.head = 4;
            initialState.velocity = 1; // move to 5
            const next = reduceBoard(initialState);
            expect(next.head).toBe(5);
            expect(next.board[5]).toBe(4); // was 3, +1 from eating food
            expect(next.length).toBe(4);
        });

        test('processes velocity buffer', () => {
            initialState.buffer = [2]; // change to down
            const next = reduceBoard(initialState);
            expect(next.velocity).toBe(2);
            expect(next.head).toBe(1); // Moved right (0 -> 1)
            expect(next.buffer).toEqual([]);
        });

        test('ignores opposite directions in buffer', () => {
            initialState.buffer = [-1]; // moving right (1), ignore left (-1)
            const next = reduceBoard(initialState);
            expect(next.velocity).toBe(1);
            expect(next.head).toBe(1);
        });

        test('handles self-collision', () => {
            initialState.head = 0;
            initialState.velocity = 1; // move to 1
            initialState.board = { 0: 3, 1: 2, 2: 1 }; // segment at 1 (value 2), segment at 2 (value 1)
            // Start with a state where we are about to collide
            // Head is at 0, trying to move to 1
            // 1 is occupied by body part
            // 0 is occupied by head (value 3)
            // 2 is occupied by tail (value 1)

            // reduceBoard will:
            // 1. mapBoard(-1) -> 0:2, 1:1, 2:0(removed)
            // 2. Check collision at 1. 1 is occupied (value 1 > 0).
            // 3. Try to find safe move.
            //    - Up (-2): map pos 8 (safe)
            //    - Down (2): map pos 2 (safe)
            //    - Left (-1): map pos 9 (safe)
            //    - Right(1): Blocked
            //    It will pick a random valid move.

            // To force collision (and thus length reduction or game over logic if implemented),
            // we need to block all paths or test that it avoids collision.

            // The current test expects length to be 2.
            // Initial length is 3. If it collides and resets/cuts, length might change.
            // But reduceBoard has avoidance logic.

            // Let's test that it AVOIDS collision if possible.
            const next = reduceBoard(initialState);
            expect(next.head).not.toBe(1); // Should have turned
            expect(next.length).toBe(3); // Should survive
        });
    });

    describe('handleAction', () => {
        test('steer action adds to buffer', () => {
            const state = { buffer: [] } as unknown as SnakeState;
            const next = handleAction(state, {
                type: 'steer',
                payload: { key: 'ArrowDown' },
            });
            expect(next.buffer).toEqual([2]);
        });

        test('resize action calls handleResize', () => {
            const state = { length: 3 } as unknown as SnakeState;
            const next = handleAction(state, {
                type: 'resize',
                payload: { rows: 5, cols: 5 },
            });
            expect(next.rows).toBe(5);
        });

        test('move action calls reduceBoard', () => {
            const state = {
                rows: 10,
                cols: 10,
                head: 0,
                velocity: 1,
                length: 3,
                board: { 0: 3 },
                buffer: [],
            } as SnakeState;
            const next = handleAction(state, { type: 'move' });
            expect(next.head).toBe(1);
        });

        test('ignores unknown actions', () => {
            const state = { head: 0 } as unknown as SnakeState;
            const next = handleAction(state, {
                type: 'unknown',
            } as unknown as Action);
            expect(next).toBe(state);
        });
    });
});
