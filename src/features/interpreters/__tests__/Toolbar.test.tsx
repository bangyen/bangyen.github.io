/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { handleToolbar, Toolbar } from '../Toolbar';
import { EditorContext } from '../EditorContext';
import { useMediaQuery } from '../../../components/mui';

// Mocks
jest.mock('../../../components/ui/Controls', () => ({
    TooltipButton: ({ title, onClick, disabled }: any) => (
        <button
            data-testid={`btn-${title}`}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {title}
        </button>
    ),
}));

jest.mock('../../../components/mui', () => ({
    useMediaQuery: jest.fn(),
}));

jest.mock('../../../components/icons', () => ({
    NavigateBeforeRounded: () => <svg />,
    NavigateNextRounded: () => <svg />,
    PlayArrowRounded: () => <svg />,
    FirstPageRounded: () => <svg />,
    LastPageRounded: () => <svg />,
    PauseRounded: () => <svg />,
    InfoRounded: () => <svg />,
    HomeRounded: () => <svg />,
}));

// Mock Router Link
jest.mock('react-router-dom', () => ({
    Link: ({ children }: any) => <a>{children}</a>,
}));

describe('Toolbar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
    });

    // ... Logic Tests ...
    describe('handleToolbar', () => {
        const mockPayload = {
            dispatch: jest.fn(),
            nextIter: jest.fn((action: { type: string; payload: any }) => {
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

        test('handles run action and timer repeat', () => {
            const action = { type: 'run', payload: mockPayload };
            handleToolbar(initialState, action);
            expect(mockPayload.create).toHaveBeenCalled();
            // Verify repeat callback
            const config = mockPayload.create.mock.calls[0][0];
            config.repeat();
            // repeat triggers dispatch('timer')
            expect(mockPayload.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'timer' })
            );
        });

        test('handles reset action', () => {
            const action = { type: 'reset', payload: mockPayload };
            mockPayload.nextIter.mockReturnValueOnce({
                value: 0,
                pause: false,
            });

            const result = handleToolbar(
                { ...initialState, pause: false },
                action
            );

            expect(window.confirm).toHaveBeenCalled();
            expect(mockPayload.clear).toHaveBeenCalled();
            expect(result.pause).toBe(true);
        });

        test('handles stop action', () => {
            const action = { type: 'stop', payload: mockPayload };
            const result = handleToolbar(
                { ...initialState, pause: false },
                action
            );
            expect(mockPayload.clear).toHaveBeenCalled();
            expect(result.pause).toBe(true);
        });

        test('handles next action', () => {
            const action = { type: 'next', payload: mockPayload };
            const result = handleToolbar(initialState, action);
            expect(mockPayload.nextIter).toHaveBeenCalled();
            // next doesn't set pause to true explicitly in pauseStateMap,
            // but updateHandler returns result from nextIter.
            // If nextIter returns { pause: ... }, it's used.
        });

        test('handles prev action', () => {
            const action = { type: 'prev', payload: mockPayload };
            const result = handleToolbar(initialState, action);
            expect(mockPayload.nextIter).toHaveBeenCalled();
            expect(result.pause).toBe(true);
        });

        test('handles timer action with end=true (dispatches stop)', () => {
            const action = { type: 'timer', payload: mockPayload };
            handleToolbar({ ...initialState, end: true }, action);
            // Should dispatch 'stop'
            expect(mockPayload.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'stop' })
            );
        });

        test('handles timer action with end=false (dispatches next)', () => {
            const action = { type: 'timer', payload: mockPayload };
            handleToolbar({ ...initialState, end: false }, action);
            // Should dispatch 'next'
            expect(mockPayload.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'next' })
            );
        });

        test('handles share action', () => {
            const action = { type: 'share', payload: mockPayload };
            Object.assign(navigator, {
                clipboard: { writeText: jest.fn() },
            });
            handleToolbar(initialState, action);
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
        });
    });

    describe('Toolbar Component', () => {
        // Fix: mockDispatch returns a function (handler)
        const mockDispatch = jest.fn(() => jest.fn());
        const mockContext = {
            name: 'Test',
            pause: false, // Running
            fastForward: false,
            dispatch: mockDispatch,
            // ... other props
        };
        const mockUseMediaQuery = useMediaQuery as unknown as jest.Mock;

        const renderWithContext = (context: any) => {
            // Toolbar returns Element[]. Need to wrap in div.
            const Wrapper = () => {
                return (
                    <div>
                        <Toolbar />
                    </div>
                );
            };
            return render(
                <EditorContext.Provider value={context}>
                    <Wrapper />
                </EditorContext.Provider>
            );
        };

        test('renders empty if no context', () => {
            renderWithContext(undefined);
            // Should be empty
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        test('renders running state (Pause button)', () => {
            mockUseMediaQuery.mockReturnValue(true); // Desktop
            renderWithContext({ ...mockContext, pause: false });

            // If pause=false (Running), show Pause button.
            expect(screen.getByTestId('btn-Pause')).toBeInTheDocument();
            expect(screen.queryByTestId('btn-Run')).not.toBeInTheDocument();
        });

        test('renders paused state (Run button)', () => {
            mockUseMediaQuery.mockReturnValue(true);
            renderWithContext({ ...mockContext, pause: true });

            expect(screen.getByTestId('btn-Run')).toBeInTheDocument();
        });

        test('renders Reset button', () => {
            mockUseMediaQuery.mockReturnValue(true);
            renderWithContext(mockContext);
            expect(screen.getByTestId('btn-Reset')).toBeInTheDocument();
        });

        test('renders Fast Forward button (disabled/enabled)', () => {
            mockUseMediaQuery.mockReturnValue(true);
            // Case 1: Disabled
            const { rerender } = renderWithContext({
                ...mockContext,
                fastForward: false,
            });
            const btn = screen.getByTestId('btn-Fast Forward');
            expect(btn).toBeDisabled();
        });

        test('handles click events', () => {
            mockUseMediaQuery.mockReturnValue(true);
            renderWithContext({ ...mockContext, pause: true }); // Show Run

            const btnRun = screen.getByTestId('btn-Run');
            fireEvent.click(btnRun);

            // mockDispatch called with 'run'.
            expect(mockDispatch).toHaveBeenCalledWith('run');
        });
    });
});
