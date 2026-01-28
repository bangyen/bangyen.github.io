import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar, handleToolbar } from '../Toolbar';
import { EditorContext } from '../EditorContext';

// Mock components
jest.mock('../../../components/ui/Controls', () => ({
    TooltipButton: ({ title, onClick, disabled }: any) => (
        <button
            data-testid={`btn-${title}`}
            onClick={onClick}
            disabled={disabled}
        >
            {title}
        </button>
    ),
}));

// Mock icons
jest.mock('../../../components/icons', () => ({
    FirstPageRounded: () => <span>First</span>,
    LastPageRounded: () => <span>Last</span>,
    NavigateBeforeRounded: () => <span>Prev</span>,
    NavigateNextRounded: () => <span>Next</span>,
    PlayArrowRounded: () => <span>Play</span>,
    PauseRounded: () => <span>Pause</span>,
}));

// Mock useMediaQuery
jest.mock('../../../components/mui', () => ({
    useMediaQuery: jest.fn(() => true), // Desktop by default
}));

describe('Toolbar Component and handleToolbar', () => {
    const mockDispatch = jest.fn();
    const mockCreate = jest.fn();
    const mockClear = jest.fn();
    const mockNextIter = jest.fn();

    const mockPayload = {
        dispatch: mockDispatch,
        create: mockCreate,
        clear: mockClear,
        nextIter: mockNextIter,
        start: {},
    };

    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn().mockResolvedValue(undefined),
            },
        });
    });

    describe('handleToolbar', () => {
        test('handles run action', () => {
            const result = handleToolbar(
                {},
                { type: 'run', payload: mockPayload as any }
            );
            expect(mockCreate).toHaveBeenCalled();
            expect(result.pause).toBe(false);
        });

        test('handles stop action', () => {
            const result = handleToolbar(
                {},
                { type: 'stop', payload: mockPayload as any }
            );
            expect(mockClear).toHaveBeenCalled();
            expect(result.pause).toBe(true);
        });

        test('handles reset action with confirmation', () => {
            (window.confirm as jest.Mock).mockReturnValue(true);
            const result = handleToolbar(
                {},
                { type: 'reset', payload: mockPayload as any }
            );
            expect(window.confirm).toHaveBeenCalled();
            expect(mockNextIter).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'clear' })
            );
            expect(result.pause).toBe(true);
        });

        test('handles reset action without confirmation', () => {
            (window.confirm as jest.Mock).mockReturnValue(false);
            const result = handleToolbar(
                {},
                { type: 'reset', payload: mockPayload as any }
            );
            expect(mockNextIter).not.toHaveBeenCalled();
        });

        test('handles timer action (next)', () => {
            handleToolbar(
                { end: false },
                { type: 'timer', payload: mockPayload as any }
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'next' })
            );
        });

        test('handles timer action (stop)', () => {
            handleToolbar(
                { end: true },
                { type: 'timer', payload: mockPayload as any }
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'stop' })
            );
        });

        test('handles prev action', () => {
            const result = handleToolbar(
                {},
                { type: 'prev', payload: mockPayload as any }
            );
            expect(mockNextIter).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'prev' })
            );
            expect(result.pause).toBe(true);
        });

        test('handles next action', () => {
            const result = handleToolbar(
                {},
                { type: 'next', payload: mockPayload as any }
            );
            expect(mockNextIter).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'next' })
            );
        });

        test('handles share action', () => {
            handleToolbar({}, { type: 'share', payload: mockPayload as any });
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
        });
    });

    describe('Toolbar Component', () => {
        const renderToolbar = (contextValue: any) => {
            return render(
                <EditorContext.Provider value={contextValue}>
                    <Toolbar />
                </EditorContext.Provider>
            );
        };

        test('renders nothing without context', () => {
            const { container } = render(
                <EditorContext.Provider value={null}>
                    <Toolbar />
                </EditorContext.Provider>
            );
            expect(container).toBeEmptyDOMElement();
        });

        test('renders buttons correctly', () => {
            const context = {
                name: 'Test Lang',
                pause: true,
                dispatch: jest.fn(() => jest.fn()),
                fastForward: true,
            };
            renderToolbar(context);
            expect(screen.getByTestId('btn-Run')).toBeInTheDocument();
            expect(screen.getByTestId('btn-Reset')).toBeInTheDocument();
            expect(screen.getByTestId('btn-Fast Forward')).toBeInTheDocument();
            expect(screen.getByTestId('btn-Previous')).toBeInTheDocument();
            expect(screen.getByTestId('btn-Next')).toBeInTheDocument();
        });

        test('renders Pause button when not paused', () => {
            const context = {
                name: 'Test Lang',
                pause: false,
                dispatch: jest.fn(() => jest.fn()),
            };
            renderToolbar(context);
            expect(screen.getByTestId('btn-Pause')).toBeInTheDocument();
        });

        test('disables Fast Forward when flag is false', () => {
            const context = {
                name: 'Test Lang',
                pause: true,
                dispatch: jest.fn(() => jest.fn()),
                fastForward: false,
            };
            renderToolbar(context);
            expect(screen.getByTestId('btn-Fast Forward')).toBeDisabled();
        });
    });
});
