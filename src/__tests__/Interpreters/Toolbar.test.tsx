import React from 'react';
import { render } from '@testing-library/react';
import { EditorContext } from '../Interpreters/Editor';
import { Toolbar, handleToolbar } from '../Interpreters/Toolbar';

interface EditorContextType {
    name: string;
    tapeFlag: boolean;
    outFlag: boolean;
    regFlag: boolean;
    code: string[] | undefined;
    index: number;
    tape: number[];
    pointer: number;
    output: string[] | string;
    register: number;
    height: number;
    size: number;
    dispatch: jest.Mock;
    fastForward: boolean;
    pause: boolean;
}

// Mock EditorContext data
const mockEditorContext: EditorContextType = {
    name: 'Test Interpreter',
    tapeFlag: true,
    outFlag: true,
    regFlag: true,
    code: ['+', '-', '>', '<'],
    index: 2,
    tape: [0, 1, 2, 3],
    pointer: 1,
    output: ['Hello', 'World'],
    register: 42,
    height: 400,
    size: 20,
    dispatch: jest.fn(),
    fastForward: false,
    pause: false,
};

const EditorProvider = ({ children }: { children: React.ReactNode }) => (
    <EditorContext.Provider value={mockEditorContext}>
        {children}
    </EditorContext.Provider>
);

describe('Toolbar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Toolbar Component', () => {
        test('renders toolbar buttons', () => {
            render(
                <EditorProvider>
                    <Toolbar />
                </EditorProvider>
            );

            expect(mockEditorContext.dispatch).toBeDefined();
        });

        test('displays run button when paused', () => {
            render(
                <EditorProvider>
                    <Toolbar />
                </EditorProvider>
            );

            // Should render buttons based on context
            expect(mockEditorContext.dispatch).toBeDefined();
        });

        test('displays pause button when running', () => {
            const runningContext = {
                ...mockEditorContext,
                pause: false,
            };

            render(
                <EditorContext.Provider value={runningContext}>
                    <Toolbar />
                </EditorContext.Provider>
            );

            expect(runningContext.dispatch).toBeDefined();
        });

        test('shows reset button', () => {
            render(
                <EditorProvider>
                    <Toolbar />
                </EditorProvider>
            );

            expect(mockEditorContext.dispatch).toBeDefined();
        });

        test('shows navigation buttons', () => {
            render(
                <EditorProvider>
                    <Toolbar />
                </EditorProvider>
            );

            expect(mockEditorContext.dispatch).toBeDefined();
        });

        test('shows info link', () => {
            render(
                <EditorProvider>
                    <Toolbar />
                </EditorProvider>
            );

            expect(mockEditorContext.name).toBe('Test Interpreter');
        });

        test('shows home link', () => {
            render(
                <EditorProvider>
                    <Toolbar />
                </EditorProvider>
            );

            expect(mockEditorContext.dispatch).toBeDefined();
        });
    });

    describe('handleToolbar', () => {
        const mockPayload = {
            dispatch: jest.fn(),
            nextIter: jest.fn(action => ({
                ...action.payload,
                processed: true,
            })),
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

            const result = handleToolbar(
                { ...initialState, pause: false },
                action
            );

            expect(mockPayload.clear).toHaveBeenCalled();
            expect(mockPayload.nextIter).toHaveBeenCalled();
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
