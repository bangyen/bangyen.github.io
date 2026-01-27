import { handleAction, GridState, GridAction } from '../eventHandlers';
import * as Toolbar from '../../Toolbar';

// Mock getDirection and gridMove
jest.mock('../../utils/gridUtils', () => ({
    getDirection: jest.fn((key) => {
        if (key === 'ArrowRight') return 1;
        if (key === 'ArrowLeft') return -1;
        if (key === 'ArrowDown') return 10; // Mock 10 cols
        if (key === 'ArrowUp') return -10;
        return 0;
    }),
    gridMove: jest.fn((pos, dir, rows, cols) => pos + dir), // Simplified movement
}));

// Mock Toolbar handler
jest.mock('../../Toolbar', () => ({
    handleToolbar: jest.fn((state) => ({ ...state, toolbarUpdated: true })),
}));

describe('Grid eventHandlers', () => {
    const initialState: GridState = {
        grid: '          ', // 10 spaces
        select: null,
        rows: 2,
        cols: 5,
        pause: false,
    };

    const resetState = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('handleAction', () => {
        it('handles resize', () => {
            const state = { ...initialState, grid: 'AB' }; // 2 chars
            const action: GridAction = {
                type: 'resize',
                payload: {
                    resetState,
                    rows: 2,
                    cols: 2,
                },
            };
            // Initial rows=2, cols=5. Resize to 2x2.
            // 2 rows. 
            // Row 0: AB... (5 cols). Resize to 2 cols -> AB
            // Row 1: ..... (5 cols). Resize to 2 cols -> ..
            // But 'AB' is grid string.

            // Actually let's test a simple pad case.
            // Current grid 'AB'. Rows=2, Cols=5?? Non-matching length?
            // logic: grid.substring...

            // Let's use consistent state.
            const consistentState = {
                ...initialState,
                rows: 1,
                cols: 2,
                grid: 'AB'
            };

            const resizeAction: GridAction = {
                type: 'resize',
                payload: {
                    resetState,
                    rows: 2,
                    cols: 2
                }
            };

            // 1x2 -> 2x2.
            // Row 0: AB -> AB
            // Row 1: (New) -> '  ' (2 spaces)
            // Result: 'AB  '

            const newState = handleAction(consistentState, resizeAction);
            // resetState should be called with new grid
            expect(resetState).toHaveBeenCalledWith('AB  ');
            expect(newState).toEqual(expect.objectContaining({
                rows: 2,
                cols: 2,
                grid: 'AB  ',
                pause: true
            }));
        });

        it('handles edit (character input)', () => {
            const state = { ...initialState, select: 0, grid: '  ' };
            const action: GridAction = {
                type: 'edit',
                payload: {
                    key: 'X',
                    resetState
                }
            };

            const newState = handleAction(state, action);
            expect(resetState).toHaveBeenCalledWith('X ');
            expect(newState).toEqual(expect.objectContaining({ grid: 'X ' }));
        });

        it('handles edit (arrow keys)', () => {
            const state = { ...initialState, select: 0 };
            const action: GridAction = {
                type: 'edit',
                payload: {
                    key: 'ArrowRight',
                    resetState
                }
            };

            // gridMove is mocked to just add direction. ArrowRight -> +1
            const newState = handleAction(state, action);
            expect(newState.select).toBe(1);
            expect(resetState).not.toHaveBeenCalled(); // Navigation doesn't reset grid
        });

        it('handles click', () => {
            const state = { ...initialState, select: 0 };
            // Click same -> deselect
            const actionSame: GridAction = { type: 'click', payload: { select: 0 } };
            expect(handleAction(state, actionSame).select).toBeNull();

            // Click diff -> select
            const actionDiff: GridAction = { type: 'click', payload: { select: 5 } };
            expect(handleAction(state, actionDiff).select).toBe(5);
        });

        it('delegates to handleToolbar for unknown types', () => {
            const state = { ...initialState };
            const action = { type: 'run' } as any;
            const newState = handleAction(state, action);
            expect(Toolbar.handleToolbar).toHaveBeenCalled();
            expect(newState).toHaveProperty('toolbarUpdated', true);
        });

        it('handles special keys (Backslash, Backspace)', () => {
            const state = { ...initialState, select: 0, grid: '  ' };

            // Backslash
            const actionBackslash: GridAction = {
                type: 'edit',
                payload: { key: 'Backslash', resetState }
            };
            expect(handleAction(state, actionBackslash).grid).toBe('\\ ');

            // Backspace -> space
            const actionBackspace: GridAction = {
                type: 'edit',
                payload: { key: 'Backspace', resetState }
            };
            expect(handleAction(state, actionBackspace).grid).toBe('  ');
        });

        it('ignores invalid keys', () => {
            const state = { ...initialState, select: 0 };
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'Shift', resetState }
            };
            const newState = handleAction(state, action);
            expect(newState).toEqual(state);
        });

        it('ignores edit when no selection', () => {
            const state = { ...initialState, select: null };
            const action: GridAction = {
                type: 'edit',
                payload: { key: 'X', resetState }
            };
            const newState = handleAction(state, action);
            expect(newState).toEqual(state);
        });

        it('handles resize (expansion variants)', () => {
            // Test expand cols
            const state = { ...initialState, rows: 2, cols: 2, grid: 'ABAB' };
            const action: GridAction = {
                type: 'resize',
                payload: { resetState, rows: 2, cols: 3 }
            };
            // Row 0: AB -> AB 
            // Row 1: AB -> AB 
            handleAction(state, action);
            expect(resetState).toHaveBeenCalledWith('AB AB ');

            // Test shrink rows/cols
            const shrinkAction: GridAction = {
                type: 'resize',
                payload: { resetState, rows: 1, cols: 1 }
            };
            // Row 0: AB -> A
            handleAction(state, shrinkAction);
            expect(resetState).toHaveBeenCalledWith('A');

            // Test partial resize (only rows)
            const partialRowsAction: GridAction = {
                type: 'resize',
                payload: { resetState, rows: 3 } // Cols undefined
            };
            // state is 2x2. Expand to 3x2.
            // Row 0: AB
            // Row 1: AB
            // Row 2: (2 spaces)
            handleAction(state, partialRowsAction);
            expect(resetState).toHaveBeenCalledWith('ABAB  ');

            // Test partial resize (only cols)
            const partialColsAction: GridAction = {
                type: 'resize',
                payload: { resetState, cols: 3 } // Rows undefined
            };
            // state is 2x2. Expand to 2x3.
            // Row 0: AB -> AB 
            // Row 1: AB -> AB 
            handleAction(state, partialColsAction);
            expect(resetState).toHaveBeenCalledWith('AB AB ');
        });

        it('handles delete action branches', () => {
            // 1. Valid execution (already tested)
            const state = {
                ...initialState,
                tape: [0, 0, 0],
                pointer: 1
            };
            const action: GridAction = { type: 'delete' } as any;
            const newState = handleAction(state, action) as any;
            expect(newState.pointer).toBe(0);

            // 2. Pointer 0 (no decrement)
            const stateZero = { ...initialState, tape: [0, 0, 0], pointer: 0 };
            const newStateZero = handleAction(stateZero, action) as any;
            expect(newStateZero.pointer).toBe(0); // No change

            // 3. Non-zero value (no decrement)
            const stateVal = { ...initialState, tape: [0, 5, 0], pointer: 1 };
            const newStateVal = handleAction(stateVal, action) as any;
            expect(newStateVal.pointer).toBe(1); // No change
        });
    });
});
