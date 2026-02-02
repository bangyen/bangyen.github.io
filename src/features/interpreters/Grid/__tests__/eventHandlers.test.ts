import { handleAction, GridState, GridAction } from '../eventHandlers';
import * as gridUtils from '../../utils/gridUtils';

jest.mock('../../utils/gridUtils', () => ({
    gridMove: jest.fn(),
    getDirection: jest.fn(),
}));

describe('Grid Interpreter Event Handlers', () => {
    const initialState: GridState = {
        grid: '    ',
        select: null,
        rows: 2,
        cols: 2,
        pause: true,
    };

    const mockResetState = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('edit action', () => {
        it('returns empty state if nothing is selected', () => {
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'a', resetState: mockResetState },
            };
            const result = handleAction(initialState, action);
            expect(result).toEqual(initialState);
        });

        it('handles arrow keys and moves selection', () => {
            const state = { ...initialState, select: 0 };
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'ArrowRight', resetState: mockResetState },
            };
            (gridUtils.getDirection as jest.Mock).mockReturnValue('right');
            (gridUtils.gridMove as jest.Mock).mockReturnValue(1);

            const result = handleAction(state, action);
            expect(result.select).toBe(1);
            expect(gridUtils.gridMove).toHaveBeenCalledWith(0, 'right', 2, 2);
        });

        it('edits a cell with a single character', () => {
            const state = { ...initialState, select: 0 };
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'x', resetState: mockResetState },
            };
            const result = handleAction(state, action);
            expect(result.grid).toBe('x   ');
            expect(mockResetState).toHaveBeenCalledWith('x   ');
        });

        it('handles backslash specially', () => {
            const state = { ...initialState, select: 0 };
            const action: GridAction = {
                type: 'edit',
                payload: { key: '\\', resetState: mockResetState },
            };
            const result = handleAction(state, action);
            expect(result.grid).toBe('\\   ');
            expect(mockResetState).toHaveBeenCalledWith('\\   ');
        });

        it('handles backslash via Backslash key name', () => {
            const state = { ...initialState, select: 0 };
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'Backslash', resetState: mockResetState },
            };
            const result = handleAction(state, action);
            expect(result.grid).toBe('\\   ');
        });

        it('clears cell on backspace or delete', () => {
            const state = { ...initialState, grid: 'x   ', select: 0 };
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'Backspace', resetState: mockResetState },
            };
            const result = handleAction(state, action);
            expect(result.grid).toBe('    ');
        });

        it('ignores other keys', () => {
            const state = { ...initialState, select: 0 };
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'Shift', resetState: mockResetState },
            };
            const result = handleAction(state, action);
            expect(result).toEqual(state);
        });
    });

    describe('resize action', () => {
        it('increases grid size with new rows', () => {
            const action: GridAction = {
                type: 'resize',
                payload: { rows: 3, resetState: mockResetState },
            };
            const result = handleAction(initialState, action);
            expect(result.grid.length).toBe(6); // 3*2
            expect(result.grid).toBe('      ');
        });

        it('pads rows when increasing columns', () => {
            const action: GridAction = {
                type: 'resize',
                payload: { cols: 3, resetState: mockResetState },
            };
            const result = handleAction(initialState, action);
            expect(result.grid.length).toBe(6); // 2*3
            expect(result.grid).toBe('      ');
        });

        it('truncates rows when decreasing columns', () => {
            const state = { ...initialState, grid: 'abcd' }; // 2x2: ab, cd
            const action: GridAction = {
                type: 'resize',
                payload: { cols: 1, resetState: mockResetState },
            };
            const result = handleAction(state, action);
            expect(result.grid).toBe('ac'); // rows: a, c
        });
    });

    describe('click action', () => {
        it('selects a new cell', () => {
            const action: GridAction = {
                type: 'click',
                payload: { select: 1 },
            };
            const result = handleAction(initialState, action);
            expect(result.select).toBe(1);
        });

        it('deselects if clicking same cell', () => {
            const state = { ...initialState, select: 1 };
            const action: GridAction = {
                type: 'click',
                payload: { select: 1 },
            };
            const result = handleAction(state, action);
            expect(result.select).toBeNull();
        });
    });

    describe('delete action', () => {
        it('decrements pointer if conditions met', () => {
            const state: GridState = {
                ...initialState,
                tape: [0, 0],
                pointer: 1,
            };
            const action = { type: 'delete' } as unknown as GridAction;
            const result = handleAction(state, action) as GridState & {
                pointer: number;
            };
            expect(result.pointer).toBe(0);
        });

        it('does nothing if conditions not met', () => {
            const state: GridState = {
                ...initialState,
                tape: [0, 1],
                pointer: 1,
            };
            const action = { type: 'delete' } as unknown as GridAction;
            const result = handleAction(state, action) as GridState & {
                pointer: number;
            };
            expect(result.pointer).toBe(1);
        });
    });

    it('passes other actions to handleToolbar', () => {
        const mockPayload = {
            dispatch: jest.fn(),
            create: jest.fn(),
            clear: jest.fn(),
            resetState: jest.fn(),
            nextIter: jest.fn(),
            start: {},
        };
        const action: GridAction = {
            type: 'run',
            payload: mockPayload,
        } as unknown as GridAction;
        const result = handleAction(initialState, action);
        // handleToolbar should work with this payload
        expect(result.pause).toBe(false);
    });
});
