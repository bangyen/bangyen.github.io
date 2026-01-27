import {
    handleAction,
    handleResize,
    reduceBoard,
    getRandom,
    addNext,
    mapBoard,
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
            const state: any = { length: 3 };
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
        let initialState: any;

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
            initialState.board = { 0: 3, 1: 2 }; // segment at 1 (value 2)
            const next = reduceBoard(initialState);
            expect(next.length).toBe(2); // Initial length 3 - segment value 1 = 2
        });
    });

    describe('handleAction', () => {
        test('steer action adds to buffer', () => {
            const state: any = { buffer: [] };
            const next = handleAction(state, {
                type: 'steer',
                payload: { key: 'ArrowDown' },
            });
            expect(next.buffer).toEqual([2]);
        });

        test('resize action calls handleResize', () => {
            const state: any = { length: 3 };
            const next = handleAction(state, {
                type: 'resize',
                payload: { rows: 5, cols: 5 },
            });
            expect(next.rows).toBe(5);
        });

        test('move action calls reduceBoard', () => {
            const state: any = {
                rows: 10,
                cols: 10,
                head: 0,
                velocity: 1,
                board: { 0: 3 },
                buffer: [],
            };
            const next = handleAction(state, { type: 'move' });
            expect(next.head).toBe(1);
        });

        test('ignores unknown actions', () => {
            const state: any = { head: 0 };
            const next = handleAction(state, { type: 'unknown' } as any);
            expect(next).toBe(state);
        });
    });
});
