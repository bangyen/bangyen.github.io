import { handleAction, GridState, GridAction } from '../eventHandlers';
import * as gridUtils from '../../utils/gridUtils';

jest.mock('../../Toolbar', () => ({
    handleToolbar: jest.fn(state => state),
}));

describe('Grid eventHandlers', () => {
    const initialState: GridState = {
        grid: ' '.repeat(9),
        select: null,
        rows: 3,
        cols: 3,
        pause: true,
    };

    describe('handleKeys (via handleAction edit)', () => {
        test('does nothing if no square is selected', () => {
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'a', resetState: jest.fn() },
            };
            const nextState = handleAction(initialState, action);
            expect(nextState.grid).toBe(initialState.grid);
        });

        test('updates grid and calls resetState when a key is pressed', () => {
            const resetState = jest.fn();
            const state = { ...initialState, select: 4 }; // Center square
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'X', resetState },
            };
            const nextState = handleAction(state, action);

            expect(nextState.grid[4]).toBe('X');
            expect(resetState).toHaveBeenCalledWith(nextState.grid);
            expect(nextState.pause).toBe(true);
        });

        test('handles Backslash specifically', () => {
            const resetState = jest.fn();
            const state = { ...initialState, select: 0 };
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'Backslash', resetState },
            };
            const nextState = handleAction(state, action);
            expect(nextState.grid[0]).toBe('\\');
        });

        test('handles Backspace/Delete by inserting space', () => {
            const resetState = jest.fn();
            const state = { ...initialState, grid: 'ABCDEFGHI', select: 1 };
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'Backspace', resetState },
            };
            const nextState = handleAction(state, action);
            expect(nextState.grid[1]).toBe(' ');
        });

        test('moves selection on arrow keys', () => {
            const spy = jest.spyOn(gridUtils, 'gridMove').mockReturnValue(5);
            const state = { ...initialState, select: 4 };
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'ArrowRight', resetState: jest.fn() },
            };
            const nextState = handleAction(state, action);
            expect(nextState.select).toBe(5);
            spy.mockRestore();
        });
    });

    describe('handleResize (via handleAction resize)', () => {
        test('expands grid when rows increase', () => {
            const resetState = jest.fn();
            const action: GridAction = {
                type: 'resize',
                payload: { rows: 4, resetState },
            };
            const nextState = handleAction(initialState, action);
            expect(nextState.grid.length).toBe(12); // 4 * 3
            expect(nextState.rows).toBe(4);
            expect(resetState).toHaveBeenCalled();
        });

        test('pads rows when cols increase', () => {
            const resetState = jest.fn();
            const action: GridAction = {
                type: 'resize',
                payload: { cols: 4, resetState },
            };
            // Initial grid: "123456789" (if 3x3)
            const state = { ...initialState, grid: '123456789' };
            const nextState = handleAction(state, action);
            // row 1: "123 "
            // row 2: "456 "
            // row 3: "789 "
            expect(nextState.grid).toBe('123 456 789 ');
            expect(nextState.cols).toBe(4);
        });
    });

    describe('handleAction click', () => {
        test('sets selection', () => {
            const action: GridAction = {
                type: 'click',
                payload: { select: 5 },
            };
            const nextState = handleAction(initialState, action);
            expect(nextState.select).toBe(5);
        });

        test('toggles selection off if same square clicked', () => {
            const state = { ...initialState, select: 5 };
            const action: GridAction = {
                type: 'click',
                payload: { select: 5 },
            };
            const nextState = handleAction(state, action);
            expect(nextState.select).toBeNull();
        });
    });

    describe('handleAction delete (special pointer loop)', () => {
        test('decrements pointer if pointer > 0 and tape[pointer] is 0', () => {
            const state = {
                ...initialState,
                pointer: 1,
                tape: [0, 0],
            } as any;
            const action = { type: 'delete' } as any;
            const nextState = handleAction(state, action);
            expect(nextState.pointer).toBe(0);
        });
    });
});
