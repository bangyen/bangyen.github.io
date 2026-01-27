import * as logic from '../logic';
import { gridMove, getDirection } from '../../../interpreters/utils/gridUtils';

// Mock utils
jest.mock('../../../interpreters/utils/gridUtils', () => ({
    gridMove: jest.fn(),
    getDirection: jest.fn(),
}));

describe('Snake Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getRandom', () => {
        test('returns a number within range', () => {
            const max = 10;
            const val = logic.getRandom(max);
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThan(max);
        });
    });

    describe('addNext', () => {
        test('adds food to a free spot', () => {
            const randomSpy = jest
                .spyOn(Math, 'random')
                .mockReturnValueOnce(0.1) // 10 * 0.1 = 1 (Occupied)
                .mockReturnValueOnce(0.5); // 10 * 0.5 = 5 (Free)

            const exclude = { 1: 5 };
            const result = logic.addNext(10, exclude);

            expect(result[1]).toBe(5); // Original preserved
            expect(result[2]).toBe(-1); // New food (1 occupied -> 2)

            randomSpy.mockRestore();
        });

        test('wraps around if max reached', () => {
            const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.9); // 9.
            const exclude = { 9: 5 };
            const result = logic.addNext(10, exclude);
            expect(result[0]).toBe(-1);

            randomSpy.mockRestore();
        });
    });

    describe('handleResize', () => {
        test('resets state with new dimensions', () => {
            const state: logic.SnakeState = {
                rows: 5,
                cols: 5,
                velocity: 1,
                buffer: [],
                length: 5,
                head: 0,
                board: {},
            };
            const newState = logic.handleResize(state, 10, 10);
            expect(newState.rows).toBe(10);
            expect(newState.cols).toBe(10);
            expect(Object.keys(newState.board)).toHaveLength(2); // Head + Food
        });

        test('resolves head/food collision', () => {
            const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.1);

            const state: logic.SnakeState = {
                rows: 5,
                cols: 5,
                velocity: 1,
                buffer: [],
                length: 5,
                head: 0,
                board: {},
            };

            const newState = logic.handleResize(state, 10, 10);
            expect(newState.head).toBe(10);
            expect(newState.board[11]).toBe(-1);

            randomSpy.mockRestore();
        });
    });

    describe('handleAction', () => {
        test('resize action matches handleResize', () => {
            const state = { rows: 5, cols: 5 } as logic.SnakeState;
            const newState = logic.handleAction(state, {
                type: 'resize',
                payload: { rows: 10, cols: 10 },
            });
            expect(newState.rows).toBe(10);
        });

        test('steer action adds to buffer if valid direction', () => {
            const state = { buffer: [] } as unknown as logic.SnakeState;
            (getDirection as jest.Mock).mockReturnValue(2); // Valid

            const newState = logic.handleAction(state, {
                type: 'steer',
                payload: { key: 'down' },
            });
            expect(newState.buffer).toEqual([2]);
        });

        test('steer action ignores invalid direction', () => {
            const state = { buffer: [] } as unknown as logic.SnakeState;
            (getDirection as jest.Mock).mockReturnValue(0); // Invalid/Null

            const newState = logic.handleAction(state, {
                type: 'steer',
                payload: { key: 'invalid' },
            });
            expect(newState.buffer).toEqual([]);
        });

        test('move action calls reduceBoard', () => {
            const state = {
                rows: 5,
                cols: 5,
                board: {},
                buffer: [],
                length: 1,
                head: 0,
                velocity: 1,
            } as logic.SnakeState;
            const newState = logic.handleAction(state, { type: 'move' });
            expect(newState).not.toBe(state);
        });

        test('default action returns state', () => {
            const state = { rows: 5 } as unknown as logic.SnakeState;
            const newState = logic.handleAction(state, {
                type: 'unknown',
            } as unknown as logic.Action);
            expect(newState).toBe(state);
        });
    });

    describe('reduceBoard', () => {
        test('moves head and decrements values', () => {
            (gridMove as jest.Mock).mockReturnValue(1); // 0 -> 1

            const state: logic.SnakeState = {
                rows: 10,
                cols: 10,
                length: 5,
                head: 0,
                velocity: 1,
                buffer: [],
                board: { 0: 5, 2: 4 }, // Head at 0 (val 5), Body at 2 (val 4)
            };

            const newState = logic.reduceBoard(state);
            expect(newState.head).toBe(1);
            expect(newState.board[1]).toBe(5);
            expect(newState.board[0]).toBe(4);
            expect(newState.board[2]).toBe(3);
        });

        test('handles food consumption', () => {
            (gridMove as jest.Mock).mockReturnValue(1);
            const state: logic.SnakeState = {
                rows: 10,
                cols: 10,
                length: 5,
                head: 0,
                velocity: 1,
                buffer: [],
                board: { 0: 5, 1: -1 }, // Food at 1
            };

            const newState = logic.reduceBoard(state);
            expect(newState.length).toBe(6);
            expect(newState.board[1]).toBe(6);
            const hasFood = Object.values(newState.board).some(v => v < 0);
            expect(hasFood).toBe(true);
        });

        test('handles collision (crash)', () => {
            (gridMove as jest.Mock).mockReturnValue(1);
            const state: logic.SnakeState = {
                rows: 10,
                cols: 10,
                length: 5,
                head: 0,
                velocity: 1,
                buffer: [],
                board: { 0: 5, 1: 4 }, // Body at 1
            };

            const newState = logic.reduceBoard(state);
            expect(newState.head).toBe(1);
            expect(newState.board[1]).toBeLessThan(5);
        });

        test('consumes buffer/velocity update', () => {
            (gridMove as jest.Mock).mockReturnValue(1);
            const state: logic.SnakeState = {
                rows: 10,
                cols: 10,
                length: 5,
                head: 0,
                velocity: 1,
                buffer: [2, 3], // Buffer has turns
                board: {},
            };

            const newState = logic.reduceBoard(state);
            expect(newState.buffer).toEqual([3]);
            expect(newState.velocity).toBe(2);
        });

        test('prevents 180 turn', () => {
            (gridMove as jest.Mock).mockReturnValue(1);
            const state: logic.SnakeState = {
                rows: 10,
                cols: 10,
                length: 5,
                head: 0,
                velocity: 1,
                buffer: [-1], // Opposite direction
                board: {},
            };

            const newState = logic.reduceBoard(state);
            expect(newState.velocity).toBe(1); // Unchanged
            expect(newState.buffer).toEqual([]); // Consumed
        });
    });
});
