import {
    mapBoard,
    handleResize,
    reduceBoard,
    handleAction,
    addNext,
    Board,
    SnakeState,
} from './logic';
import { getDirection } from '../../interpreters/utils/gridUtils';

// Mock gridUtils
jest.mock('../../interpreters/utils/gridUtils', () => ({
    gridMove: jest.fn((pos, dir, _rows, cols) => pos + dir), // Simplified mock
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
    });
});
