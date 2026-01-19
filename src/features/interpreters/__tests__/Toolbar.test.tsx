import { handleToolbar } from '../Toolbar';

describe('Toolbar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('handleToolbar', () => {
        const mockPayload = {
            dispatch: jest.fn(),
            nextIter: jest.fn((action: { type: string; payload: any }) => {
                // Return a proper object structure - match what the code expects
                // For reset action, nextIter is called with { type: 'clear', payload: resetPayload }
                // resetPayload contains { ...state, ...start } which is { value: 0, pause: false }
                const payload = action.payload || action;
                return {
                    value: payload.value || 0,
                    pause: payload.pause || false,
                };
            }),
            create: jest.fn(),
            clear: jest.fn(),
            start: { value: 0 },
        };

        const initialState = {
            value: 0,
            pause: true,
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('handles run action', () => {
            const action = {
                type: 'run',
                payload: mockPayload,
            };

            const result = handleToolbar(initialState, action);

            expect(mockPayload.create).toHaveBeenCalled();
            expect(result.pause).toBe(false);
        });

        test('handles stop action', () => {
            const action = {
                type: 'stop',
                payload: mockPayload,
            };

            const result = handleToolbar(
                { ...initialState, pause: false },
                action
            );

            expect(mockPayload.clear).toHaveBeenCalled();
            expect(result.pause).toBe(true);
        });

        test('handles reset action', () => {
            const action = {
                type: 'reset',
                payload: mockPayload,
            };

            // Mock nextIter to return an object
            mockPayload.nextIter.mockReturnValueOnce({
                value: 0,
                pause: false,
            });

            const result = handleToolbar(
                { ...initialState, pause: false },
                action
            );

            expect(mockPayload.clear).toHaveBeenCalled();
            expect(mockPayload.nextIter).toHaveBeenCalled();
            // After reset, pause should be set to true
            expect(result.pause).toBe(true);
        });

        test('handles next action', () => {
            const action = {
                type: 'next',
                payload: mockPayload,
            };

            const result = handleToolbar(initialState, action);

            expect(result).toBeDefined();
        });

        test('handles prev action', () => {
            const action = {
                type: 'prev',
                payload: mockPayload,
            };

            const result = handleToolbar(initialState, action);

            expect(mockPayload.nextIter).toHaveBeenCalled();
            expect(result.pause).toBe(true);
        });

        test('handles timer action with end state', () => {
            const action = {
                type: 'timer',
                payload: mockPayload,
            };

            const stateWithEnd = { ...initialState, end: true };

            handleToolbar(stateWithEnd, action);

            expect(mockPayload.dispatch).toHaveBeenCalled();
        });

        test('handles timer action without end state', () => {
            const action = {
                type: 'timer',
                payload: mockPayload,
            };

            handleToolbar(initialState, action);

            expect(mockPayload.dispatch).toHaveBeenCalled();
        });

        test('handles unknown action gracefully', () => {
            const action = {
                type: 'unknown',
                payload: mockPayload,
            };

            const result = handleToolbar(initialState, action);

            expect(result).toBeDefined();
        });
    });
});
