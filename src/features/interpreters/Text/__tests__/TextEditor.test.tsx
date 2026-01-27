/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextEditor, {
    handleAction,
    TextState,
    TextActionPayload,
} from '../TextEditor';

// Mocks
jest.mock('../../Editor', () => {
    const { useContext } = require('react');
    const { EditorContext } = require('../../EditorContext');
    return function MockEditor({ children }: any) {
        const context = useContext(EditorContext);
        return (
            <div data-testid="generic-editor">
                <button
                    data-testid="dispatch-test-btn"
                    onClick={() => context.dispatch('test-action')()}
                />
                <button
                    data-testid="dispatch-obj-btn"
                    onClick={() =>
                        context.dispatch({ type: 'obj-action', payload: {} })
                    }
                />
                <div data-testid="height-display">{context.height}</div>
                {children}
            </div>
        );
    };
});
jest.mock('../../components/TextArea', () => ({
    TextArea: function MockTextArea({ value, handleChange }: any) {
        return (
            <textarea
                data-testid="text-area"
                value={value}
                onChange={handleChange}
            />
        );
    },
}));

jest.mock('../../../../hooks', () => ({
    useTimer: jest.fn(() => ({ create: jest.fn(), clear: jest.fn() })),
    useCache: jest.fn(() => jest.fn()),
    useContainer: jest.fn(() => ({ height: 500 })),
}));

jest.mock('../../Toolbar', () => ({
    handleToolbar: jest.fn(state => state),
}));

describe('TextEditor', () => {
    describe('handleAction', () => {
        const mockPayload: TextActionPayload = {
            nextIter: jest.fn(),
            clear: jest.fn(),
            create: jest.fn(),
            dispatch: jest.fn(),
            start: {},
            newText: '',
            clean: jest.fn(t => t),
        };

        const initialState: TextState = {
            text: '',
            code: '',
            pause: true,
        };

        test('handles ff action (toggle pause)', () => {
            const action = { type: 'ff', payload: mockPayload };
            const statePaused = { ...initialState, pause: true };
            const newState = handleAction(statePaused, action);
            expect(newState.pause).toBe(false);
            expect(mockPayload.create).toHaveBeenCalledWith(
                expect.objectContaining({ speed: 50 })
            );

            const stateRunning = { ...initialState, pause: false };
            const newState2 = handleAction(stateRunning, action);
            expect(newState2.pause).toBe(false); // In original code it resets loop but keeps running
            expect(mockPayload.create).toHaveBeenCalledWith(
                expect.objectContaining({ speed: 10 })
            );
        });

        test('handles edit action', () => {
            const clean = jest.fn(t => t.toUpperCase());
            const action = {
                type: 'edit',
                payload: { ...mockPayload, newText: 'abc', clean },
            };

            const newState = handleAction(initialState, action);

            expect(newState.text).toBe('abc');
            expect(newState.code).toBe('ABC');
            expect(mockPayload.clear).toHaveBeenCalled();
            expect(mockPayload.nextIter).toHaveBeenCalled();
            expect(newState.pause).toBe(true);
        });

        test('delegates unknown actions to handleToolbar', () => {
            const handleToolbar = require('../../Toolbar').handleToolbar;
            handleToolbar.mockClear();

            const action = { type: 'unknown', payload: mockPayload };
            handleAction(initialState, action);

            expect(handleToolbar).toHaveBeenCalled();
        });
    });

    describe('Component', () => {
        const props = {
            name: 'TestLang',
            start: { initial: true },
            runner: jest.fn(),
            clean: jest.fn(text => text),
            tape: true,
        };

        test('renders editor with initial state', () => {
            render(<TextEditor {...props} />);
            expect(screen.getByTestId('generic-editor')).toBeInTheDocument();
            expect(screen.getByTestId('text-area')).toBeInTheDocument();
        });

        test('handles text change', () => {
            render(<TextEditor {...props} />);
            const textArea = screen.getByTestId('text-area');

            fireEvent.change(textArea, { target: { value: 'new code' } });

            expect(textArea).toHaveValue('new code');
        });

        test('sets document title', () => {
            render(<TextEditor {...props} />);
            expect(document.title).toContain('TestLang');
        });

        test('handles dispatch with string type (curried)', () => {
            // Need to spy on dispatch or verify effect.
            // Since we use useReducer, we can't easily spy on internal dispatch.
            // But handleAction will be called.
            // We can spy on handleAction? No, it's imported.
            // But we can spy on handleToolbar which is called by default in handleAction.
            const handleToolbar = require('../../Toolbar').handleToolbar;
            handleToolbar.mockClear();

            render(<TextEditor {...props} />);
            fireEvent.click(screen.getByTestId('dispatch-test-btn'));

            // dispatch('test-action') -> handles as unknown action -> handleToolbar
            expect(handleToolbar).toHaveBeenCalled();
            expect(handleToolbar.mock.calls[0][1].type).toBe('test-action');
        });

        test('handles dispatch with object type', () => {
            const handleToolbar = require('../../Toolbar').handleToolbar;
            handleToolbar.mockClear();

            render(<TextEditor {...props} />);
            fireEvent.click(screen.getByTestId('dispatch-obj-btn'));

            expect(handleToolbar).toHaveBeenCalled();
            expect(handleToolbar.mock.calls[0][1].type).toBe('obj-action');
        });

        test('uses cached height if container height is 0', () => {
            // First render with height 500 (default mock)
            const { unmount } = render(<TextEditor {...props} />);
            unmount(); // Should trigger cache set? cache set on useEffect dependency?
            // useEffect set cache when container.height > 0.

            // Now mock height 0
            const useContainer = require('../../../../hooks').useContainer;
            useContainer.mockReturnValue({ height: 0 });

            render(<TextEditor {...props} />);

            // Should use cached height 500
            expect(screen.getByTestId('height-display')).toHaveTextContent(
                '500'
            );
        });
    });
});
